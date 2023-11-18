const express = require("express");
const router = express.Router();
const passport=require("passport");
const Playlist=require("../Models/Playlist");
const User=require("../Models/User");
const Song=require("../Models/Song");
router.post( 
    "/create",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {                 
        const currentUser=req.user;
        const {name,thumbNail,songs}=req.body;
        if(!name || !thumbNail || !songs){
            return res.status(301).json({error: "Insufficient degtails to creare a playlist"});
        }
        const playlistData={
            name,thumbNail,songs,owner:currentUser._id,collaborators:[],
        };
        const playlist=await Playlist.create(playlistData);
        return res.status(200).json({data:playlist});
    }
)

router.get(
    "/get/playlist/:playlistId",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const playlistId=req.params.playlistId;
        const playlist=await Playlist.findOne({_id:playlistId}).populate({
            path:"songs",
            populate:{
                path:"artist",
            }
        });
        if(!playlist){
            return res.status(301).json({error:"Invalid ID"});
        }
        return res.status(200).json({data:playlist});
    }
)

router.get(
    "/get/me",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const {artistId}=req.user._id;
        const playlists= await Playlist.find({artist:artistId}).populate("owner");
        return res.status(200).json({data:playlists});
    }
)



router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const artistId=req.params.artistId;
        const artist=await User.findOne({_id:artistId});
        if(!artist){
            return res.status(304).json({error:"Invalid Artist ID"});
        }
        const playlists=await Playlist.find({owner:artistId});
        return res.status(200).json({data:playlists});
    }
)

router.post(
    "/add/song", 
    passport.authenticate("jwt",{session:false}),
    async(req,res) => {
        const currentUser=req.user;
        const {playlistId,songId}=req.body;
        const playlist=await Playlist.findOne({_id:playlistId}).populate("owner");
        if(!playlist){
            return res.status(304).json({error:"Playlist doesn't exist"});
        }
        console.log(playlist.owner.equals(currentUser._id))
        if(!playlist.owner.equals(currentUser._id) && !playlist.collaborators.includes(currentUser._id))
        {
            return res.status(400).json({error:"Not Allowed"});
        }
        const song=await Song.findOne({_id:songId});
        if(!song){
            return res.status(304).json({error:"Song does not exist"});
        }
        playlist.songs.push(songId);
        await playlist.save();
        return res.status(200).json(playlist);
    }
)



module.exports=router;