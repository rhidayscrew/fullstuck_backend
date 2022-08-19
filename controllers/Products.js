import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";




export const getProducts = async(req, res)=>{
    try {
        const response = await Product.findAll({
            attributes:['id','name','image','harbel','harjul','stok','url']
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const getProductById = async(req, res)=>{
    try {
        const response = await Product.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProduct = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    //const {body , validationResult}= require('express-validator');
    const name = req.body.title;
    const harbel = req.body.harbel;
    const harjul = req.body.harjul;
    const stok = req.body.stok;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images !! Allowed Type only png and jpg"});
    if(fileSize > 100000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 100 KB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({name: name, harbel: harbel, harjul: harjul, stok: stok, image: fileName, url: url });
            res.status(201).json({msg: "Barang Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateProduct = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "No Data Found"});

    let fileName = "";
    if(req.files === null){
        fileName = product.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 100000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 100 KB"});

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.title;
    const harbel = req.body.harbel;
    const harjul = req.body.harjul;
    const stok = req.body.stok;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Product.update({name: name, harbel: harbel, harjul: harjul, stok: stok, image: fileName, url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Barang Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Barang Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}