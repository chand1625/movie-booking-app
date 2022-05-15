import adminMenuView from "../admin.menu.view.js";

class movieAdminView extends adminMenuView {
  btn = document.querySelector(".menu-btn-movies");
  parentEle = document.querySelector(".content");
}

export default new movieAdminView();
