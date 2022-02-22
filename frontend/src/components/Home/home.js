/**
 * @fileoverview A demo of the sharing functionality. We use the Cloudinary api to host the image,
 * as you cannot directly share image files to external websites
 * @author Tom Appenzeller <tomapp3@gmail.com>
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

import React, { useState, useEffect, useRef } from 'react';
import PieChart from '../Charts/PieChart';
import axios from "axios";
import { RWebShare } from 'react-web-share';
import { saveAs } from 'file-saver';

// we need a secure site (https) for react-web-share to work

const Home = (props) => {
  const [base64, setBase64] = useState('');
  const [url, setUrl] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    console.log(base64);
    if (base64) {
      uploadChart();
    }
  }, [base64]);

  const saveCanvas = () => {
    const canvasSave = chartRef.current.ctx.canvas;
    canvasSave.toBlob((blob) => {
      saveAs(blob, 'chart.png');
    });
  };

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

  return (
    <div>
      <h1>Home</h1>
      <div style={{ height: '100%' }}>
        <PieChart
          ref={chartRef}
          base64={() => {
            setBase64(chartRef.current.toBase64Image());
          }}
        />
      </div>
      <RWebShare
        data={{
          text: 'Example chart download',
          url: url ? url : 'unable to share chart',
          title: 'Chart',
        }}
        sites={['copy', 'mail', 'reddit', 'twitter']}
      >
        <button>Share 🔗</button>
      </RWebShare>
      <b></b>
      <button onClick={saveCanvas}>Download as PNG</button>
    </div>
  );
};

export default Home;
