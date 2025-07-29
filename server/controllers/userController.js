const db = require("../models/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const { v4: uuidv4 } = require("uuid") // For generating unique barcode
const { User, Role } = db

const allAccess = (req, res) => {
  res.status(200).json({ message: "Public Content." })
}

const userBoard = (req, res) => {
  res.status(200).json({ message: "User Content." })
}

const adminBoard = (req, res) => {
  res.status(200).json({ message: "Admin Content." })
}

const librarianBoard = (req, res) => {
  res.status(200).json({ message: "Librarian Content." })
}
const getUserBarcode = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Generate barcode
    const canvas = createCanvas();
    JsBarcode(canvas, user.id.toString(), { format: 'CODE128' });

    res.setHeader('Content-Type', 'image/png');
    canvas.pngStream().pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Error generating barcode' });
  }
};
const createUser = async (req, res) => {
  try {
    if (!req.userRole || !["admin", "librarian"].includes(req.userRole)) {
      return res.status(403).json({ message: "Only admins or librarians can create users!" });
    }

    const { username, email, password, date_of_birth, phone, roleId } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    let assignedRoleId = roleId; // Use the provided roleId
    if (!assignedRoleId) {
      const defaultRole = await Role.findOne({ where: { name: "user" } });
      assignedRoleId = defaultRole ? defaultRole.id : null;
    } else {
      const role = await Role.findByPk(assignedRoleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid roleId!" });
      }
      if (role.name === "admin" && req.userRole !== "admin") {
        return res.status(403).json({ message: "Only admins can create other admins!" });
      }
    }

    console.log("Assigned RoleId:", assignedRoleId); // Debug log

    let barcode;
    let isUnique = false;
    while (!isUnique) {
      barcode = uuidv4().replace(/-/g, "").slice(0, 12);
      const existingUser = await User.findOne({ where: { barcode } });
      if (!existingUser) isUnique = true;
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      phone,
      profile_image,
      roleId: assignedRoleId, // Use lowercase roleId to match model
      barcode,
    });

    const token = jwt.sign(
      { id: user.id, role: (await Role.findByPk(assignedRoleId)).name },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    const userWithRole = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["id", "name", "description"],
          required: false,
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "date_of_birth",
        "profile_image",
        "phone",
        "roleId",
        "barcode",
        "createdAt",
        "updatedAt",
      ],
    });

    const formattedUser = {
      id: userWithRole.id,
      username: userWithRole.username,
      email: userWithRole.email,
      date_of_birth: userWithRole.date_of_birth,
      profile_image: userWithRole.profile_image,
      phone: userWithRole.phone,
      barcode: userWithRole.barcode,
      role: userWithRole.Role.name || null,
      createdAt: userWithRole.createdAt,
      updatedAt: userWithRole.updatedAt,
    };

    res.status(201).json({
      message: "User created successfully!",
      user: formattedUser,
      token,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: "Role",
          // attributes: ["id", "name", "description"],
          required: false,
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "date_of_birth",
        "profile_image",
        "phone",
        "RoleId",
        "barcode", // Include barcode
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth,
      profile_image: user.profile_image,
      phone: user.phone,
      barcode: user.barcode, // Include barcode
      role: user.Role.name || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    res.status(200).json({
      message: "Users retrieved successfully!",
      users: formattedUsers,
      total: formattedUsers.length,
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get user by specific ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["id", "name", "description"],
          required: false,
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "date_of_birth",
        "profile_image",
        "phone",
        "RoleId",
        "barcode", // Include barcode
        "createdAt",
        "updatedAt",
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth,
      profile_image: user.profile_image,
      phone: user.phone,
      barcode: user.barcode, // Include barcode
      role: user.Role
        ? {
            id: user.Role.id,
            name: user.Role.name,
            description: user.Role.description,
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    res.status(200).json({
      message: "User retrieved successfully!",
      user: formattedUser,
    })
  } catch (error) {
    console.error("Get user by ID error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get current user's profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["id", "name", "description"],
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "date_of_birth",
        "profile_image",
        "phone",
        "RoleId",
        "barcode", // Include barcode
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: user.profile_image,
        phone: user.phone,
        barcode: user.barcode, // Include barcode
        role: user.Role
          ? {
              id: user.Role.id,
              name: user.Role.name,
              description: user.Role.description,
            }
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ['id', 'name'] });
    res.status(200).json({ message: "Roles retrieved successfully!", roles });
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id || req.userId;
    const isSelfUpdate = !req.params.id || req.params.id == req.userId;

    if (!isSelfUpdate && req.userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this user." });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is missing!" });
    }

    const {
      username,
      email,
      date_of_birth,
      profile_image,
      phone,
      RoleId,
      password,
    } = req.body;

    const user = await User.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ message: "Email is already in use!" });
      }
    }

    if (phone && phone !== user.phone) {
      const existing = await User.findOne({ where: { phone } });
      if (existing && existing.id !== user.id) {
        return res.status(400).json({ message: "Phone number is already in use!" });
      }
    }

    if (RoleId && !isSelfUpdate) {
      const role = await Role.findByPk(RoleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role ID!" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (profile_image) updateData.profile_image = profile_image;
    if (date_of_birth) updateData.date_of_birth = date_of_birth;
    if (RoleId && !isSelfUpdate) updateData.RoleId = RoleId;
    if (password) updateData.password = bcrypt.hashSync(password, 8);

    await user.update(updateData);

    const updatedUser = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["id", "name", "description"],
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "date_of_birth",
        "profile_image",
        "phone",
        "RoleId",
        "barcode", // Include barcode
        "createdAt",
        "updatedAt",
      ],
    });

    const formatted = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      date_of_birth: updatedUser.date_of_birth,
      profile_image: updatedUser.profile_image,
      phone: updatedUser.phone,
      barcode: updatedUser.barcode, // Include barcode
      role: updatedUser.Role
        ? {
            id: updatedUser.Role.id,
            name: updatedUser.Role.name,
            description: updatedUser.Role.description,
          }
        : null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json({
      message: isSelfUpdate ? "Profile updated successfully!" : "User updated successfully!",
      user: formatted,
    });
  } catch (error) {
    console.error("Flexible update error:", error);
    res.status(500).json({ message: "Server error while updating user." });
  }
};

// Delete user by specific ID
const deleteUserById = async (req, res) => {
  try {
    const { User } = db;
    const userId = req.params.id;

    const deleted = await User.destroy({ where: { id: userId } });

    if (deleted === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: `User with ID ${userId} deleted successfully!`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete current user's account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }

    await user.destroy()

    res.status(200).json({
      message: "Account deleted successfully!",
    })
  } catch (error) {
    console.error("Delete account error:", error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,
  getUserBarcode,
  createUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  getRoles,
  updateUser,
  deleteUserById,
  deleteAccount,
}