import adminMenuView from "../admin.menu.view.js";

class theatreAdminView extends adminMenuView {
  btn = document.querySelector(".menu-btn-theatres");
  parentEle = document.querySelector(".content");
}

export default new theatreAdminView();
