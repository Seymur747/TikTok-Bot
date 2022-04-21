const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/.env") });
const Sequelize = require("sequelize");
const configs = process.env;
const opts = {
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
  },
};
const db = new Sequelize(
  configs.DB_NAME,
  configs.DB_USER_NAME,
  configs.DB_PASSWORD,
  opts
);

db.authenticate()
  .then(() => console.log("Success..........."))
  .catch(() => console.log("Connection failed............"));
module.exports = db;
