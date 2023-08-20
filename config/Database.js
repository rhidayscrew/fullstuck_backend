import { Sequelize } from "sequelize";

// const db = new Sequelize('screw_db','screw_db','123456789',{
//     host: "localhost",
//     dialect: "mysql"
// });

//const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DB_SCHEMA || "fullstuckv1",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: process.env.DB_SSL == "true",
    },
  }
);
export default db;
