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
    combination: {type: [Number], required: true},
    numExact:    {type: Number, required: true},
    numApprox:   {type: Number, required: true},
    _playerId:   {type: Schema.Types.ObjectId, ref: 'users'},
  });

  const GAME_STATES = ['inProgress', 'computerWon', 'playerWon']
  
  const games = new Schema({
    code: { type: [Number], required: true},
    colors: { type: [String], required: true}, // CSS-compatible color names or hex colors prefixed with '#'
    players: [playerSchema],
    guesses: [guessSchema],
    turn: { type: Number, default: 0 },
    winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users' },
    gamePhase: { type: String, enum: GAME_STATES , default: GAME_STATES[0] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('games', games);
};
