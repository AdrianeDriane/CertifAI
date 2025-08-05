import mongoose, { Document, Schema } from 'mongoose';

interface IDeviceInfo {
  ip: string;
  fingerprint: string;
}

interface IVersion {
  version: number;
  action: 'uploaded' | 'edited' | 'signed' | 'locked';
  sfdt: any; // JSON format of the document (Syncfusion)
  hash: string;
  blockchainTxHash: string;
  createdAt: Date;
  modifiedBy: mongoose.Types.ObjectId;
  deviceInfo?: IDeviceInfo;
}

export interface IDocument extends Document {
  title: string;
  type?: string;
  createdBy: mongoose.Types.ObjectId;
  currentVersion: number;
  status: 'draft' | 'signed' | 'archived';
  visibility: 'private' | 'org' | 'public';
  versions: IVersion[];
}

const DeviceInfoSchema = new Schema<IDeviceInfo>(
  {
    ip: { type: String },
    fingerprint: { type: String },
  },
  { _id: false }
);

const VersionSchema = new Schema<IVersion>(
  {
    version: { type: Number, required: true },
    action: {
      type: String,
      enum: ['uploaded', 'edited', 'signed', 'locked'],
      required: true,
    },
    sfdt: { type: Schema.Types.Mixed, required: true },
    hash: { type: String, required: true },
    blockchainTxHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deviceInfo: { type: DeviceInfoSchema, required: false },
  },
  { _id: false }
);

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    type: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currentVersion: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft', 'signed', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['private', 'org', 'public'],
      default: 'private',
    },
    versions: { type: [VersionSchema], required: true },
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
export default DocumentModel;
