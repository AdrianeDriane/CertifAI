import express from "express";
import passport from "passport";
import { login, register } from "../controllers/authControllers";
import { generateToken } from "../utils/jwt";
import { Request, Response } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import User from "../models/User";

const router = express.Router();

// Email routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth
//TODO: DISABLE CHANGING NAME OF USER UPON REGISTRATION IF ALREADY EXISTS
router.get("/google", (req: Request, res: Response, next) => {
  const fingerprint = req.query.fp as string;

  if (!fingerprint) {
    res.status(400).send("Missing fingerprint");
    return;
  }

  // Encode fingerprint in state parameter
  const stateData = { fingerprint };
  const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

  // Continue with OAuth, passing state parameter
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    if (!req.user || typeof req.user !== "object") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.log(
      "====================GOOGLECALLBACK===================",
      req.user
    );

    // Get user info and fingerprint from the modified passport strategy
    const { _id, email, fingerprint } = req.user as {
      _id: string;
      email: string;
      fingerprint: string;
    };

    if (!fingerprint) {
      res.status(400).send("Missing fingerprint in user object");
      return;
    }

    // Sign JWT including fingerprint
    const token = generateToken({ id: _id, email, fingerprint });

    // Redirect back to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}/login/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// Route to validate token + fingerprint
router.get("/validate", authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user !== "object" || !("email" in req.user)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userEmail = (req.user as { email: string }).email;

    const user = await User.findOne({ email: userEmail }); //TODO: Use email instead of ID

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    //USE THIS WHEN EMAIL VERIFICATION IS IMPLEMENTED
    // if (!user.verified) {
    //   res.status(403).json({ message: 'Email not verified' });
    //   return;
    // }

    res.json({ valid: true, user });
  } catch (err) {
    console.error("❌ Error in validate route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
