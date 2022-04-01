const c = require('./constants/constants');

let getMonths = function (comments) {
        //console.log(comments)
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let monthArr = ['', '', '', '', '', '', '', '', '', '', '', ''];
        let monthArrYear = ['', '', '', '', '', '', '', '', '', '', '', ''];
        // let currentTime = new Date().getTime();
        let currentYear = new Date()
        comments.forEach(e => {
            //e.data.created
            if (e.created >= currentYear.getTime() / 1000 - 31556926) {
                let d = new Date(e.created * 1000); //get current Date
                arr[d.getMonth()] += 1;
            } 
        });
        for (let i = 0; i < 12; i++) {
            let x = new Date();
            x.setMonth(x.getMonth() - i)
            monthArrYear[i] = c.MONTHS[x.getMonth()] + " " + x.getFullYear();
            monthArr[i] = c.MONTHS[x.getMonth()]
        }
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
        if (e.created >= currentYear.getTime() / 1000 - 604800) {
            let d = new Date(e.created * 1000); //get current Date
            arr[d.getDay()] += 1;
        }
    });
    for (let i = 0; i < 7; i++) {
        let x = new Date();
        x.setDate(x.getDate() - i)
        dayArr[i] = c.WEEK[x.getDay()]
    }
    let numComm = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
        numComm[i] = arr[c.WEEKKEY[dayArr[i]]]
    } 
    return { daysOfWeek: dayArr, numComments: numComm }
}

let getLastThirty = function (comments) {
    let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dayArr = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    let currentYear = new Date()
    comments.forEach(e => {
        if (e.created >= currentYear.getTime() / 1000 - 86400 * 30) {
            let day = Math.ceil((currentYear.getTime() / 1000 - e.created)/ 86400);
            if ((currentYear.getTime() / 1000 - e.created)/ 86400 <= .5) {
                day = Math.floor((currentYear.getTime() / 1000 - e.created)/ 86400);
            }
            arr[day] += 1;
        }
    });
    for (let i = 0; i < 30; i++) {
        let x = new Date();
        x.setDate(x.getDate() - i)
        dayArr[i] = (x.getMonth() + 1) +  "/" + x.getDate()
    }
    return { lastThirty: dayArr, numComments: arr }
}

export { getMonths, getDays, getLastThirty }