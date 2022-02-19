// import React, { useState } from 'react';
import React, { useState } from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";
import BarChart from "../charts/barChart";
import LineChart from "../charts/lineChart";
import PieChart from "../charts/pieChart";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";


function Dropdown({title, items =[], styles}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);

  function handleOnClick(item) {}

  return (
    <div className="ddWrapper">
      <div 
      tabIndex={0} 
      className="ddHeader" 
      role="button" 
      onKeyPress={() => toggle(!open)} 
      onClick={() => toggle(!open)}>
        <div className="ddHeaderTitle">
          <p className="ddHeaderTitle">{title}</p>
        </div>
        <div className="ddHeaderAction">
        </div>
      </div>
      {open && (
        <ul className="ddList">
          {items.map(item => (
            <li className="ddListItem" key={item.id}>
              <button type="button" onClick={() => (handleOnClick(item))}>
                <span>{item.value}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown;
