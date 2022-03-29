const moment = require("moment");

function isEmailConfirmed(email, confirmemail) {
  return email === confirmemail;
}

function isPasswordValid(password) {
  password = password.trim();
  return password.length >= 6 && password.length <= 20;
}

function isEmailValid(email) {
  return email && email.trim() !== "";
}

function isAddMovieFormValid(movieData) {
  if (
    movieData.title === "" ||
    movieData.release_date === "" ||
    movieData.image === "undefined"
  )
    return false;
  else return true;
}

function isAddTheatreFormValid(theatreData) {
  if (theatreData.name === "" || theatreData.address === "") return false;
  else return true;
}

function isAddShowFormNonEmpty(showData) {
  if (
    showData.show_date === "" ||
    showData.show_time === "" ||
    showData.total_capacity === "" ||
    showData.price === ""
  ) {
    return false;
  } else {
    return true;
  }
}

function isCapacityValid(capacity) {
  return +capacity >= 10 && +capacity <= 100;
}

function isPriceValid(price) {
  return +price >= 60 && +price <= 300;
}

function isShowdateValid(data) {
  const showdate = moment(data.show_date + "T" + data.show_time);
  const moviereleasedate = moment(data.movie_release_date[0].release_date);
  const currentdate = moment();
  return showdate > moviereleasedate && showdate > currentdate;
  // const { _data: diffBtwShowAndCurrDate } = moment.duration(
  //   showdate.diff(currentdate)
  // );
  // const { _data: diffBtwShowAndMovieReleaseDate } = moment.duration(
  //   showdate.diff(moviereleasedate)
  // );
  // console.log(
  //   moviereleasedate,
  //   showdate,
  //   moviereleasedate,
  //   diffBtwShowAndCurrDate,
  //   diffBtwShowAndMovieReleaseDate
  // );
  // return (
  //   diffBtwShowAndCurrDate.days > 0 && diffBtwShowAndMovieReleaseDate.days > 0
  // );
}

function isShowtimeValid(data) {
  const showtime = moment.duration(data.show_time);
  const showtimeHrs = showtime.hours();
  const showtimeMns = showtime.minutes();
  if (showtimeHrs >= 8 && showtimeHrs < 22) return true;
  else if (showtimeHrs === 22 && showtimeMns === 0) return true;
  else if (showtimeHrs === 22 && showtimeMns > 0) return false;
  else return false;
}

module.exports = {
  isEmailConfirmed: isEmailConfirmed,
  isPasswordValid: isPasswordValid,
  isEmailValid: isEmailValid,
  isAddMovieFormValid: isAddMovieFormValid,
  isAddTheatreFormValid: isAddTheatreFormValid,
  isAddShowFormNonEmpty: isAddShowFormNonEmpty,
  isCapacityValid: isCapacityValid,
  isPriceValid: isPriceValid,
  isShowdateValid: isShowdateValid,
  isShowtimeValid: isShowtimeValid,
};
