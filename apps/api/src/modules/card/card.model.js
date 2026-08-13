import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    value: { type: String, required: true },
    gameId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

cardSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Card', cardSchema);