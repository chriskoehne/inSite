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

let getDays = function(comments) {
    let arr = [0, 0, 0, 0, 0, 0, 0];
    let dayArr = ['', '', '', '', '', '', ''];
    let currentYear = new Date()
    comments.forEach(e => {
        //e.data.created
        //console.log(e.data.created)
        if (e.data.created >= currentYear.getTime() / 1000 - 604800) {
            let d = new Date(e.data.created * 1000); //get current Date
            arr[d.getDay()] += 1;
        }
    });
    for (let i = 0; i < 7; i++) {
        let x = new Date();
        x.setDate(x.getDate() - i)
        console.log(x)
        dayArr[i] = c.WEEK[x.getDay()]
    }
    console.log(dayArr)
    let numComm = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
        numComm[i] = arr[c.WEEKKEY[dayArr[i]]]
    } 
    console.log(numComm)
    return { daysOfWeek: dayArr, numComments: numComm }
}

export { getMonths, getDays }