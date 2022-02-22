/**
 * @fileoverview The idea is that you select a chart, then click the share button on the bottom which will
 * have autofilled your chart selection and then provide you with sharing options such as url, reddit, twitter, etc
 * It may be a good idea to break this into separate files down the line if it gets too bloated
 * @author Tom Appenzeller <tomapp3@gmail.com>
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

import React, { useRef, forwardRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { propTypes } from 'react-bootstrap/esm/Image';

ChartJS.register(ArcElement, Tooltip, Legend);
const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const PieChart = forwardRef((props, ref) => {
  const { base64, ...rest } = props
  return (
    <Pie
      data={data}
      ref={ref}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: props.base64
        },
      }}
      {...rest}
    />
  );
});

export default PieChart;
