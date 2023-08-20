import express from "express";
import {getUsers, getRegisters, Register, Login, Logout} from "../controllers/Users.js";
import {getProducts, getProductById, saveProduct, updateProduct, deleteProduct} from "../controllers/Products.js";
import { getUsersps } from "../controllers/Userps.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { validate } from "../middleware/reqBodyValidators.js"
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();
router.get('/usersps', verifyToken, getUsersps);
router.get('/users', verifyToken, getUsers);
router.get('/registers', verifyToken, getRegisters);
router.post('/users',  validate('register'), Register);
router.post('/login', validate('login'), Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// ===========Product=========
router.get('/products', verifyToken, getProducts);
router.get('/products/:id', verifyToken, getProductById);
router.post('/products', validate('addproduct'), verifyToken, saveProduct);
router.patch('/products/:id', validate ('updateproduct'), verifyToken, updateProduct);
router.delete('/products/:id', verifyToken, deleteProduct);

// ===========User page and search=========


export default router;