const db = require("../models/index.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config.js");

const User = db.user;
const Role = db.role;

const signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    console.log("Signup request:", { username, email, roles }); // Ensure 'console' is correct
    console.log("JWT Secret:", authConfig.secret); // Ensure 'console' is correct

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("User created:", user.id); // Ensure 'console' is correct

    if (roles && roles.length > 0) {
      const userRoles = await Role.findAll({
        where: { name: roles },
      });
      await user.setRoles(userRoles);
    } else {
      const userRole = await Role.findOne({ where: { name: "user" } });
      if (userRole) await user.setRoles([userRole]);
    }

    const userWithRoles = await User.findByPk(user.id, {
      include: { model: Role, as: "roles", attributes: ["name"] },
    });

    console.log("User with roles:", userWithRoles); // Ensure 'console' is correct

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400,
    });

    const authorities = userWithRoles.roles.map(
      (role) => `ROLE_${role.name.toUpperCase()}`
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error); // Ensure 'console' is correct
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required!",
      });
    }

    const user = await User.findOne({
      where: { username },
      include: { model: Role, as: "roles", attributes: ["name"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = user.roles.map(
      (role) => `ROLE_${role.name.toUpperCase()}`
    );

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error); // Ensure 'console' is correct
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.userId;

    await db.sequelize.transaction(async (t) => {
      await db.sequelize.query("DELETE FROM user_roles WHERE userId = ?", {
        replacements: [userId],
        type: db.Sequelize.QueryTypes.DELETE,
        transaction: t,
      });

      await User.destroy({
        where: { id: userId },
        transaction: t,
      });
    });

    res.status(200).json({
      message: "User logged out and account deleted successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error); // Ensure 'console' is correct
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  signup,
  signin,
  logout
};