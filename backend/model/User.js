import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    handle:{
        type:String,
        required:true,
        unique:true,
    },
    bookmarks:{
        type:[Object],
        default:[]
    },
    solved: { type: [String], default: [] },
    friends: { type: [String], default: [] },
});

const User = mongoose.model("User", userSchema);
export default User;