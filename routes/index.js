import express from "express";
import {getUsers, getRegisters, Register, Login, Logout} from "../controllers/Users.js";
import {getProducts, getProductById, saveProduct, updateProduct, deleteProduct} from "../controllers/Products.js";
import { getUsersps } from "../controllers/Userps.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();
router.get('/usersps', verifyToken, getUsersps);
router.get('/users', verifyToken, getUsers);
router.get('/registers', verifyToken, getRegisters);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// ===========Product=========
router.get('/products', verifyToken, getProducts);
router.get('/products/:id', verifyToken, getProductById);
router.post('/products', verifyToken, saveProduct);
router.patch('/products/:id', verifyToken, updateProduct);
router.delete('/products/:id', verifyToken, deleteProduct);

// ===========User page and search=========


export default router;