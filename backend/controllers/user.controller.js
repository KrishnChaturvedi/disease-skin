import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import validator from 'validator';

export const registerUser = async(req, res)=>{
  try {
    const {name, email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({success: false, message: "Email and Passwords are required"});
    }

 if(!validator.isEmail(email)){
      return res.status(400).json({success: false, message:"Enter a valid email"});
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({email: normalizedEmail});

    if(existingUser){
      return res.status(400).json({success: false, message: "The user with Email id already exist"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name || "User",
        email :normalizedEmail,
        password: hashedPassword,
    })
    const payload = { id: user._id };
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message:"Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        emial: user.email,        
      }
    });

  } catch (error) {
    res.status(500).json({success: false, message:error.message})
  }

  
}