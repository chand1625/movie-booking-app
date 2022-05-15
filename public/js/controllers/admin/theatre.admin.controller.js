import * as theatreModel from "../../models/admin/theatre.admin.model.js";
import theatreAdminView from "../../views/admin/theatres/theatre.admin.view.js";
import addtheatreAdminView from "../../views/admin/theatres/addtheatre.admin.view.js";
import errorAdminView from "../../views/admin/error.admin.view.js";
import theatrecardAdminView from "../../views/admin/theatres/theatrecard.admin.view.js";

async function deleteTheatre(e) {
  const theatreid = e.target.parentElement.dataset.id;
  try {
    await theatreModel.deleteTheatre(theatreid);
    await getAllTheatres();
  } catch (error) {
    errorAdminView.renderServerError(
      "theatre-okay-btn",
      2,
      "Deletion failed!",
      "There was some problem deleting selected theatre. Please try again!"
    );
  }
}

async function onClickEditTheatre(e) {
  const theatreid = e.target.parentElement.dataset.id;
  const name = e.target.parentElement.dataset.name;
  const address = e.target.parentElement.dataset.address;
  const city = e.target.parentElement.dataset.city;
  const data = {
    theatreid: theatreid,
    name: name,
    address: address,
    city: city,
  };
  await addtheatreAdminView.render(true, data);
  addtheatreAdminView.addHandler(updateTheatre);
}

async function updateTheatre(e) {
  try {
    if (
      e.target.classList.contains("edit-submit") &&
      e.target.classList.contains("theatre")
    ) {
      e.preventDefault();
      const formData = addtheatreAdminView.getInputData();
      await theatreModel.updateTheatre(formData);
      await getAllTheatres();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "theatre-okay-btn",
      3,
      "Updating the selected theatre failed!",
      "There was some problem updating theatre data in database. Please try again!"
    );
    getAllTheatres();
  }
}

async function getAllTheatres() {
  try {
    const theatres = await theatreModel.loadAllTheatres();
    if (theatres.length == 0) {
      errorAdminView.renderServerError(
        "theatre-okay-btn",
        1,
        "No theatres to show!",
        "Currently you do not have any theatres added. Please add some!"
      );
      return;
    }
    await theatrecardAdminView.render(true, theatres);
    await addtheatreAdminView.render(false);
    theatrecardAdminView.setBtnName(".theatre-deletebtn");
    theatrecardAdminView.addHandler(deleteTheatre);
    theatrecardAdminView.setBtnName(".theatre-editbtn");
    theatrecardAdminView.addHandler(onClickEditTheatre);
  } catch (error) {
    errorAdminView.renderServerError(
      "theatre-okay-btn",
      2,
      "An error occured!",
      "There was some problem fetching the list of theatres. Please try again!"
    );
  }
}

async function addtheatre(e) {
  try {
    if (
      e.target.classList.contains("add-submit") &&
      e.target.classList.contains("theatre")
    ) {
      e.preventDefault();
      const formData = addtheatreAdminView.getInputData();
      const theatreAdded = await theatreModel.saveNewTheatre(formData);
      if (!theatreAdded) {
        errorAdminView.renderClientError("Please fill all input fields!");
        return;
      }
      await getAllTheatres();
    }
  } catch (error) {
    errorAdminView.renderServerError(
      "theatre-okay-btn",
      3,
      "Adding the new theatre failed!",
      "There was some problem adding new theatre in database. Please try again!"
    );
  }
}

async function onClickOkay(e) {
  if (e.target.classList.contains("theatre-okay-btn")) {
    const errorId = errorAdminView.getErrorId();
    errorAdminView.clear();
    if (errorId == 1 || errorId == 3) {
      await addtheatreAdminView.render(false);
    } else if (errorId == 2) {
      await getAllTheatres();
    }
  }
}

const init = function () {
  theatreAdminView.addHandler(getAllTheatres);
  addtheatreAdminView.addHandler(addtheatre);
  errorAdminView.addHandler(onClickOkay);
};

export default init;
