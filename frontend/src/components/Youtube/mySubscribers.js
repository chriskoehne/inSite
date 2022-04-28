const ytc = require('./constants/moreConstants');

let getMonths = function (subscribers) {
        //console.log(subscribers)
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let monthArr = ['', '', '', '', '', '', '', '', '', '', '', ''];
        let monthArrYear = ['', '', '', '', '', '', '', '', '', '', '', ''];
        // let currentTime = new Date().getTime();
        let currentYear = new Date()
        subscribers.forEach(e => {
            //e.data.created
            let dt = new Date(e.snippet.publishedAt)
            if (dt >= currentYear.getTime() / 1000 - 31556926) {
                let d = new Date(dt * 1000); //get current Date
                arr[d.getMonth()] += 1;
            } 
        });
        for (let i = 0; i < 12; i++) {
            let x = new Date();
            x.setMonth(x.getMonth() - i)
            monthArrYear[i] = ytc.MONTHS[x.getMonth()] + " " + x.getFullYear();
            monthArr[i] = ytc.MONTHS[x.getMonth()]
        }
        let numComm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 12; i++) {
            numComm[i] = arr[ytc.MONTHSKEY[monthArr[i]]]
        }
        return { monthYear: monthArrYear, numSubscribers: numComm }
    }

let getDays = function(subscribers) {
    let arr = [0, 0, 0, 0, 0, 0, 0];
    let dayArr = ['', '', '', '', '', '', ''];
    let currentYear = new Date()
    subscribers.forEach(e => {
        //e.data.created
        let dt = new Date(e.snippet.publishedAt)
        console.log("Published At Time is: " + e.snippet.publishedAt)
        console.log("DT is: " + dt + "current year.getTime(): " + currentYear.getTime())
        if (dt >= currentYear.getTime() / 1000 - 604800) {
            let d = new Date(dt * 1000); //get current Date
            arr[d.getDay()] += 1;
        }
    });
    for (let i = 0; i < 7; i++) {
        let x = new Date();
        x.setDate(x.getDate() - i)
        dayArr[i] = ytc.WEEK[x.getDay()]
    }
    let numComm = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
        numComm[i] = arr[ytc.WEEKKEY[dayArr[i]]]
    } 
    return { daysOfWeek: dayArr, numSubscribers: numComm }
}

let getLastThirty = function (subscribers) {
    let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dayArr = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    let currentYear = new Date()
    subscribers.forEach(e => {
      let dt = new Date(e.snippet.publishedAt)
        if (dt >= currentYear.getTime() / 1000 - 86400 * 30) {
            let day = Math.ceil((currentYear.getTime() / 1000 - dt)/ 86400);
            if ((currentYear.getTime() / 1000 - dt)/ 86400 <= .5) {
                day = Math.floor((currentYear.getTime() / 1000 - dt)/ 86400);
            }
            arr[day] += 1;
        }
    });
    for (let i = 0; i < 30; i++) {
        let x = new Date();
        x.setDate(x.getDate() - i)
        dayArr[i] = (x.getMonth() + 1) +  "/" + x.getDate()
    }
    return { lastThirty: dayArr, numSubscribers: arr }
}

export { getMonths, getDays, getLastThirty }