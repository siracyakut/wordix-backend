import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: false,
  },
  question: {
    type: String,
    required: true,
  },
  letter: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("questions", questionSchema);

export default Question;
