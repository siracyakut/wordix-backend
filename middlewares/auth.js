import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res
        .status(401)
        .json({ success: false, data: "Token bulunamadı!" });

    const userData = await jwt.verify(token, process.env.JWT_SECRET);

    if (userData) {
      req.user = userData;
      next();
    } else {
      res.status(401).json({ success: false, data: "Geçersiz token!" });
    }
  } catch (e) {
    res.status(500).json({ success: false, data: e.message });
  }
};

export default authMiddleware;
