import { UserPayload } from '../IUserPayload';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
