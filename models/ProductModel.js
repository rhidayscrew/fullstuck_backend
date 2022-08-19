import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Product = db.define('product',{
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    harbel: DataTypes.INTEGER,
    harjul: DataTypes.INTEGER,
    stok: DataTypes.INTEGER,
    url: DataTypes.STRING
},{
    freezeTableName: true
});

export default Product;
