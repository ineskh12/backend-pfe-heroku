import * as mongoose from 'mongoose';
export const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nbreofuses: { type: Number, default: 0 },
    version: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editor: { type: Array, default: Array },
    layout: { type: Array, default: Array },
    state: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  },
);
