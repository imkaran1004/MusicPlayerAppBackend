const express = require("express");
const router = express.Router();
const User=require("../Models/User");
const bcrypt=require("bcrypt");
const {getToken}=require("../utils/helpers");
router.post("/register",async (req,res) => {
    const {Email,password,firstName,lastName,username} = req.body;
    const user= await User.findOne({Email:Email});
    if(user){
        return res.status(403).json({error:"A User With this Email id is alredy Exists"});
    }
    const hashedPassword=await bcrypt.hash(password, 10);
    const newUserData={
        Email,
        password:hashedPassword,
        firstName,
        lastName,
        username
    };
    const newUser=await User.create(newUserData);
    const token=await getToken(Email,newUser);
    const userToReturn={...newUser.toJSON(),token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req,res) => {
    const {Email,password}  = req.body;
    const user=await User.findOne({Email:Email});
    if(!user){
        return res.status(403).json({error:"Invalid Credentials"});
    }
    const isPasswordValid=bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(403).json({error:"Invalid Credentials"});
    }
    const token=await getToken(user.Email,user);
    const userToReturn={...user.toJSON(),token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/home", async (req,res) => {
    const {firstName,lastName,Email}  = req.body;
    const user=await User.findOne({Email:Email});
    if(!user){
        return res.status(403).json({error:"Invalid Credentials"});
    }
    const token=await getToken(user.Email,user);
    const userToReturn={...user.toJSON(),token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports=router;
