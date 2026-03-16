import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync("admin123", 10);

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

