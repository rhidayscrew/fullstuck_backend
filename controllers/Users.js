import Users from "../models/UserModel.js";
import Registers from "../models/RegisterModel.js";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}


//ini berbeda table : table registration
export const getRegisters = async(req, res) => {
    try {
        const registers = await Registers.findAll({
            attributes:['id','firstName','lastName','gender','email','number']
        });
        res.json(registers);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
   try{

            const errors = validationResult(req)
            const iduniq = Math.random().toString().substr(2, 8) + 'register';
            const {  name, email, password, confPassword } = req.body;

            if(password !== confPassword  ){
                return res.status(400).json({success: false, message: "Password dan Confirm Password tidak cocok "});
           };

            if(!errors.isEmpty()) {
                  return  res.status(400).json({
                        success: false,
                        message: "Validation failure!",
                        errors: errors.errors
                    });
            };


                const result = await Registers.findOne({
                    where:{
                           email: req.body.email // sudah di setting unique di database
                       }
                    });
                if(result){
                    //console.log("Test:" + result);
                    res.status(400).json({
                    success: false,
                    message: "Email sudah terdaftar.",

                })
              } else {
                    const salt = await bcrypt.genSalt();
                    const hashPassword = await bcrypt.hash(password, salt);
                    try {
                        //     await Users.create({
                        //         id : iduniq,
                        //         name: name,
                        //         email: email,
                        //         password: hashPassword
                        //     });
                        //     res.json({msg: "Register Berhasil"});
                        // } catch (error) {
                        //     console.log(error);
                        // }


                                await Users.create({
                                    id : iduniq,
                                    name: name,
                                    email: email,
                                    password: hashPassword
                                }).then(result => {
                                res.status(201).json({
                                    success: true,
                                    message: "Signed up successfully.",
                                    data: result
                                })
                              }).catch(err => new Error(err))
                        } catch (e) { console.log(e) }
                    }






    } catch (e) {
     console.log(e)
        res.json({
            success: false,
            message: "Something went wrong!",
           // message: "This email belongs to an existing registered user! Choose something else."
        })

      }
}







            // const result = await Registers.findOne({ email: req.body.email  });
            // if(result){
            // return res.status(400).json({
            //     success: false,
            //     //message: "This email belongs to an existing registered user! Choose something else."});
            //     message: "Email sudah terdaftar ."});
            // };



        //    const result = await Registers.findOne({ email: req.body.email  });
        //     if(result){
        //         return res.status(400).json({
        //         success: false,
        //         message: "Email sudah terdaftar ."});
        //         };
               // const salt = await bcrypt.genSalt();
              //  const hashPassword = await bcrypt.hash(password, salt);
                // try {
                //         await Users.create({
                //             id : iduniq,
                //             name: name,
                //             email: email,
                //             password: hashPassword
                //         });
                //         res.json({msg: "Register Berhasil"});
                //     } catch (error) {
                //         console.log(error);
                //     }







export const Login = async(req, res) => {
    try {
          const errors = validationResult(req)



        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });

         if(!errors.isEmpty()) {
                  return  res.status(400).json({
                        success: false,
                        message: "Validation failure!",
                        errors: errors.errors
                    });
            };

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({success: false, msg: "Wrong Password"});
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '20s'
            });

            const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            await Users.update({refresh_token: refreshToken},{
                where:{
                    id: userId
                }
            });
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({ accessToken });

    } catch (errors) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}