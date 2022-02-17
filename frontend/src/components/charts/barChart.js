import React, { Component } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
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
      BarElement,
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
          data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Dataset 2',
          data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };

    return (
      <div>        
        <Bar data={data} onClick={this.props.onClick} ref={this.props.chartRef} 
        width="30%"
        options={{ maintainAspectRatio: false }}
        />
        
      </div>
    );
  }
}
