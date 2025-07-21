const db = require("../models/index");
const { user: User, role: Role } = db;

const allAccess = (req, res) => {
  res.status(200).json({ message: "Public Content." });
};

const userBoard = (req, res) => {
  res.status(200).json({ message: "User Content." });
};

const adminBoard = (req, res) => {
  res.status(200).json({ message: "Admin Content." });
};

const librarianBoard = (req, res) => {
  res.status(200).json({ message: "librarian Content." });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "roles",
        attributes: ["name"],
      },
      attributes: ["id", "username", "email", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["name"],
          through: { attributes: [] }, 
        },
      ],
      attributes: ["id", "username", "email", "createdAt"], // Remove 'role'
      order: [["createdAt", "DESC"]],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`),
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      message: "Users retrieved successfully!",
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,
  getUserProfile,
  getAllUsers
};