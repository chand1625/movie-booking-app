export default class adminMenuView {
  clear() {
    this.parentEle.innerHTML = "";
  }

  addHandler(handler) {
    if (this.btn instanceof NodeList) {
      for (const button of this.btn) {
        button.addEventListener("click", handler);
      }
    } else {
      this.btn.addEventListener("click", handler);
    }
  }

  async render(erase, primary_data = null, secondary_data = null) {
    const { markup } = await this.generateMarkup(primary_data, secondary_data);
    if (erase) this.clear();
    this.parentEle.insertAdjacentHTML("beforeend", markup);
    return new Promise(function (resolve, reject) {
      resolve({ msg: "Successfully rendered" });
    });
  }
}
