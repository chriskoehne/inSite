import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { RWebShare } from "react-web-share";
import { saveAs } from "file-saver";

// we need a secure site (https) for react-web-share to work

import BarChart from "./exampleChart";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.saveCanvas = this.saveCanvas.bind(this);
    this.chartRef = React.createRef();

    this.state = {
      url: ""
    };
  }

  async onClick(e) {
    e.preventDefault();
    const response = await fetch(this.chartRef.current.toBase64Image());
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    console.log("return is")
    console.log(file)
    this.setState({
      file: file,
    });
    // console.log(this.chartRef)
  }

  saveCanvas() {
    //save to png
    const canvasSave = this.chartRef.current.ctx.canvas;
    canvasSave.toBlob(function (blob) {
      saveAs(blob, "testing.png");
    });
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <BarChart onClick={this.onClick} chartRef={this.chartRef} />

        <RWebShare
          data={{
            text: "Example chart download",
            files: [this.state.file],
            title: "Chart",
          }}
          sites={["copy", "mail", "reddit", "twitter"]}
          onClick={() => console.log("shared successfully!")}
        >
          <button>Share 🔗</button>
        </RWebShare>
        <b></b>
        <button onClick={this.saveCanvas}>Download as PNG</button>
      </div>
    );
  }
}
