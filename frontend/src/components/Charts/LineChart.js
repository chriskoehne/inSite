import React, { Component } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from '@faker-js/faker';

/*
The idea is that you select a chart, then click the share button on the bottom which will have autofilled your chart selection and then provide you with sharing options such as
url, reddit, twitter, etc
*/

export default class LineChart extends Component {

  render() {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
          backgroundColor: this.props.color,
          borderColor: this.props.color,
        },
      ],
    };

    return (
        <Line data={data} onClick={this.props.onClick} ref={this.props.chartRef} 
        options={{ responsive: true, maintainAspectRatio: false }}
        />
    );
  }
}