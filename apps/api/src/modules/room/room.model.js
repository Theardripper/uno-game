import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    hostId: { type: String, required: true },
    maxPlayers: { type: Number, required: true, default: 4 },
    isPrivate: { type: Boolean, required: true, default: false },
    password: { type: String, default: null },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'finished'],
      default: 'waiting'
    },
    players: [{ type: String }] // IDs dos jogadores na sala
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

roomSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.currentPlayers = ret.players.length;
    
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Ocultar a senha da resposta JSON
    delete ret.players;  // Para manter a resposta idêntica ao Swagger
  },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
