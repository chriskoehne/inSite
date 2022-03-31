import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Button, Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";
import { SocialIcon } from "react-social-icons";
import BarChart from "../Charts/BarChart";
import ReactTooltip from 'react-tooltip';

const YoutubeCard = (props) => {
  const [youtubeToken, setYoutubeToken] = useState("");
  const [user, setUser] = useState({ email: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [playlistCounts, setPlaylistCounts] = useState([]);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty("youtubeToken")) {
      return false;
    }
    const date = JSON.parse(localStorage.getItem("youtubeToken")).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      localStorage.removeItem("youtubeToken");
      return false;
    }
    return true;
  };

  useEffect(() => {
    let c = null;
    const e = localStorage.getItem("email");
    const currentUrl = window.location.href;
    if (currentUrl.includes("code") && currentUrl.includes("scope")) {
      let start = currentUrl.indexOf("code") + 5;
      let end = currentUrl.indexOf("&scope");
      c = currentUrl.substring(start, end);
      setUser({
        email: e,
        code: c,
      });
    } else {
      setUser({
        email: e,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post("/youtube/codeToToken/", {
        code: user.code,
      });
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        localStorage.setItem(
          "youtubeToken",
          JSON.stringify({ token: token, date: Date.now() })
        );
        setYoutubeToken(token);
      }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setYoutubeToken(JSON.parse(localStorage.getItem("youtubeToken")).token);
    }
  }, [user]);

  // a separate use effect to store the token in local storage and make a call for the initial graph
  useEffect(() => {
    if (!hasToken() && youtubeToken) {
      localStorage.setItem(
        "youtubeToken",
        JSON.stringify({ token: youtubeToken, date: Date.now() })
      );
    }

    const callYoutube = async () => {
      setLoading(true);
      if (activity.length === 0) {
        const act = await axios.get("/youtube/activity");
        console.log("got activity:");
        console.log(act);
        if (act.status === 200) {
          setActivity(act.data.list);
          const subs = await axios.get("/youtube/subscriptions");
          console.log("got subs");
          console.log(subs);
          if (subs.status === 200) {
            setSubscriptions(subs.data.list);
            console.log(subscriptions);
          }
        }
      }
      const youtubePlaylists = await axios.get("/youtube/playlists");
      // for each in youtubePlaylists.data.list:
      // item.contentDetails.itemCount
      let itemCounts = [];
      youtubePlaylists.data.list.forEach((item) => {
        itemCounts.push(item.contentDetails.itemCount);
      });
      setPlaylistCounts(itemCounts);

      setLoading(false);
    };
    if (youtubeToken) {
      console.log("Calling YouTube");
      callYoutube();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeToken]);

  const getMaxCount = (list) => {
    if (loading) {
      return {};
    }
    var maxCount = 0;
    list.forEach(function (item, index) {
      if (item > maxCount) {
        maxCount = item;
      }
    });
    return maxCount;
  };

  const authenticateYoutube = async (e) => {
    e.preventDefault();
    //create link to go to
    const result = await axios.post("/youtube/login/", {
      email: user.email,
    });
    if (result.data.success) {
      window.location.href = result.data.link;
    } else {
      console.log("there was an error in youtube user signup");
    }
    return;
  };

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (hasToken()) {
      return (
        <BarChart
          height={"60vh"}
          data={playlistCounts}
          maxVal={getMaxCount(playlistCounts)}
          label="Playlist Counts"
          xaxis="PlaylistCounts"
        />
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button
            className={`${styles.buttons} ${styles.youtubeB}`}
            data-tip='Connect your YouTube account to inSite to begin seeing your YouTube usage metrics!'
            onClick={authenticateYoutube}
          >
            Authorize YouTube
          </Button>
          <ReactTooltip/>
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon fgColor="white" url="https://youtube.com/kanyewest" />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: "var(--youtube)" }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>{icon()} Youtube
            <Button
                className={`${styles.buttons} ${styles.youtubeB}`}
                data-tip="See more insights about your YouTube, such as playlist count and reccomendations"
                style={{ float: "right" }}
                onClick={function () {
                  props.navigate("youtube", {
                    state: { email: user.email, accessToken: youtubeToken },
                  });
                }}
              >
                See more
              </Button>
          </Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default YoutubeCard;
