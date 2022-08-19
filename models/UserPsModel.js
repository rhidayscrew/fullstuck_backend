import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Userps = db.define('users',{
     name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    gender:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

export default Userps;



