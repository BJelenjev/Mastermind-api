// games-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const playerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'users' },
  });

  const guessSchema = new Schema({
    guess: { type: [Number], required: true},
    clue: { type: [Number], required: true},
  });

  const games = new Schema({
    code: { type: [Number], required: true},
    colors: { type: [String], required: true}, // CSS-compatible color names or hex colors prefixed with '#'
    players: [playerSchema],
    guesses: [guessSchema],
    turn: { type: Number, default: 0 },
    started: { type: Boolean, default: false },
    winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users' },
    won: { type: Boolean, default: false},
    loss: { type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('games', games);
};
