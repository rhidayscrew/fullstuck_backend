import {body, check}  from "express-validator";


export const validate = (method) => {
    switch (method) {
        case 'register': {
            return [
                body('name', "Invalid name.").isLength({min: 1}),
                body('email', "Invalid email.").isEmail(),
                body('password', "Invalid password, must be at least 6 characters.").isLength({min: 6}),

            ];
        }
            break;

        case 'login': {
            return [
                body('email', "Invalid email.").isEmail(),
                body('password', "Invalid password, must be at least 6 characters.").isLength({min: 6})
            ];
        }
            break;

        case 'findemail': {
            return [
                body('email', "Invalid email already extension.").isEmail(),
            ];
        }
            break;

        case 'addMeme': {
            return [
                check('memeName', "Invalid meme name.").isLength({min: 1})
            ];
        }
            break;

            case 'addproduct': {
            return [
                body('title', "Invalid nama barang.").isLength({min: 1}),
                body('harbel', "Invalid harga beli.").isLength({min: 1}).isNumeric(),
                body('harjul', "Invalid harga jual.").isLength({min: 1}).isNumeric(),
                body('harbel', "Invalid harga jual.").isLength({min: 1}).isNumeric(),
                body('stok', "Invalid stok.").isLength({min: 1}),
                //body('fileName', "Invalid fileName."),
                body('url', "Invalid url.")

            ];
        }
            break;

            case 'updateproduct': {
            return [
                body('title', "Invalid nama barang.").isLength({min: 1}),
                body('harbel', "Invalid harga beli.").isLength({min: 1}).isNumeric(),
                body('harjul', "Invalid harga jual.").isLength({min: 1}).isNumeric(),
                body('harbel', "Invalid harga jual.").isLength({min: 1}).isNumeric(),
                body('stok', "Invalid stok.").isLength({min: 1}),
                body('url', "Invalid url.")

            ];
        }
            break;
    }

}