import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  fullName: string;
  googleId?: string;
  documents?: Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    fullName: { type: String, required: true },
    googleId: { type: String },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
