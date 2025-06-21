import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
dotenv.config();

export const loginUser=async(req,res)=>{
    const {handle}=req.body;
    if (!handle) return res.status(400).json({ message: "CF Handle required" });
    let user=await User.findOne({handle});
    if(!user){
        user=await User.create({handle});
    }
    const token=jwt.sign({id:user._id,handle:user.handle},process.env.JWT_SECRET);
    res.json({ token });
};

export const getUser = async (req, res) => {
  const user = await User.findOne({ handle: req.user.handle });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateBookmarks = async (req, res) => {
  const { bookmarks } = req.body;
  const user = await User.findOneAndUpdate(
    { handle: req.user.handle },
    { bookmarks },
    { new: true }
  );
  res.json(user);
};

export const updateSolved = async (req, res) => {
  const { solved } = req.body;
  const user = await User.findOneAndUpdate(
    { handle: req.user.handle },
    { solved },
    { new: true }
  );
  res.json(user);
};

export const updateFriends = async (req, res) => {
  const { friends } = req.body;
  const user = await User.findOneAndUpdate(
    { handle: req.user.handle },
    { friends },
    { new: true }
  );
  res.json(user);
};