const sequelize = require("sequelize");
const db = require("../config/db");

const User = db.define("users", {
  id: {
    type: sequelize.UUID,
    primaryKey: true,
    defaultValue: sequelize.fn("gen_random_uuid"),
  },
  ttclid: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

// // console.log(a);
// db.sync({ force: true })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => console.log(err));
module.exports = User;
