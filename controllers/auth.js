import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.status(200).json({ success: true, data: users });
    } else {
      res.status(404).json({ success: false, data: "User not found!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res
        .status(401)
        .json({ success: false, data: "Token bulunamadı!" });

    const data = await jwt.verify(token, process.env.JWT_SECRET);

    if (data) {
      res.status(200).json({ success: true, data });
    } else {
      res.status(401).json({ success: false, data: "Geçersiz token!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser)
      return res.status(409).json({
        success: false,
        data: "Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut!",
      });

    if (req.body.password !== req.body.passwordConfirm)
      return res.status(400).json({
        success: false,
        data: "Şifreler eşleşmiyor!",
      });

    const password = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      password,
      google: 0,
    });
    const user = await newUser.save();

    const token = await jwt.sign(user._doc, process.env.JWT_SECRET);
    res.cookie("token", token, {
      expires: new Date(new Date().getTime() + 3600 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({ success: true, data: user._doc });
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (!findUser)
      return res.status(404).json({
        success: false,
        data: "Sistemde bu e-posta adresiyle kayıtlı bir hesap bulunamadı!",
      });

    if (findUser._doc.google === 1)
      return res.status(403).json({
        success: false,
        data: "Bu hesap google ile eşleştirilmiş. Google ile giriş yapma seçeneğini kullanın.",
      });

    const compare = await bcrypt.compare(
      req.body.password,
      findUser._doc.password,
    );

    if (!compare)
      return res.status(401).json({
        success: false,
        data: "Geçersiz şifre girdiniz. Lütfen tekrar deneyin.",
      });

    const token = await jwt.sign(findUser._doc, process.env.JWT_SECRET);
    res.cookie("token", token, {
      expires: new Date(new Date().getTime() + 3600 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ success: true, data: findUser._doc });
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ success: true, data: "Çıkış işlemi başarılı." });
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const googleToken = req.body.token;
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`,
    );
    const data = await response.json();

    if (data.email) {
      const findUser = await User.findOne({ email: data.email });
      if (findUser) {
        if (findUser._doc.google !== 1)
          return res.status(409).json({
            success: false,
            data: "Bu hesap google ile bağdaştırılmamış.",
          });

        const token = await jwt.sign(findUser._doc, process.env.JWT_SECRET);
        res.cookie("token", token, {
          expires: new Date(new Date().getTime() + 3600 * 1000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        res.status(200).json({ success: true, data: findUser._doc });
      } else {
        const newUser = new User({
          email: data.email,
          google: 1,
        });
        const user = await newUser.save();

        const token = await jwt.sign(user._doc, process.env.JWT_SECRET);
        res.cookie("token", token, {
          expires: new Date(new Date().getTime() + 3600 * 1000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        res.status(201).json({ success: true, data: user._doc });
      }
    } else {
      res.status(401).json({ success: false, data: "Geçersiz google token!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      res.status(200).json({ success: true, data: user._doc });
    } else {
      res.status(404).json({ success: false, data: "Kullanıcı bulunamadı!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          trueCount: req.body.trueCount,
          falseCount: req.body.falseCount,
          solvedCount: 1,
        },
      },
      { new: true },
    );

    if (updatedUser) {
      const token = await jwt.sign(updatedUser._doc, process.env.JWT_SECRET);
      res.cookie("token", token, {
        expires: new Date(new Date().getTime() + 3600 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({ success: true, data: updatedUser._doc });
    } else {
      res.status(500).json({
        success: false,
        data: "Kullanıcı güncelleme işlemi sırasında bir hata oluştu!",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.id);

    if (deletedUser) {
      res.status(200).json({ success: true, data: "Silme işlemi başarılı." });
    } else {
      res.status(500).json({
        success: false,
        data: "Silme işlemi sırasında bir hata oluştu.",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        email: req.body.email,
        solvedCount: req.body.solvedCount,
        trueCount: req.body.trueCount,
        falseCount: req.body.falseCount,
        admin: req.body.admin,
      },
      { new: true },
    );

    if (updatedUser) {
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
