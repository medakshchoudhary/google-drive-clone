const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model")



router.get("/register",(req,res)=>{
    res.render("register")
})

router.post("/register",

    // middlewares
    body("email").trim().isEmail().isLength({min:13}),
    body("password").trim().isLength({min:8}),
    body("username").trim().isLength({min:3}),
    
    async (req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:"Invalid Data"
            })
        }

        const {email,password,username} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            username
        })

        res.json(newUser)
})

router.get("/login",(req,res)=>{
    res.render("login")
})

router.post("/login",
    
    body("username").trim().isLength({min:3}),
    body("password").trim().isLength({min:8}),

    async (req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:"Invalid Data"
            })
        }

        const {username,password} = req.body;

        const user = await userModel.findOne({username});

        if(!user){
            return res.status(400).json({
                message:"Username or password incorrect",
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message:"Username or password incorrect",
            })
        }

        const token = jwt.sign({
                userId: user._id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,                 
        )

        res.cookie('token', token)

        res.json({
            message: "Logged in",
            user: {
                username: user.username,
                email: user.email
            }
        })
})

module.exports = router;