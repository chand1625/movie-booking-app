import adminMenuView from "../admin.menu.view.js";

class addtheatreAdminView extends adminMenuView {
  #identity = "theatre";
  btn = document.querySelector(".content");
  parentEle = document.querySelector(".content");

  generateMarkup(data, secondary_data) {
    const id = data
      ? `<input type="hidden" value="${data.theatreid}" id="theatreid" name="theatreid">`
      : "";
    const h2Data = data ? "Edit theatre" : "Add a new theatre";
    const name = data ? `value="${data.name}"` : "";
    const address = data ? `value="${data.address}"` : "";
    const city = data ? data.city : "";

    const markup = `
    <div class="addedit-form-container">
    <form class="addedit-form">
      ${id}
      <h2>${h2Data}</h2>
      <p>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" ${name} required>
      </p>
      <p>
        <label for="address">Address</label>
        <input type="text" id="address" name="address" ${address} required>
      </p>
      <p>
        <label for="city">City</label>
        <select class="dropdown" id="city" name="city" required>
          <option value="Ahmedabad" ${
            city === "Ahmedabad" ? "selected" : ""
          }>Ahmedabad</option>
          <option value="Surat"  ${
            city === "Surat" ? "selected" : ""
          }>Surat</option>
          <option value="Vadodara"  ${
            city === "Vadodara" ? "selected" : ""
          }>Vadodara</option>
          <option value="Rajkot"  ${
            city === "Rajkot" ? "selected" : ""
          }>Rajkot</option>
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
    const id = document.getElementById("theatreid");
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    let formData = {};
    if (id) {
      formData.id = id.value;
    }
    formData.name = name.value;
    formData.address = address.value;
    formData.city = city.value;
    return formData;
  }
}

export default new addtheatreAdminView();
