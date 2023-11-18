const mongoose=require("mongoose");
const User=new mongoose.Schema({
    firstName: {
        type:String,
        require:true,
    },
    password: {
        type:String,
        require:true,
        private:true,
    },
    lastName: {
        type:String,
        require:false,
    },
    Email: {
        type:String,
        require:true,
    },
    username: {
        type:String,
        require:true,
    },
    likedSongs: {
        type:String,
        default:"",
    },
    likedPlaylist: {
        type:String,
        default:"",
    },
    subscribedArtist: {
        type:String,
        default:"",
    },
});

const UserModel=mongoose.model("User",User);
module.exports=UserModel;