const db = require("../data/database");
const moment = require("moment");

class Show {
  constructor(show) {
    this.id = show.id;
    this.movie_id = show.movie_id;
    this.theatre_id = show.theatre_id;
    this.timing = show.timing;
    this.total_capacity = show.total_capacity;
    this.price = show.price;
    this.is_active = show.is_active;
  }

  static #pad(s) {
    return s < 10 ? "0" + s : s;
  }

  static #showTimingFormatter(show) {
    let showDate = new Date(show.timing);
    show.show_date = `${showDate.getFullYear()}-${this.#pad(
      showDate.getMonth() + 1
    )}-${this.#pad(showDate.getDate())}`;

    showDate = moment(show.timing);
    show.show_time = showDate.format("HH:mm:ss");
    show.show_date_display = showDate.format("MMMM Do YYYY");
    show.show_day_display = showDate.format("dddd");
    show.show_time_display = showDate.format("h:mm A");
    return show;
  }

  static async #updateShowActivationStatus() {
    try {
      await db.query("CALL update_show_status_as_currentTime()");
    } catch (error) {
      throw error;
    }
  }

  static async getAllShows() {
    try {
      await this.#updateShowActivationStatus();
      const [current_shows] = await db.query(
        "SELECT s.id, s.movie_id, s.theatre_id, s.timing, s.total_capacity,s.current_capacity, s.price, s.is_active, m.title, t.name, m.is_active as movie_active FROM shows as s JOIN movies AS m ON s.movie_id = m.id JOIN theatres AS t ON s.theatre_id = t.id WHERE s.timing > current_timestamp() ORDER BY s.timing"
      );
      const [past_shows] = await db.query(
        "SELECT s.id, s.movie_id, s.theatre_id, s.timing, s.total_capacity,s.current_capacity, s.price, s.is_active, m.title, t.name FROM shows as s JOIN movies AS m ON s.movie_id = m.id JOIN theatres AS t ON s.theatre_id = t.id WHERE s.timing <= current_timestamp() ORDER BY s.timing"
      );
      for (let show of current_shows) {
        show = this.#showTimingFormatter(show);
        let showDate = new Date(show.timing);
        showDate = moment(show.timing);
        if (show.current_capacity < show.total_capacity) {
          show.is_editable = false;
          show.edit_reason =
            "Show booking has been started.</br> Edit/delete is not possible!";
        } else if (
          showDate.format("MMMM Do YYYY") == moment().format("MMMM Do YYYY")
        ) {
          show.is_editable = false;
          show.edit_reason =
            "Today is the show date.</br> Edit/delete is not possible!";
        } else if (show.movie_active == 0) {
          show.is_editable = false;
          show.edit_reason =
            "Movie of this show is not active.</br> Edit/delete is not possible!";
        } else {
          show.is_editable = true;
        }
        const currentdate = moment();
        const { _data } = moment.duration(showDate.diff(currentdate));
        if (_data.days <= 3) {
          show.showday_style_color = "showday-style-color-green";
        } else {
          show.showday_style_color = "showday-style-color-blue";
        }
      }
      for (let show of past_shows) {
        show = this.#showTimingFormatter(show);
        let showDate = new Date(show.timing);
        showDate = moment(show.timing);
        show.is_editable = false;
        show.edit_reason =
          "Show has been done.</br> Edit/delete is not possible!";
        show.showday_style_color = "showday-style-color-red";
      }
      let shows;
      if (past_shows.length == 0 && current_shows.length == 0) {
        shows = [];
      } else if (past_shows.length == 0) {
        shows = [[current_shows, "Current shows"]];
      } else if (current_shows.length == 0) {
        shows = [[past_shows, "Past shows"]];
      } else {
        shows = [
          [past_shows, "Past shows"],
          [current_shows, "Current shows"],
        ];
      }
      return shows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteShow(show) {
    try {
      await db.query("DELETE FROM shows WHERE id=?", [show.id]);
    } catch (error) {
      throw error;
    }
  }

  static #CalcCapacityStyle(total_cap, curr_cap) {
    const available_cap = Math.round((curr_cap / total_cap) * 100);
    if (available_cap >= 60) {
      return "show-available";
    } else if (available_cap > 20 && available_cap < 60) {
      return "show-filling-fast";
    } else {
      return "show-almost-full";
    }
  }

  static async getSelectedMovieShows(movieid) {
    try {
      await this.#updateShowActivationStatus();
      const [shows] = await db.query(
        `SELECT m.title,t.id AS theatre_id,t.name AS theatre_name,t.address,t.city,s.id AS show_id,s.timing AS show_timing,s.total_capacity,s.current_capacity,s.price,DATE(s.timing) as show_date
        FROM movies as m
        JOIN shows as s
        ON m.id = s.movie_id
        JOIN theatres as t
        ON t.id = s.theatre_id
        WHERE m.id=? && s.is_active = '1' && s.timing >= current_timestamp() && s.timing <= DATE_ADD(current_date(),INTERVAL 3 DAY) && s.current_capacity!=0
        ORDER BY DATE(s.timing), t.city, t.name`,
        movieid
      );
      if (shows.length > 0) {
        let formatted_shows = [];
        let formatted_shows_by_date = [];
        let i = 0;
        let last_show_date = moment(shows[i].show_date).format("YYYY-MM-DD");
        while (i < shows.length) {
          shows[i].show_cap_style = this.#CalcCapacityStyle(
            shows[i].total_capacity,
            shows[i].current_capacity
          );
          let showDate = moment(shows[i].show_timing);
          shows[i].show_date_display = showDate.format("MMMM Do YYYY");
          shows[i].show_day_display = showDate.format("dddd");
          shows[i].show_time_display = showDate.format("h:mm A");
          const show_date = moment(shows[i].show_date).format("YYYY-MM-DD");
          if (show_date == last_show_date) {
            formatted_shows_by_date.push(shows[i]);
            i++;
          } else {
            formatted_shows.push(formatted_shows_by_date);
            formatted_shows_by_date = [];
            last_show_date = moment(shows[i].show_date).format("YYYY-MM-DD");
          }
        }
        if (formatted_shows_by_date)
          formatted_shows.push(formatted_shows_by_date);

        for (let [j, sameDateShows] of formatted_shows.entries()) {
          let last_city = sameDateShows[0].city;
          let formatted_shows_by_city = [];
          let temp_arr = [];
          let k = 0;
          while (k < sameDateShows.length) {
            if (sameDateShows[k].city == last_city) {
              formatted_shows_by_city.push(sameDateShows[k]);
              k++;
            } else {
              temp_arr.push(formatted_shows_by_city);
              formatted_shows_by_city = [];
              last_city = sameDateShows[k].city;
            }
          }
          if (formatted_shows_by_city) temp_arr.push(formatted_shows_by_city);
          formatted_shows[j] = temp_arr;
          temp_arr = [];
        }

        for (let [j, sameDateShows] of formatted_shows.entries()) {
          let temp_same_city_shows = [];
          for (let [k, sameCityShows] of sameDateShows.entries()) {
            let last_theatre = sameCityShows[0].theatre_id;
            let formatted_shows_by_theatre = [];
            let l = 0;
            let temp_arr = [];
            while (l < sameCityShows.length) {
              if (sameCityShows[l].theatre_id == last_theatre) {
                formatted_shows_by_theatre.push(sameCityShows[l]);
                l++;
              } else {
                formatted_shows_by_theatre.sort(function (show1, show2) {
                  const show1Date = moment(show1.show_timing);
                  const show2Date = moment(show2.show_timing);
                  if (show1Date >= show2Date) {
                    return 1;
                  } else {
                    return -1;
                  }
                });
                temp_arr.push(formatted_shows_by_theatre);
                formatted_shows_by_theatre = [];
                last_theatre = sameCityShows[l].theatre_id;
              }
            }
            if (formatted_shows_by_theatre) {
              formatted_shows_by_theatre.sort(function (show1, show2) {
                const show1Date = moment(show1.show_timing);
                const show2Date = moment(show2.show_timing);
                if (show1Date >= show2Date) {
                  return 1;
                } else {
                  return -1;
                }
              });
              temp_arr.push(formatted_shows_by_theatre);
            }
            temp_same_city_shows.push(temp_arr);
            temp_arr = [];
          }
          formatted_shows[j] = temp_same_city_shows;
        }
        return formatted_shows;
      }
      return shows;
    } catch (error) {
      throw error;
    }
  }

  static async getShowwithId(showid) {
    try {
      const [show] = await db.query(
        `SELECT m.title AS movie_title,t.name AS theatre_name,s.id AS show_id,s.timing AS show_timing,s.total_capacity,s.current_capacity,s.price
    FROM movies as m
    JOIN shows as s
    ON m.id = s.movie_id
    JOIN theatres as t
    ON t.id = s.theatre_id
    WHERE s.id=?`,
        showid
      );
      return show;
    } catch (error) {
      throw error;
    }
  }

  static async isShowBookable(showid, noOfTickets) {
    try {
      await this.#updateShowActivationStatus();
      const [show] = await db.query(
        "SELECT s.is_active as show_active,s.current_capacity FROM shows AS s WHERE s.id=?",
        showid
      );
      console.log(show);
      if (!show.length > 0) {
        return -1;
      }
      if (show[0].show_active == 0) {
        return 0;
      }
      if (show[0].current_capacity < noOfTickets) {
        return -2;
      }
      return 1;
    } catch (error) {
      throw error;
    }
  }

  async addNewShow() {
    const data = [
      this.movie_id,
      this.theatre_id,
      this.timing,
      this.total_capacity,
      this.total_capacity,
      this.price,
      this.is_active,
    ];
    try {
      await db.query(
        "INSERT INTO shows (movie_id,theatre_id,timing,total_capacity,current_capacity,price,is_active) VALUES(?)",
        [data]
      );
    } catch (error) {
      throw error;
    }
  }

  async updateShow() {
    const data = [
      this.movie_id,
      this.theatre_id,
      this.timing,
      this.total_capacity,
      this.total_capacity,
      this.price,
      this.is_active,
      this.id,
    ];
    try {
      await db.query(
        "UPDATE shows SET movie_id=?,theatre_id=?,timing=?,total_capacity=?,current_capacity=?,price=?,is_active=? WHERE id=?",
        data
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Show;
