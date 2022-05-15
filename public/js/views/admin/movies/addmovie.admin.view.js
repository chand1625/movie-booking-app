import adminMenuView from "../admin.menu.view.js";

class addmovieAdminView extends adminMenuView {
  #identity = "movie";
  btn = document.querySelector(".content");
  parentEle = document.querySelector(".content");

  #pad(s) {
    return s < 10 ? "0" + s : s;
  }

  generateMarkup(data, secondary_data) {
    const id = data
      ? `<input type="hidden" value="${data.movieid}" id="movieid" name="movieid">`
      : "";
    const h2Data = data ? "Edit movie" : "Add a new movie";
    const title = data ? `value="${data.title}"` : "";
    const genre = data ? data.genre : "";
    let release_date = data ? new Date(data.release_date) : "";
    release_date = data
      ? `value="${release_date.getFullYear()}-${this.#pad(
          release_date.getMonth() + 1
        )}-${this.#pad(release_date.getDate())}"`
      : "";
    const is_active = data ? data.is_active : "";
    const markup = `
    <div class="addedit-form-container" enctype="multipart/form-data">
    <form class="addedit-form">
      ${id}
      <h2>${h2Data}</h2>
      <p>
        <label for="title">Title</label>
        <input type="text" id="title" name="title" ${title} required>
      </p>
      <p>
        <label for="genre">Genre</label>
        <select class="dropdown" id="genre" name="genre" required>
          <option value="Action" ${
            genre === "Action" ? "selected" : ""
          }>Action</option>
          <option value="Romance"  ${
            genre === "Romance" ? "selected" : ""
          }>Romance</option>
          <option value="Comedy"  ${
            genre === "Comedy" ? "selected" : ""
          }>Comedy</option>
          <option value="Horror"  ${
            genre === "Horror" ? "selected" : ""
          }>Horror</option>
          <option value="Crime"  ${
            genre === "Crime" ? "selected" : ""
          }>Crime</option>
          <option value="Drama"  ${
            genre === "Drama" ? "selected" : ""
          }>Drama</option>
          <option value="Adventure"  ${
            genre === "Adventure" ? "selected" : ""
          }>Adventure</option>
        </select>
      </p>
      <p>
        <label for="release_date">Release date</label>
        <input type="date" id="release_date" name="release_date" ${release_date} required>
      </p>
      <p>
        <label for="image">Poster</label>
        <input type="file" id="image" name="image" accept="image/*" ${
          data ? "" : "required"
        }>
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
    const id = document.getElementById("movieid");
    const title = document.getElementById("title");
    const genre = document.getElementById("genre");
    const release_date = document.getElementById("release_date");
    const image = document.getElementById("image");
    const is_active = document.getElementById("is_active");
    const formData = new FormData();
    if (id) {
      formData.append("id", id.value);
    }
    formData.append("title", title.value);
    formData.append("genre", genre.value);
    formData.append("release_date", release_date.value);
    formData.append("is_active", is_active.value);
    if (image.files[0]) formData.append("image", image.files[0]);
    return formData;
  }
}

export default new addmovieAdminView();
