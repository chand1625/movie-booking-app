export const loadAllTheatres = async function () {
  try {
    const res = await fetch("/dashboard/all-theatres");
    const theatres = await res.json();
    return theatres;
  } catch (error) {
    throw error;
  }
};

export const saveNewTheatre = async function (formData) {
  try {
    const res = await fetch("/dashboard/add-new-theatre", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return false;
    else return true;
  } catch (error) {
    throw error;
  }
};

export const updateTheatre = async function (formData) {
  try {
    const res = await fetch("/dashboard/update-theatre", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteTheatre = async function (theatreId) {
  const theatre = JSON.stringify({ id: theatreId });
  try {
    const res = await fetch("/dashboard/delete-theatre", {
      method: "POST",
      body: theatre,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to delete");
  } catch (error) {
    throw error;
  }
};
