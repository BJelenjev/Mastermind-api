// games-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const codeSchema = new Schema({
    initcode: { type: [Number], required: true},
    won: { type: Boolean, default: false},
    los: { type: Boolean, default: false}
  });

  const playersSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
  });

  const guessesSchema = new Schema({
    guess: { type: [Number], required: true},
    clue: { type: [Number], required: true},
  });

  const games = new Schema({
    code: codeSchema,
    players: [playersSchema],
    guesses: [guessesSchema],
    turn: { type: Number, default: 0 },
    started: { type: Boolean, default: false },
    winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('games', games);
};
