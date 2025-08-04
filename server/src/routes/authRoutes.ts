import express from 'express';
import passport from 'passport';
import { login, register } from '../controllers/authControllers';
import { generateToken } from '../utils/jwt';
import { Request, Response } from 'express';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Email routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth
//TODO: DISABLE CHANGING NAME OF USER UPON REGISTRATION IF ALREADY EXISTS
router.get('/google', (req: Request, res: Response, next) => {
  const fingerprint = req.query.fp as string;

  if (!fingerprint) {
    res.status(400).send('Missing fingerprint');
    return;
  }

  // Encode fingerprint in state parameter
  const stateData = { fingerprint };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

  // Continue with OAuth, passing state parameter
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  (req: Request, res: Response) => {
    if (!req.user || typeof req.user !== 'object') {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get user info and fingerprint from the modified passport strategy
    const { id, email, fingerprint } = req.user as {
      id: string;
      email: string;
      fingerprint: string;
    };

    if (!fingerprint) {
      res.status(400).send('Missing fingerprint in user object');
      return;
    }

    // Sign JWT including fingerprint
    const token = generateToken({ id, email, fingerprint });

    // Redirect back to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}/login/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// Route to validate token + fingerprint
router.get('/validate', authenticate, (req: Request, res: Response) => {
  res.json({ valid: true, user: req.user });
});

export default router;
