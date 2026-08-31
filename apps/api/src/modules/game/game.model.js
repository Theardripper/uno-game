import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    game_id: { type: Number, required: true, unique: true },
    name: { type: String },
    rules: { type: String, default: '' },
    creator_username: { type: String, required: true },
    state: {
      type: String,
      enum: ['created', 'in_progress', 'ended'],
      default: 'created'
    },
    players: [{ type: String }],
    ready_players: [{ type: String }],
    current_player: { type: String, default: '' },
    top_card: { type: String, default: 'Red 7' },
    scores: { type: Map, of: Number, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

gameSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Game', gameSchema);