export const loadAllMovies = async function () {
  try {
    const res = await fetch("/dashboard/all-movies");
    const movies = await res.json();
    return movies;
  } catch (error) {
    throw error;
  }
};

export const saveNewMovie = async function (formData) {
  try {
    const res = await fetch("/dashboard/add-new-movie", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return false;
    else return true;
  } catch (error) {
    throw error;
  }
};

export const updateMovie = async function (formData) {
  try {
    const res = await fetch("/dashboard/update-movie", {
      method: "POST",
      body: formData,
    });
    const msg = await res.json();
    return msg;
  } catch (error) {
    throw error;
  }
};

export const deleteMovie = async function (movieid, img) {
  let movie = { id: movieid, image: img };
  movie = JSON.stringify(movie);
  try {
    const res = await fetch("/dashboard/delete-movie", {
      method: "POST",
      body: movie,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to delete");
  } catch (error) {
    throw error;
  }
};
