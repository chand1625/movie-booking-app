const moment = require("moment");

const db = require("../data/database");

class Booking {
  static async addNewBooking(booking) {
    try {
      await db.query(
        "INSERT INTO bookings (show_id,user_id,movie_title,theatre_name,tickets,total_price,show_timing) VALUES(?)",
        [booking]
      );
    } catch (error) {
      throw error;
    }
  }

  static async isBookingValid(bookingId, userId) {
    try {
      const [booking] = await db.query(
        "SELECT id,user_id FROM bookings WHERE id=? && user_id=?",
        [bookingId, userId]
      );
      return booking;
    } catch (error) {
      throw error;
    }
  }

  static #isBookingRefundable(booking) {
    const showTime = new moment(booking.show_timing);
    const currTime = new moment();
    const duration = moment.duration(showTime.diff(currTime)).as("hours");
    if (duration < 1 || booking.status == "refunded") return false;
    else return true;
  }

  static async isBookingCancellable(bookingId) {
    try {
      const [booking] = await db.query(
        "SELECT status,show_timing FROM bookings WHERE id=?",
        bookingId
      );
      return this.#isBookingRefundable(booking[0]);
    } catch (error) {
      throw error;
    }
  }

  static async cancelBooking(bookingId) {
    try {
      await db.query(
        `UPDATE bookings SET status="refunded" WHERE id=?`,
        bookingId
      );
    } catch (error) {
      throw error;
    }
  }

  static async getBookingWithUserId(userid) {
    try {
      const [bookings] = await db.query(
        "SELECT * FROM bookings WHERE user_id=? ORDER BY created_at DESC",
        userid
      );
      for (const booking of bookings) {
        booking.is_refundable = this.#isBookingRefundable(booking);
        booking.show_date = moment(booking.show_timing).format("Do MMMM YYYY");
        booking.show_time = moment(booking.show_timing).format("h:mm A");
        booking.created_at = moment(booking.created_at).format(
          "Do MMMM YYYY h:mm:ss A"
        );
        booking.updated_at = moment(booking.updated_at).format(
          "Do MMMM YYYY h:mm:ss A"
        );
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;
