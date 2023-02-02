const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const {body, validationResult} = require("express-validator");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "REST_API"

router.post("/register", 
                        body("email").isEmail(), 
                        body("password").isLength({min : 5, max : 15}), 
                        async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                sttaus : "Failed",
                message : "Error in send request",
                errors : errors.array()
            })
        }

        const {email, password} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                status : "Failed",
                message : "email already exists"
            })
        }

        Bcrypt.hash(password, 10, async function(err, hash){
           try{
            console.log(err, hash);
            if(err){
                return res.status(400).json({
                    status : "Failed",
                    message : "Error in Password"
                })
            }
            user = await User.create({
                email,
                password : hash
            })
            res.status(200).json({
                status : "Success",
                message : "registration successful",
                user
            })
           }catch(e){
                res.status(400).json({
                    status : "Failed",
                    message : "Error occured during hashing the password...."
                })
           }
        })

        // create the user
       
    }catch(e){
        res.status(400).json({
            status : "Failed",
            message : e.message
        })
    }
})

router.post("/login", body("email").isEmail(), body("password").isLength(), async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status : "Failed",
                message : "Error in request",
                errors : errors.array()
            })
        }

        const {email, password} = req.body;

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                status : "Failed",
                message : "Email is not Registered"
            })
        }
        Bcrypt.compare(password, user.password, function(err, result){
            console.log(err, result);
            if(err){
                return res.status(400).json({
                    status : "Failed",
                    message : "Password is not correct"
                })
            }
            if(result){
                const token = jwt.sign({
                    exp : 60*60*3,
                    data : user.data
                }, secret)
                console.log(token);
            }
            res.status(200).json({
                status : "Success",
                message : "Login Successful...."
            })
        })

    }catch(e){
        res.status(400).json({
            status : "Failed",
            message : e.message
        })
    }
})

module.exports= router;