import adminMenuView from "../F.admin.menu.view.js";

class addshowAdminView extends adminMenuView {
  #identity = "show";
  btn = document.querySelector(".content");
  parentEle = document.querySelector(".content");

  generateMarkup(main_data, data) {
    const id = data
      ? `<input type="hidden" value="${data.id}" id="showid" name="showid">`
      : "";
    const h2Data = data ? "Edit show" : "Add a new show";
    const is_active = data ? data.is_active : "";

    let markup = `
    <div class="addedit-form-container">
    <form class="addedit-form">
      ${id}
      <h2>${h2Data}</h2>
      <p>
        <label for="movie">Movie</label>
        <select class="dropdown" id="movie" name="movie" required>`;

    for (const movie of main_data.movies) {
      if (movie.is_active)
        markup += `
          <option value="${movie.id}" ${
          data ? (data.movie_id == movie.id ? "selected" : "") : ""
        }>${movie.title}</option>`;
    }

    markup += `
    </select>
    </p>
    <p>
        <label for="theatre">Theatre</label>
        <select class="dropdown" id="theatre" name="theatre" required>`;

    for (const theatre of main_data.theatres) {
      markup += `
              <option value="${theatre.id}" ${
        data ? (data.theatre_id == theatre.id ? "selected" : "") : ""
      }>${theatre.name}</option>`;
    }

    markup += `
    </select>
    </p>
    <p>
        <label for="show_date">Show date(From tomorrow)</label>
        <input type="date" id="show_date" name="show_date" ${
          data ? `value="${data.show_date}"` : ""
        } required>
    </p>
    <p>
        <label for="show_time">Show time(From 8:00 AM to 10:00 PM)</label>
        <input type="time" id="show_time" name="show_time" ${
          data ? `value="${data.show_time}"` : ""
        } required>
    </p>
    <p>
        <label for="total_capacity">Total capacity(10-100)</label>
        <input type="number" id="total_capacity" name="total_capacity" ${
          data ? `value="${data.total_capacity}"` : ""
        } min="10" max="100" required>
    </p>
    <p>
        <label for="price">Ticket price(60₹-300₹)</label>
        <input type="number" id="price" name="price" ${
          data ? `value="${data.price}"` : ""
        } min="60" max="300" required>
    </p>
    <p>
        <label for="is_active">Active</label>
        <select class="dropdown" id="is_active" name="is_active" required>
          <option value="1" ${is_active === "1" ? "selected" : ""}>Yes</option>
          <option value="0"  ${is_active === "0" ? "selected" : ""}>No</option>
        </select>
      </p>
    <button class="submit-btn-admin ${data ? "edit-submit" : "add-submit"} ${
      this.#identity
    }">Submit</button>
    </form>
    </div>
    `;
    return new Promise(function (resolve, reject) {
      resolve({ markup: markup });
    });
  }

  getInputData() {
    const id = document.getElementById("showid");
    const movie_id = document.getElementById("movie");
    const theatre_id = document.getElementById("theatre");
    const show_date = document.getElementById("show_date");
    const show_time = document.getElementById("show_time");
    const total_capacity = document.getElementById("total_capacity");
    const price = document.getElementById("price");
    const is_active = document.getElementById("is_active");
    let formData = {};
    if (id) {
      formData.id = id.value;
    }
    formData.movie_id = movie_id.value;
    formData.theatre_id = theatre_id.value;
    formData.show_date = show_date.value;
    if (!formData.id) {
      formData.show_time = show_time.value + ":00";
    } else {
      formData.show_time = show_time.value;
    }
    formData.total_capacity = total_capacity.value;
    formData.price = price.value;
    formData.is_active = is_active.value;
    return formData;
  }
}

export default new addshowAdminView();
