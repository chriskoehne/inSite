import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card, Col, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarChart from '../Charts/BarChart';
import styles from './Reddit.module.css';
import { TagCloud } from 'react-tagcloud';
const c = require('./constants/constants');

let getMonths = function (comments) {
        //console.log(comments)
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let monthArr = ['', '', '', '', '', '', '', '', '', '', '', ''];
        let monthArrYear = ['', '', '', '', '', '', '', '', '', '', '', ''];
        let currentTime = new Date().getTime();
        let currentYear = new Date()
        comments.forEach(e => {
            //e.data.created
            //console.log(e.data.created)
            if (e.data.created >= currentYear.getTime() / 1000 - 31556926) {
                let d = new Date(e.data.created * 1000); //get current Date
                arr[d.getMonth()] += 1;
            } 
        });
        console.log(arr)
        for (let i = 0; i < 12; i++) {
            let x = new Date();
            x.setMonth(x.getMonth() - i)
            monthArrYear[i] = c.MONTHS[x.getMonth()] + " " + x.getFullYear();
            monthArr[i] = c.MONTHS[x.getMonth()]
        }
        console.log(monthArrYear)
        let numComm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 12; i++) {
            numComm[i] = arr[c.MONTHSKEY[monthArr[i]]]
        }
        return { monthYear: monthArrYear, numComments: numComm }
    }

export { getMonths }