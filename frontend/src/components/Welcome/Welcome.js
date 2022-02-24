import React, { useState, useEffect } from 'react';
import { Stage, Layer, Shape, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Welcome.module.css';

const Welcome = (props) => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const checkSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleLogInButton = () => {
    props.navigate('/login');
  };
  const handleCreateAccountButton = () => {
    props.navigate('/createAccount');
  };

  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Html>
          <div>
            <div style={{ userSelect: 'none' }}>
              <div className={styles.inlineDiv}>
                <h1 className={styles.in}>in</h1>
                <h1 className={styles.site}>Site</h1>
              </div>
              <br />
              <div className={styles.taglineDiv}>
                <h2 className={styles.taglinePt1}>
                  Social media metrics <br /> at the {''}
                  <div className={styles.taglinePt2}>click of a button.</div>
                </h2>
              </div>
            </div>
          </div>
        </Html>
        <Html>
          <div className={styles.buttonsDiv}>
            <div className='row'>
              <div className='col-6'>
                <Button className={styles.buttons} onClick={handleLogInButton}>
                  Log In
                </Button>
              </div>
              <div className='col-6'>
                <Button
                  className={styles.buttons}
                  onClick={handleCreateAccountButton}
                >
                  Create Account
                </Button>{' '}
              </div>
            </div>
          </div>
        </Html>

        {/* for the background color */}
        <Rect width={size.width} height={size.height} fill='#3d3d3d' />

        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(size.width * 0.1, size.height);
            context.lineTo(size.width * 0.3, size.height);
            context.lineTo(size.width, 0);
            context.lineTo(size.width * 0.8, 0);
            context.closePath();
            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
          }}
          fill='#F9C449'
        />
      </Layer>
    </Stage>
  );
};

export default Welcome;
