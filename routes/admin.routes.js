const express = require("express");

const adminController = require("../controllers/admin.controller");
const checkAuth = require("../middlewares/checkAuth.middleware");
const imageUpload = require("../middlewares/imageUpload.middleware");

const router = express.Router();

router.get(
  "/dashboard/all-movies",
  checkAuth.checkAdminAuthorization,
  adminController.getAllMovies
);

router.post(
  "/dashboard/add-new-movie",
  checkAuth.checkAdminAuthorization,
  imageUpload,
  adminController.addNewMovie
);

router.post(
  "/dashboard/update-movie",
  checkAuth.checkAdminAuthorization,
  imageUpload,
  adminController.updateMovie
);

router.post(
  "/dashboard/delete-movie",
  checkAuth.checkAdminAuthorization,
  adminController.deleteMovie
);

router.get(
  "/dashboard/all-theatres",
  checkAuth.checkAdminAuthorization,
  adminController.getAllTheatres
);

router.post(
  "/dashboard/add-new-theatre",
  checkAuth.checkAdminAuthorization,
  adminController.addNewTheatre
);

router.post(
  "/dashboard/delete-theatre",
  checkAuth.checkAdminAuthorization,
  adminController.deleteTheatre
);

router.post(
  "/dashboard/update-theatre",
  checkAuth.checkAdminAuthorization,
  adminController.updateTheatre
);

router.get(
  "/dashboard/all-shows",
  checkAuth.checkAdminAuthorization,
  adminController.getAllShows
);

router.post(
  "/dashboard/add-new-show",
  checkAuth.checkAdminAuthorization,
  adminController.addUpdateShowValidator
);

router.post(
  "/dashboard/update-show",
  checkAuth.checkAdminAuthorization,
  adminController.addUpdateShowValidator
);

router.post(
  "/dashboard/delete-show",
  checkAuth.checkAdminAuthorization,
  adminController.deleteShow
);

module.exports = router;
