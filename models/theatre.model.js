const db = require("../data/database");

class Theatre {
  constructor(theatre) {
    this.id = theatre.id;
    this.name = theatre.name;
    this.address = theatre.address;
    this.city = theatre.city;
  }

  static async getAllTheatres() {
    try {
      const [theatres] = await db.query(
        "SELECT id,name,address,city FROM theatres"
      );
      return theatres;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTheatre(theatre) {
    try {
      await db.query("DELETE FROM theatres WHERE id=?", [theatre.id]);
    } catch (error) {
      throw error;
    }
  }

  async addNewTheatre() {
    const data = [this.name, this.address, this.city];
    try {
      await db.query("INSERT INTO theatres (name,address,city) VALUES(?)", [
        data,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updateTheatre() {
    try {
      await db.query("UPDATE theatres SET name=?,address=?,city=? WHERE id=?", [
        this.name,
        this.address,
        this.city,
        this.id,
      ]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Theatre;
