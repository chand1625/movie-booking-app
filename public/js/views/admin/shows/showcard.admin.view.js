import adminMenuView from "../admin.menu.view.js";

class showcardAdminView extends adminMenuView {
  btn;
  parentEle = document.querySelector(".content");

  generateMarkup(data, secondary_data) {
    let markup = "";
    markup += `<div class="show-type ${data[1]
      .split(" ")[0]
      .toLowerCase()}-show">${data[1]}</div>`;

    for (const show of data[0]) {
      const isActive = show.is_active ? "Active" : "Not active";
      const isEditable = show.is_editable
        ? `<div class="showcardbtn-container" data-id="${show.id}" data-movieid="${show.movie_id}" data-movietitle="${show.title}" data-theatreid="${show.theatre_id}" data-showdate="${show.show_date}" data-showtime="${show.show_time}" data-totalcapacity="${show.total_capacity}" data-price="${show.price}" data-isactive="${show.is_active}">
      <button class="admincard-btn show-editbtn">Edit</button>
      <button class="admincard-btn show-deletebtn">Delete</button>
    </div>`
        : `<div class="showcardbtn-error-container"><div>${show.edit_reason}</div></div>`;

      markup += `<div class="admin-show-card">
          <div class="show-details-container">
            <h3 class="movie-name">${show.title}</h3>
            <h4 class="show-theatre-name">${show.name}</h4>
            <p class="show-capacity">Total seats : ${show.total_capacity}</p>
            <p class="show-capacity available-seats">Booked seats : ${
              show.total_capacity - show.current_capacity
            }</p>
            <p class="isActive ${isActive.replace(/ /g, "")}">${isActive}</p>
            </div>
          <div class="show-details-container2">
            <p class="show-price">Price <span class="price-number">${
              show.price
            } ₹</span></p>
            <p class="show-day ${show.showday_style_color}">${
        show.show_day_display
      }</p>
            <p class="show-date ${show.showday_style_color}">${
        show.show_date_display
      }</p>
            <p class="show-time">${show.show_time_display}</p>
          </div>         
          ${isEditable}
       </div>`;
    }
    markup += `<div class="border-breaker"></div>`;
    return new Promise(function (resolve, reject) {
      resolve({ markup: markup });
    });
  }

  removeLastBorderBreaker() {
    document.querySelector(".border-breaker").remove();
  }

  setBtnName(name) {
    this.btn = document.querySelectorAll(`${name}`);
    console.log(this.btn);
  }
}

export default new showcardAdminView();
