import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      passReqToCallback: true, // allows access to req in the callback
    },
    async (req, _, __, profile, done) => {
      try {
        let fingerprint;
        const state = req.query.state as string;
        
        if (state) {
          try {
            const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
            fingerprint = stateData.fingerprint;
          } catch (error) {
            console.error("Error parsing state parameter:", error);
            return done(new Error("Invalid state parameter"), false);
          }
        }

        if (!fingerprint) {
          return done(new Error("Missing fingerprint in state"), false);
        }

        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Return existing user with fingerprint attached
          return done(null, { ...user.toObject(), fingerprint });
        }

        // Check if email exists but registered manually
        user = await User.findOne({ email });

        if (user) {
          // Soft merge Google account into manual account
          user.googleId = profile.id;
          user.fullName = profile.displayName;
          await user.save();
          return done(null, { ...user.toObject(), fingerprint });
        }

        // If no user with this Google ID or email, then create new/register
        const newUser = await User.create({
          googleId: profile.id,
          email,
          fullName: profile.displayName,
        });

        return done(null, { ...newUser.toObject(), fingerprint });
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return done(err, false);
      }
    }
  )
);
