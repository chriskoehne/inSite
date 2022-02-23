import React, { Component } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "@faker-js/faker";

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
}

const BarChart = (props) => {
  const toDisplay = props.data;
  const maxLabel = props.maxVal;
  const label = props.label;
  const xaxis = props.xaxis

  console.log("in barchart")
  console.log(toDisplay)
  console.log(maxLabel)

  const labels = generateList(0, maxLabel, Math.min(10, maxLabel)); // limit number of categories to 10

  //group toDisplay into label categories. dataset data must be [{x: label field, y: count}, {}, {}]
  const partitionedData = [];
  var count = 0;
  labels.forEach(function (item, index) {
    count = 0;
    toDisplay.forEach(function (innerItem, innerIndex){
      if (item === innerItem) {
        count += 1;
      }
    });
    partitionedData.push({x:item, y:count})
  });


  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: partitionedData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
