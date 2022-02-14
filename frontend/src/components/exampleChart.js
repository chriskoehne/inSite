import React, { Component } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { RWebShare } from "react-web-share";

// defaults.global.tooltips.enabled = false
// defaults.global.legend.position = 'bottom'

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.chartRef = React.createRef();

  }

  componentDidMount() {
    //   console.log(this.chartRef.current.toBase64Image());
  }

  onClick(e) {
    e.preventDefault();
    console.log("chart clicked");
    console.log(this.chartRef.current.toBase64Image());
    // console.log(this.chartRef)

  }

  render() {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // const chartRef = useRef(null);

    return (
      <div>
        {/* <Pie data={data} onClick={this.onClick}/> */}
        <Pie data={data} onClick={this.onClick} ref={this.chartRef}/>
        <RWebShare
          data={{
            text: "Example chart download",
            url: "https://on.natgeo.com/2zHaNup",
            title: "Chart",
          }}
          sites={["copy", "mail", "reddit", "twitter"]}
          onClick={() => console.log("shared successfully!")}
        >
            <button>Share 🔗</button>
        </RWebShare>
      </div>
    );
  }
}
