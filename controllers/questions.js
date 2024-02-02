import Question from "../models/question.js";

const randomQuestionByLetter = async (letter, maxLength = -1) => {
  let questions = await Question.find({ letter });
  if (maxLength > 5) {
    questions = questions.filter(
      (question) => question.question.length <= maxLength,
    );
  }
  return questions[Math.floor(Math.random() * questions.length)];
};

export const getAZQuestions = async (req, res) => {
  try {
    const letters = [
      "A",
      "B",
      "C",
      "Ç",
      "D",
      "E",
      "F",
      "G",
      "H",
      "İ",
      "K",
      "L",
      "M",
      "N",
      "O",
      "Ö",
      "P",
      "R",
      "S",
      "Ş",
      "T",
      "U",
      "Ü",
      "V",
      "Y",
      "Z",
    ];
    const questions = [];
    for (const letter of letters) {
      const question = await randomQuestionByLetter(letter);
      questions.push(question);
    }
    res.status(200).json({ success: true, data: questions });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const getQuestionByLetter = async (req, res) => {
  try {
    if (req.params.letter.length !== 1)
      return res
        .status(400)
        .json({ success: false, error: "Not provided a letter." });

    const question = await randomQuestionByLetter(
      req.params.letter.toLocaleUpperCase("tr-TR"),
      25,
    );
    res.status(200).json({ success: true, data: question });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();

    if (questions.length > 0) {
      res.status(200).json({ success: true, data: questions });
    } else {
      res.status(404).json({ success: false, data: "Soru bulunamadı!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.body.id);

    if (question) {
      res.status(200).json({ success: true, data: question._doc });
    } else {
      res.status(404).json({ success: false, data: "Soru bulunamadı!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.body.id,
      {
        question: req.body.question,
        letter: req.body.letter,
        answer: req.body.answer,
      },
      { new: true },
    );

    if (updatedQuestion) {
      res.status(200).json({ success: true, data: "Güncelleme başarılı!" });
    } else {
      res
        .status(500)
        .json({ success: false, data: "Güncelleme sırasında hata oluştu." });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.body.id);

    if (deletedQuestion) {
      res.status(200).json({ success: true, data: "Silme işlemi başarılı." });
    } else {
      res
        .status(500)
        .json({
          success: false,
          data: "Silme işlemi sırasında bir hata oluştu.",
        });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};
