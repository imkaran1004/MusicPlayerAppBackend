const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song=require("../Models/Song");
const User=require("../Models/User");
router.post("/create",passport.authenticate("jwt",{session:false}), async (req,res) => {
    const {name,thumbNail,track} = req.body;
    if(!name || !thumbNail || !track){
        return res.status(301).json({error: "Insufficient degtails to creare a song"});
    }
    const artist=req.user._id;
    const songDetails={name,thumbNail,track,artist};
    const createdSong=await Song.create(songDetails);
    return res.status(200).json(createdSong);

});

router.get(
    "/get/mysongs",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const songs= await Song.find({artist:req.user._id}).populate("artist");
        return res.status(200).json({data:songs});
    }
)

router.get(
    "/get/me",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const {artistId}=req.user._id;
        const songs= await Song.find({artist:artistId}).populate("owner");
        return res.status(200).json({data:songs});
    }
)

router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const {artistId}=req.params.artistId;
        const artist=await User.findOne({_id:artistId});
        if(!artist){
            return res.status(301).json({error:"Artist does not exist"});
        }
        const songs= await Song.find({artist:artistId}).populate("artist");
        return res.status(200).json({data:songs});
    }
)

router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const {songName}=req.params;
        // try pattern matching instead of direct matching ex. vanilla->vanila
        const songs= await Song.find({name:songName}).populate("artist");
        return res.status(200).json({data:songs});
    }
)

module.exports=router;