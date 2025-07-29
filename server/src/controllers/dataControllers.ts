import { Request, Response } from "express";
import User from "../models/User";

export const testGetAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("email firstName lastName middleName _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, middleName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }

    const newUser = new User({
      email,
      password,
      fullName: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
    });

    await newUser.save();
    
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      }
    });
  } catch (error: any) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: error.message || "Failed to create user"  });
  }
};