import React, { Component } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import BarChart from './exampleChart';

export default class Home extends Component {
    render() {
        return (
            <div>
                <h1>Home</h1>
                <BarChart/>
            </div>
        );
    }
}