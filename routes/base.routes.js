const express = require("express");

const homeController = require("../controllers/home.controller");
const checkAuth = require("../middlewares/checkAuth.middleware");

const router = express.Router();

router.get("/", homeController.checkAuthorization, homeController.getHome);

router.get(
  "/dashboard",
  checkAuth.checkAdminAuthorization,
  homeController.getDashboard
);

module.exports = router;
