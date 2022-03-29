const section = document.querySelector("section");
const movieTitle = section.dataset.movie;
let showid;

const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".book-show-popup");

const popupMovieTitle = document.querySelector(".popup-movie-title");
const popupTheatreName = document.querySelector(".popup-theatre-name");
const popupShowTime = document.querySelector(".show-timing");
const popupPriceVal = document.querySelector(".price-value");
const popupTotalPriceVal = document.querySelector(".total-price-val");

const ticketsVal = document.querySelector(".ticket-value");
const plusBtn = document.querySelector(".plus-btn");
const minusBtn = document.querySelector(".minus-btn");

const popupCancelBtn = document.querySelector(".popup-cancel-btn");
const popupBookBtn = document.querySelector(".popup-book-btn");

function onClickBookShowBtn(e) {
  if (e.target.classList.contains("show-timing-item")) {
    showid = e.target.dataset.id;
    overlay.classList.add("overlay-active");
    popup.classList.add("popup-active");
    popupMovieTitle.innerHTML = movieTitle;
    popupTheatreName.innerHTML = e.target.dataset.theatrename;
    popupShowTime.innerHTML =
      e.target.dataset.showdate + ", " + e.target.dataset.showtime;
    popupPriceVal.innerHTML = popupTotalPriceVal.innerHTML =
      e.target.dataset.showprice + "₹";
    ticketsVal.innerHTML = 1;
  }
}

function onClickPlusBtn() {
  let noOfTickets = +ticketsVal.innerHTML;
  if (noOfTickets === 5) return;
  noOfTickets++;
  ticketsVal.innerHTML = noOfTickets;
  let oneTicketPrice = popupPriceVal.innerHTML.slice(0, -1);
  popupTotalPriceVal.innerHTML = +oneTicketPrice * noOfTickets + "₹";
}

function onClickMinusBtn() {
  let noOfTickets = +ticketsVal.innerHTML;
  if (noOfTickets === 1) return;
  noOfTickets--;
  ticketsVal.innerHTML = noOfTickets;
  let oneTicketPrice = popupPriceVal.innerHTML.slice(0, -1);
  popupTotalPriceVal.innerHTML = +oneTicketPrice * noOfTickets + "₹";
}

function onClickPopupCancelBtn() {
  overlay.classList.remove("overlay-active");
  popup.classList.remove("popup-active");
  ticketsVal.innerHTML = 1;
}

const errorPopup = document.querySelector(".error-popup");
const errorPopupMessage = document.querySelector(".error-popup-message");
const errorPopupOkayBtn = document.querySelector(".error-popup-okay-btn");

async function onClickPopupBookBtn() {
  popup.classList.remove("popup-active");
  const totalTickets = +ticketsVal.innerHTML;
  const res = await fetch(`/book-show/${showid}/${totalTickets}`, {
    method: "POST",
  });
  const msg = await res.json();
  if (!res.ok) {
    errorPopupMessage.classList.toggle("success-response-message", false);
    errorPopupOkayBtn.classList.toggle("success-response", false);
    errorPopupMessage.classList.toggle("error-response-message", true);
    errorPopupOkayBtn.classList.toggle("error-response", true);
  } else {
    errorPopupMessage.classList.toggle("error-response-message", false);
    errorPopupOkayBtn.classList.toggle("error-response", false);
    errorPopupMessage.classList.toggle("success-response-message", true);
    errorPopupOkayBtn.classList.toggle("success-response", true);
  }
  errorPopup.classList.add("error-popup-active");
  errorPopupMessage.innerHTML = msg.message;
}

function onClickErrorPopupOkayBtn() {
  errorPopup.classList.remove("error-popup-active");
  overlay.classList.remove("overlay-active");
}

section.addEventListener("click", onClickBookShowBtn);
popupCancelBtn.addEventListener("click", onClickPopupCancelBtn);
popupBookBtn.addEventListener("click", onClickPopupBookBtn);

plusBtn.addEventListener("click", onClickPlusBtn);
minusBtn.addEventListener("click", onClickMinusBtn);

errorPopupOkayBtn.addEventListener("click", onClickErrorPopupOkayBtn);
