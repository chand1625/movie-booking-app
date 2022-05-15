import adminMenuView from "./admin.menu.view.js";

class errorAdminView extends adminMenuView {
  btn = document.querySelector(".content");
  parentEle = document.querySelector(".content");
  errorId;

  renderClientError(error, deletePrevError = false) {
    const form = document.querySelector(".addedit-form-container");
    const errorEle = document.querySelector(".adminform-validation-error");
    if (errorEle && deletePrevError == false) return;
    if (errorEle && deletePrevError == true) errorEle.remove();
    const markup = `
      <p class="adminform-validation-error">${error}</p>
    `;
    form.insertAdjacentHTML("beforeend", markup);
  }

  renderServerError(navType, errorId, error, secondaryError = "") {
    const markup = `
    <div class="msg-container" data-errorId="${errorId}">
      <h1 class="main-error">${error}</h1>
      <p class="secondary-error">${secondaryError}</p>
      <button class="okay-btn ${navType}">Okay</button>
    </div>
    `;
    this.parentEle.innerHTML = "";
    this.parentEle.insertAdjacentHTML("afterbegin", markup);
    this.errorId = document.querySelector(".msg-container").dataset.errorid;
  }

  getErrorId() {
    return this.errorId;
  }
}

export default new errorAdminView();
