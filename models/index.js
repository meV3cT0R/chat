const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.json");
const sequelize = new Sequelize(config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models here
db.Message = require("./message")(sequelize, DataTypes);

module.exports = db;
