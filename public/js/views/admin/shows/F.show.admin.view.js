import adminMenuView from "../F.admin.menu.view.js";

class showAdminView extends adminMenuView {
  btn = document.querySelector(".menu-btn-shows");
  parentEle = document.querySelector(".content");
}

export default new showAdminView();
