import adminMenuView from "../admin.menu.view.js";

class moviecardAdminView extends adminMenuView {
  btn;
  parentEle = document.querySelector(".content");

  generateMarkup(data, secondary_data) {
    let markup = "";
    for (const movie of data) {
      const isActive = movie.is_active ? "Active" : "Not active";
      markup += `<div class="admin-movie-card">
          <img class="movie-poster"src="${movie.image}" alt="${
        movie.title + "-poster"
      }">
          <div class="movie-details-container">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-releasedate">${new Date(
              movie.release_date
            ).toDateString()}</p>
            <p class="isActive ${isActive.replace(/ /g, "")}">${isActive}</p>
          </div>
          <div class="moviecardbtn-container"  data-id="${
            movie.id
          }" data-image="${movie.image}" data-title="${movie.title}"
          data-releasedate="${movie.release_date}" data-genre="${
        movie.genre
      }" data-isactive=${movie.is_active}>
            <button class="admincard-btn movie-editbtn">Edit</button>
            <button class="admincard-btn movie-deletebtn">Delete</button>
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

export default new moviecardAdminView();
