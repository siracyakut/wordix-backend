import mongoose from "mongoose";

const leaderboardSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  trueCount: {
    type: Number,
    required: true,
  },
  falseCount: {
    type: Number,
    required: true,
  },
  passCount: {
    type: Number,
    required: true,
  },
  score: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Leaderboard = mongoose.model("leaderboards", leaderboardSchema);

export default Leaderboard;
