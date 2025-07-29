import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

// Email Registration
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, middleName, lastName, fingerprint } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName || !fingerprint) {
    res.status(400).json({ message: "Missing required fields: email, password, firstName, lastName, fingerprint" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.googleId && !existingUser.password) {
        res.status(400).json({ message: "This email is already used with Google Sign-In. Please use 'Continue with Google'." });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
    });

    await newUser.save();

    const token = generateToken({
      id: (newUser._id as string).toString(),
      email: newUser.email,
      fingerprint
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Email Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fingerprint } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  if(!fingerprint) {
    res.status(400).json({message: "Missing device fingerprint"});
    return;
  }

  try {
    const user = await User.findOne({ email }) as (typeof User.prototype & { _id: any, password?: string, googleId?: string });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Scenario 1: Email exists but was created via Google
    if (!user.password && user.googleId) {
      res.status(400).json({ message: "This email is registered using Google. Please use 'Continue with Google'." });
      return;
    }

    // Continue normal login
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      fingerprint
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};