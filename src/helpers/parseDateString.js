const { DateTime } = require("luxon");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function parseDateString(date) {
  const parsedDate = new Date(date);
  return {
    year: parsedDate.getFullYear(),
    month: months[parsedDate.getMonth()],
    day: days[parsedDate.getDay()],
    date: parsedDate.getDate(),
    hour: parsedDate.getHours(),
    minute: parsedDate.getMinutes(),
    second: parsedDate.getSeconds(),
    millisecond: parsedDate.getMilliseconds()
  };
}

module.exports = parseDateString;