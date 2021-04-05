// https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetimegetRandomTimestamp()
let dateToTimestamp = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// https://stackoverflow.com/questions/31378526/generate-random-date-between-two-dates-and-times-in-javascript
let randomDate = (date1, date2) => {
    function randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970';
    var date2 = date2 || new Date().toLocaleDateString();
    date1 = new Date(date1).getTime();
    date2 = new Date(date2).getTime();
    if(date1 > date2){
        return new Date(randomValueBetween(date2,date1));
    } else{
        return new Date(randomValueBetween(date1, date2));

    }
}

let timestampToDate = (timestamp) => {
    return new Date(Date.parse(timestamp));
};

let diffDaysBetweenDates = (date1, date2) => {
    return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
}

module.exports = {
    dateToTimestamp,
    timestampToDate,
    randomDate,
    diffDaysBetweenDates,
}

