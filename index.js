import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";
import cors from "cors";
import db from "./config/Database.js";
//import Users from "./models/UserModel.js" //menggenerate table
//import Registers from "./models/RegisterModel.js" //menggenerate table
//import Product from "./models/ProductModel.js" //menggenerate table
//import Userps from "./models/UserPsModel.js" //menggenerate table
import router from "./routes/index.js";
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
// cors dibawah express
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//app.use(cors({ credentials:true, origin:'http://api.umaclean.my.id/' }));

// try {
//   await db.authenticate();
//   console.log("Database Connected...");
//   //await Users.sync();// menggenerate
//   //await Registers.sync();// menggenerate
//   //await Product.sync();// menggenerate
//   //await Userps.sync();// menggenerate
// } catch (error) {
//   console.error(error);
// }

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers", "application/x-www-form-urlencoded",
//     "Origin, Accept, Accept-Version,Set-Cookie, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   )
//   next();
// });
app.use(FileUpload());
app.use(express.static("public")); // gambar terlihat
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running at port 5000"));

//app.listen(process.env.PORT || 5000,() => {
// console.log(`Server running on port ${PORT}`);
//});
