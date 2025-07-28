const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config");

const signup = async (req, res) => {
  try {
    const { username, email, password, date_of_birth, phone, RoleId } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const { User, Role } = db;

    // ✅ Check for existing email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // ✅ Check for existing username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // ✅ Format DOB (DD.MM.YYYY → YYYY-MM-DD)
    const dob = date_of_birth
      ? new Date(date_of_birth.split('.').reverse().join('-')).toISOString().split('T')[0]
      : null;

    if (dob && isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: "Invalid date of birth format. Use DD.MM.YYYY." });
    }

    if (dob && new Date(dob) > new Date()) {
      return res.status(400).json({ message: "Date of birth cannot be in the future." });
    }

    // ✅ Hash password with consistent rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth: dob,
      phone,
      profile_image,
      roleId: RoleId || null,
    });

    // ✅ Assign default role if RoleId not provided
    let role = null;
    if (RoleId) {
      role = await Role.findByPk(RoleId);
    } else {
      role = await Role.findOne({ where: { name: "user" } });
    }

    if (role) {
      user.roleId = role.id;
      await user.save();
    }

    // ✅ Get role for response
    const userWithRole = await User.findByPk(user.id, {
      include: {
        model: Role,
        as: "Role",
      },
    });

    // ✅ Generate JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: userWithRole.Role?.name || "user",
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }

    res.status(500).json({ message: error.message });
  }
};
  

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const { User, Role } = db;

    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        as: "Role",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.Role?.name || "user",
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  signup,
  signin
};
