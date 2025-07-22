const db = require("../models/index")
const bcrypt = require("bcryptjs")
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

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, date_of_birth, phone, RoleId } = req.body
    const profile_image = req.file ? req.file.filename : null

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    // Check and assign role
    let roleId = RoleId
    if (!roleId) {
      const defaultRole = await Role.findOne({ where: { name: "user" } })
      roleId = defaultRole ? defaultRole.id : null
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      phone,
      profile_image,
      RoleId: roleId,
    })

    // Fetch user with role
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
        "RoleId",
        "createdAt",
        "updatedAt",
      ],
    })

    const formattedUser = {
      id: userWithRole.id,
      username: userWithRole.username,
      email: userWithRole.email,
      date_of_birth: userWithRole.date_of_birth,
      profile_image: userWithRole.profile_image,
      phone: userWithRole.phone,
      role: userWithRole.Role
        ? {
            id: userWithRole.Role.id,
            name: userWithRole.Role.name,
            description: userWithRole.Role.description,
          }
        : null,
      createdAt: userWithRole.createdAt,
      updatedAt: userWithRole.updatedAt,
    }

    res.status(201).json({
      message: "User created successfully!",
      user: formattedUser,
    })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
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
      role: user.Role
        ? {
            id: user.Role.id,
            name: user.Role.name,
            description: user.Role.description,
          }
        : null,
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
          as: "Role", // Must match the alias defined in association
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
        "roleId",
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


// Update user by specific ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { username, email, date_of_birth, profile_image, phone, RoleId, password } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use!" })
      }
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ where: { phone } })
      if (existingUser) {
        return res.status(400).json({ message: "Phone number is already in use!" })
      }
    }

    // Validate role if provided
    if (RoleId) {
      const role = await Role.findByPk(RoleId)
      if (!role) {
        return res.status(400).json({ message: "Invalid role ID!" })
      }
    }

    // Prepare update data
    const updateData = {}
    if (username) updateData.username = username
    if (email) updateData.email = email
    if (date_of_birth) updateData.date_of_birth = date_of_birth
    if (profile_image) updateData.profile_image = profile_image
    if (phone) updateData.phone = phone
    if (RoleId) updateData.RoleId = RoleId

    // Hash password if provided
    if (password) {
      updateData.password = bcrypt.hashSync(password, 8)
    }

    await user.update(updateData)

    // Fetch updated user with role
    const updatedUser = await User.findByPk(id, {
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
        "createdAt",
        "updatedAt",
      ],
    })

    const formattedUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      date_of_birth: updatedUser.date_of_birth,
      profile_image: updatedUser.profile_image,
      phone: updatedUser.phone,
      role: updatedUser.Role
        ? {
            id: updatedUser.Role.id,
            name: updatedUser.Role.name,
            description: updatedUser.Role.description,
          }
        : null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }

    res.status(200).json({
      message: "User updated successfully!",
      user: formattedUser,
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Delete user by specific ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const requesterId = req.userId

    if (Number.parseInt(id) === requesterId) {
      return res.status(400).json({
        message: "Use delete-account endpoint to delete your own account!",
      })
    }

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }

    await user.destroy()

    res.status(200).json({
      message: "User deleted successfully!",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: error.message })
  }
}

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
  createUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUser,
  deleteUser,
  deleteAccount,
}
