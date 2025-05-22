const express = require('express')
const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const router = express.Router()

router.post('/register', async (req, res) => {
   const {username, password} = req.body;
   const user = await UserModel.findOne({username})
   if(user) {
    return res.json({message:"user existed"})
   }
   const hashpassword = await bcrypt.hash(password, 10)
   const newuser = new UserModel({username, password: hashpassword})
   await newuser.save()
   return res.json({message: "record saved"})
})

router.post('/login', async (req, res)=>{
   const {username, password} = req.body;
   const user= await UserModel.findOne({username});
   if(!user){
      return res.json({message:"wrong credentials"})
   }
   const validPassword = await bcrypt.compare(password, user.password);
   if(!validPassword){
      return res.json({message:"wrong credentials"})
   }
   const token = jwt.sign({id: user._id}, "secret");
   res.cookie("token", token)
   return res.json({message: "successfully login", id: user._id})
})
module.exports= router