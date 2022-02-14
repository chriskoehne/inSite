import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { RWebShare } from "react-web-share";
import { saveAs } from 'file-saver';

// we need a secure site (https) for react-web-share to work

import BarChart from "./exampleChart";

export default class Home extends Component {
    constructor(props) {
        super(props);
    
        this.onClick = this.onClick.bind(this);
        this.saveCanvas = this.saveCanvas.bind(this);
        this.chartRef = React.createRef();
    
        this.state = {
            url: "",
            id: {}
          };
    
      }
    
      onClick(e) {
        e.preventDefault();
        console.log("chart clicked");
        console.log(this.chartRef.current.toBase64Image());
        this.setState({
            url: this.chartRef.current.toBase64Image(),
            id: document.getElementById('testChart')
        });
        // console.log(this.chartRef)
    
      }

      saveCanvas() {
        //save to png
        console.log(this.state.id)
        const canvasSave = this.state.id
        canvasSave.toBlob(function (blob) {
            saveAs(blob, "testing.png")
        })
    }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <div id="testChart">
        <BarChart onClick={this.onClick} chartRef={this.chartRef}/>
        </div>
        
        <RWebShare
          data={{
            text: "Example chart download",
            url: this.state.url.toString(),
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
