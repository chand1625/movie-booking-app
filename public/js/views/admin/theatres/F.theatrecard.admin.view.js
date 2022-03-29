import adminMenuView from "../F.admin.menu.view.js";

class theatrecardAdminView extends adminMenuView {
  btn;
  parentEle = document.querySelector(".content");

  generateMarkup(data, secondary_data) {
    let markup = "";
    for (const theatre of data) {
      markup += `<div class="admin-theatre-card">
          <div class="theatre-details-container">
            <h3 class="theatre-name">${theatre.name}</h3>
            <p class="theatre-address">${theatre.address}</p>
            <p class="theatre-city">${theatre.city}</p>
          </div>
          <div class="theatrecardbtn-container" data-id="${theatre.id}" data-name="${theatre.name}" data-address="${theatre.address}"
          data-city="${theatre.city}">
            <button class="admincard-btn theatre-editbtn">Edit</button>
            <button class="admincard-btn theatre-deletebtn">Delete</button>
          </div>
       </div>`;
    }
    markup += `<div class="border-breaker"></div>`;
    return new Promise(function (resolve, reject) {
      resolve({ markup: markup });
    });
  }

  setBtnName(name) {
    this.btn = document.querySelectorAll(`${name}`);
  }
}

export default new theatrecardAdminView();
