import Leaderboard from "../models/leaderboard.js";
import User from "../models/user.js";

export const getLeaderboard = async (req, res) => {
  try {
    const records = await Leaderboard.find();
    const users = await User.find();

    if (users.length > 0 && records.length > 0) {
      records.forEach((data, index) => {
        records[index]._doc.username = users.find(
          (u) => u._id.toString() === data.userId,
        ).email;
      });
      res.status(200).json({
        success: true,
        data: records.sort((a, b) => b.score - a.score),
      });
    } else {
      res.status(404).json({ success: false, data: "Hiç kayıt bulunamadı!" });
    }
  } catch (e) {
    res.status(500).json({ success: true, data: e.message });
  }
};

export const addLeaderboard = async (req, res) => {
  try {
    const newRecord = new Leaderboard({
      userId: req.body.userId,
      trueCount: req.body.trueCount,
      falseCount: req.body.falseCount,
      passCount: req.body.passCount,
      score: req.body.score,
      time: req.body.time,
    });
    const doc = await newRecord.save();

    if (doc) {
      Leaderboard.find()
        .sort({ score: -1 })
        .then((scores) => {
          const placement =
            scores.findIndex((s) => s.score < req.body.score) === -1
              ? scores.length
              : scores.findIndex((s) => s.score < req.body.score);

          res.status(201).json({
            success: true,
            data: {
              doc: doc._doc,
              place: { placement, maxPlace: scores.length },
            },
          });
        });
    } else {
      res.status(500).json({
        success: false,
        data: "Kayıt oluşturulurken bir hata oluştu!",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};
