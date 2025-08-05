import { Request } from 'express';
import { IUserPayload } from './IUserPayload';

export interface IAuthenticatedRequest extends Request {
  user: IUserPayload;
}
