export const loadAllShows = async function () {
  try {
    const res = await fetch("/dashboard/all-shows");
    const shows = await res.json();
    return shows;
  } catch (error) {
    throw error;
  }
};

export const saveNewShow = async function (formData) {
  try {
    const res = await fetch("/dashboard/add-new-show", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const msg = await res.json();
    return msg;
  } catch (error) {
    throw error;
  }
};

export const updateShow = async function (formData) {
  try {
    const res = await fetch("/dashboard/update-show", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const msg = await res.json();
    return msg;
  } catch (error) {
    throw error;
  }
};

export const deleteShow = async function (showid) {
  const show = JSON.stringify({ id: showid });
  try {
    const res = await fetch("/dashboard/delete-show", {
      method: "POST",
      body: show,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to delete");
  } catch (error) {
    throw error;
  }
};
