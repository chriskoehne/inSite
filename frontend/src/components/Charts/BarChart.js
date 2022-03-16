import React, { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
import { RWebShare } from 'react-web-share';
import { saveAs } from 'file-saver';
const pica = require('pica')();

// import faker from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const generateList = (min, max, steps) => {
  // minimum step size
  let stepsize = (max - min) / steps;
  // increase the step size to a nice boundary
  // for example, 1/10th of the 10^n range that includes it
  let pow = Math.trunc(Math.log10(stepsize)) - 1;
  stepsize = Math.trunc(stepsize / 10 ** pow) * 10 ** pow;
  // round min to the same boundary
  let result = [min];
  min = Math.trunc(min / 10 ** pow) * 10 ** pow;
  for (let i = 0; i < steps - 1; i++) {
    min += stepsize;
    result.push(min);
  }
  result.push(max);
  return result;
};

const BarChart = (props) => {
  let reader = new FileReader();

  const toDisplay = props.data;
  const maxLabel = props.maxVal;
  const label = props.label;

  const [base64, setBase64] = useState('');
  const [url, setUrl] = useState('');
  const chartRef = useRef(null);

  const labels = generateList(0, maxLabel, Math.min(10, maxLabel)); // limit number of categories to 10

  //group toDisplay into label categories. dataset data must be [{x: label field, y: count}, {}, {}]
  const partitionedData = [];
  var count = 0;
  labels.forEach(function (item, index) {
    count = 0;
    toDisplay.forEach(function (innerItem, innerIndex) {
      if (item === innerItem) {
        count += 1;
      }
    });
    partitionedData.push({ x: item, y: count });
  });

  const createBlob = async () => {
    const canvasSave = chartRef.current.ctx.canvas;
    let offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = canvasSave.width / 2;
    offScreenCanvas.height = canvasSave.height / 2;
    const resized = await pica.resize(
      chartRef.current.ctx.canvas,
      offScreenCanvas
    );
    const blob = await pica.toBlob(resized, 'image/png', 0.9);
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      // console.log(base64data);
      setBase64(base64data);
    };
  };

  useEffect(() => {
    const uploadChart = async () => {
      if (url) {
        return;
      } else {
        const body = { image: base64 };
        try {
          const cloudinaryRes = await axios.post(
            'http://localhost:5000/uploadImage/',
            body
          );
          if (cloudinaryRes.status !== 200) {
            console.log('cloudinary error');
          }
          setUrl(cloudinaryRes.data.message);
          return;
        } catch (err) {
          console.log(err);
        }
      }
    };
    if (chartRef && base64) {
      uploadChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base64]);

  const saveCanvas = async () => {
    const canvasSave = chartRef.current.ctx.canvas;
    canvasSave.toBlob((blob) => {
      console.log(blob);
      saveAs(blob, 'chart.png');
    });
  };

  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: partitionedData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div>
      <div style={{ height: props.height }}>
        <Bar
          data={data}
          onClick={props.onClick}
          ref={chartRef}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            // animation: {
            //   duration: 0,
            // },
          }}
        />
      </div>
      <RWebShare
        data={{
          text: 'My inSite Chart',
          url: url ? url : 'unable to share chart',
          title: 'Chart',
        }}
        sites={['copy', 'mail', 'reddit', 'twitter']}
      >
        <button onMouseOver={() => createBlob()}>Share 🔗</button>
      </RWebShare>
      <button onClick={saveCanvas}>Download as PNG</button>
    </div>
  );
};

export default BarChart;
