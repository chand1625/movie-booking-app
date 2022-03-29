const moment = require("moment");

const db = require("../data/database");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

class Movie {
  constructor(movieData) {
    this.id = movieData.id;
    this.title = movieData.title;
    this.genre = movieData.genre;
    this.release_date = movieData.release_date;
    this.image = movieData.image;
    this.is_active = movieData.is_active;
  }

  async #getMovieImage(movieid) {
    try {
      const [movie] = await db.query("SELECT image FROM movies WHERE id=?", [
        movieid,
      ]);
      console.log("movie from db", movie);
      return movie[0].image;
    } catch (error) {
      throw error;
    }
  }

  static async getShowsWithCurrentDateAndBookings(movieid) {
    try {
      const [data] = await db.query(
        "SELECT * FROM shows WHERE (movie_id = ? AND DATE(timing) = current_date()) OR (movie_id=? AND total_capacity!=current_capacity)",
        [movieid, movieid]
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteImage(imgPath) {
    try {
      await unlinkAsync(`poster-images/${imgPath}`);
    } catch (error) {
      throw error;
    }
  }

  static async getAllMovies() {
    try {
      const [movies] = await db.query(
        "SELECT id,title,genre,release_date,image,is_active FROM movies"
      );
      return movies;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMovie(movie) {
    try {
      await db.query("DELETE FROM movies WHERE id=?", [movie.id]);
      await unlinkAsync(`poster-images/${movie.image}`);
    } catch (error) {
      throw error;
    }
  }

  static async getMovieReleaseDate(movieid) {
    try {
      const [releaseDate] = await db.query(
        "SELECT release_date from movies WHERE id=?",
        movieid
      );
      return releaseDate;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentMovies() {
    try {
      const [current_movies] =
        await db.query(`SELECT m.title,m.id,m.genre,m.image
        FROM movies as m
        JOIN shows as s
        ON m.id = s.movie_id
        WHERE s.timing >= current_timestamp() && s.timing <= DATE_ADD(current_date(),INTERVAL 3 DAY)
        GROUP BY m.id;`);
      return current_movies;
    } catch (error) {
      throw error;
    }
  }

  static async getUpcomingMovies() {
    try {
      const [upcoming_movies] =
        await db.query(`SELECT m.title,m.id,m.release_date,m.genre,m.image
        FROM movies as m
        JOIN shows as s
        ON m.id = s.movie_id
        WHERE m.is_active='1' AND m.release_date >= DATE_ADD(current_date(),INTERVAL 3 DAY)
        GROUP BY m.id;`);
      if (upcoming_movies.length > 0) {
        for (const movie of upcoming_movies) {
          movie.release_date = moment(movie.release_date).format(
            "dddd, MMMM Do YYYY"
          );
        }
      }
      return upcoming_movies;
    } catch (error) {
      throw error;
    }
  }

  static async getMovieWithId(movieid) {
    try {
      const [movie] = await db.query(
        "SELECT id,title,genre,release_date from movies WHERE id=?",
        movieid
      );
      if (movie.length > 0) {
        movie[0].release_date = moment(movie[0].release_date).format(
          "Do MMMM YYYY"
        );
      }
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async addNewMovie() {
    const data = [
      this.title,
      this.genre,
      this.release_date,
      this.image,
      this.is_active,
    ];
    try {
      await db.query(
        "INSERT INTO movies (title,genre,release_date,image,is_active) VALUES(?)",
        [data]
      );
    } catch (error) {
      throw error;
    }
  }

  async updateMovie() {
    if (this.image) {
      try {
        const imgPath = await this.#getMovieImage(this.id);
        await db.query(
          "UPDATE movies SET title=?,genre=?,release_date=?,image=?,is_active=? WHERE id=?",
          [
            this.title,
            this.genre,
            this.release_date,
            this.image,
            this.is_active,
            this.id,
          ]
        );
        await unlinkAsync(`poster-images/${imgPath}`);
      } catch (error) {
        throw error;
      }
    } else {
      try {
        await db.query(
          "UPDATE movies SET title=?,genre=?,release_date=?,is_active=? WHERE id=?",
          [this.title, this.genre, this.release_date, this.is_active, this.id]
        );
      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = Movie;
