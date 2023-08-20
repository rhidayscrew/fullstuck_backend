import Product from "../models/ProductModel.js";
import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll({
      attributes: ["id", "name", "image", "harbel", "harjul", "stok", "url"],
    });
    res.status(200).json(response);

    // res.status(200).header("Content-Type", "application/json").json({
    //   code: "200",
    //   status: "OK",
    //   data: response,
    // });
  } catch (error) {
    //console.log(error.message);
    res.status(500).json({
      code: "500",
      status: "Internal Server Erro",
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveProduct = async (req, res) => {
  try {
    if (req.files === null)
      return res.status(400).json({
        code: "400",
        status: "Bad Request",
        message: "No File Uploaded",
      });

    const name = req.body.title;
    const harbel = req.body.harbel;
    const harjul = req.body.harjul;
    const stok = req.body.stok;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Invalid Images !! Allowed Type only png and jpg",
      });
    if (fileSize > 5000000)
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Image must be less than 5 MB",
      });

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });

    // Validasi field name, stock, harga_beli, dan harga_jual
    const message = {};

    if (!name) {
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Nama produk harus diisi",
      });
    } else if (name.length < 3) {
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Nama produk terlalu pendek",
      });
    }
    if (!harbel || harbel <= 0)
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Harga beli produk harus diisi dengan angka lebih dari 0",
      });

    if (!harjul || harjul <= 0) {
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Harga jual produk harus diisi dengan angka lebih dari 0",
      });
    } else if (harjul <= harbel) {
      return res.status(422).json({
        code: "422",
        status: "Bad Request",
        message: "Harga jual produk harus lebih tinggi daripada harga beli",
      });
    }

    await Product.create({
      name: name,
      harbel: harbel,
      harjul: harjul,
      stok: stok,
      image: fileName,
      url: url,
    });
    res.status(201).json({
      code: "201",
      status: "Ok",
      messege: "Product Created Successfuly",
    });
  } catch (error) {
    // Tangani error umum dengan status 500
    // console.error(error);
    res.status(500).json({
      code: "500",
      status: "Internal Server Error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failure!",
      errors: errors.errors,
    });
  }

  if (!product) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 100000)
      return res
        .status(422)
        .json({ msg: "Gambar harus lebih kecil dari 100 KB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const harbel = req.body.harbel;
  const harjul = req.body.harjul;
  const stok = req.body.stok;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.update(
      {
        name: name,
        harbel: harbel,
        harjul: harjul,
        stok: stok,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Barang Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Barang Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
