const db = require("../models/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JsBarcode = require('jsbarcode');
const path = require("path");
const fs = require("fs");
const ExcelJS = require('exceljs');
const { createCanvas } = require('canvas');
const { v4: uuidv4 } = require("uuid")
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: "Role", attributes: ["id", "name", "description"], required: false }],
      attributes: ["id", "username", "email", "date_of_birth", "profile_image", "phone", "RoleId", "barcode", "barcode_image", "createdAt", "updatedAt", "status"],
      order: [["createdAt", "ASC"]],
    });

    // Map users to include the full profile image URL and role details
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth,
      profile_image: getProfileImageUrl(req, user.profile_image), // Assuming this function generates the full URL
      phone: user.phone,
      barcode: user.barcode,
      barcode_image: user.barcode_image,
      role: user.Role
        ? {
            id: user.Role.id,
            name: user.Role.name,
       
          }
        : null,
      status: user.status, // Include status in the response
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Role, as: "Role", attributes: ["id", "name", "description"], required: false }],
      attributes: ["id", "username", "email", "date_of_birth", "profile_image", "phone", "RoleId", "barcode", "barcode_image", "createdAt", "updatedAt", "status"],
    });

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json({
      message: "User retrieved successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: getProfileImageUrl(req, user.profile_image),
        phone: user.phone,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        role: user.Role.name||null,
        status: user.status, // Include status in the response
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = (req, res) => {
  try {
    const user = req.user; // already fetched and includes Role

    res.status(200).json({
      message: "Profile retrieved successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: getProfileImageUrl(req, user.profile_image),
        phone: user.phone,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        role: {
          id: user.Role.id,
          name: user.Role.name,
          description: user.Role.description,
        },
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
    console.log("Incoming PUT /user/:id request");
    const userId = req.params.id;
    const isSelfUpdate = req.user.id.toString() === userId.toString();

    const { username, email, password, date_of_birth, phone, roleId, barcode } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    const user = await User.findByPk(userId, {
      include: { model: Role, as: 'Role', attributes: ["id", "name", "description"] }
    });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (req.userRole !== 'admin' && !isSelfUpdate) {
      return res.status(403).json({ message: "You can only update your own account!" });
    }

    const updates = {};

    // Basic fields
    if (username?.trim()) updates.username = username.trim();
    if (email?.trim()) updates.email = email.trim();
    if (date_of_birth) updates.date_of_birth = date_of_birth;
    if (phone?.trim()) updates.phone = phone.trim();
    if (barcode?.trim()) updates.barcode = barcode.trim();

    // Password
    if (password?.trim()) {
      updates.password = await bcrypt.hash(password, 8);
    }

    // Role change with restrictions
    if (roleId) {
      // Only admins can change roles
      if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Only admins can change roles!" });
      }
      const targetRole = await Role.findByPk(roleId);
      if (!targetRole) {
        return res.status(400).json({ message: "Invalid roleId!" });
      }

      // Prevent assigning admin role to others
      if (targetRole.name === 'admin' && user.id !== req.user.id) {
        return res.status(403).json({ message: "Only the original admin can assign admin role to themselves!" });
      }

      // Restrict role updates based on current role
      if (req.userRole === 'librarian' && targetRole.name !== 'user') {
        return res.status(403).json({ message: "Librarians can only assign the 'user' role!" });
      }

      updates.roleId = roleId;
    }

    // Profile image
    if (profile_image) {
      if (user.profile_image) {
        const oldPath = path.join(process.cwd(), "uploads", "profile", user.profile_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.profile_image = profile_image;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await user.update(updates);
    await user.reload();

    res.status(200).json({
      message: "User updated successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: getProfileImageUrl(req, user.profile_image),
        phone: user.phone,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        role: user.Role
          ? { id: user.Role.id, name: user.Role.name, description: user.Role.description }
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    console.log("➡️ DELETE called with ID:", req.params.id);

    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found!" });
    }

    // ❗ Check for foreign key relation if user is a librarian
    if (user.role === 'librarian') {
      const borrowCount = await Borrow.count({ where: { librarian_id: userId } });
      console.log("📌 Borrow records linked to this librarian:", borrowCount);

      if (borrowCount > 0) {
        return res.status(400).json({
          message: "❗ Cannot delete this librarian. They are linked to borrow records."
        });
      }
    }

    // 🗑 Delete barcode image if exists
    if (user.barcode_image) {
      const filename = path.basename(user.barcode_image);
      const filePath = path.join(process.cwd(), 'uploads', 'barcodes', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑 Barcode image deleted:", filePath);
      }
    }

    // 🗑 Delete profile image if exists
    if (user.profile_image) {
      const profilePath = path.join(process.cwd(), 'uploads', 'profiles', user.profile_image);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
        console.log("🗑 Profile image deleted:", profilePath);
      }
    }

    // ✅ Safe to delete
    await user.destroy();
    console.log("✅ User deleted successfully with ID:", userId);

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};

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
const exportUsersWithImages = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'profile_image', 'barcode', 'barcode_image']
    });

    if (!users.length) return res.status(404).json({ message: 'No users found' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users & Barcodes');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Username', key: 'username', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Profile Image', key: 'profile_image', width: 20 },
      { header: 'Barcode Value', key: 'barcode', width: 25 },
      { header: 'Barcode Image', key: 'barcode_image', width: 20 }
    ];

    for (const user of users) {
      const row = sheet.addRow({
        id: user.id,
        username: user.username,
        email: user.email,
        barcode: user.barcode
      });

      const rowIndex = row.number;

      if (user.profile_image) {
        const profilePath = path.join(process.cwd(), 'uploads', user.profile_image);
        if (fs.existsSync(profilePath)) {
          const profileImg = workbook.addImage({
            filename: profilePath,
            extension: 'png'
          });
          sheet.addImage(profileImg, {
            tl: { col: 3, row: rowIndex - 1 },
            ext: { width: 60, height: 60 }
          });
        }
      }

      if (user.barcode_image) {
        const barcodePath = path.join(process.cwd(), 'uploads', 'barcodes', `barcode_${user.id}.png`);
        if (fs.existsSync(barcodePath)) {
          const barcodeImg = workbook.addImage({
            filename: barcodePath,
            extension: 'png'
          });
          sheet.addImage(barcodeImg, {
            tl: { col: 5, row: rowIndex - 1 },
            ext: { width: 150, height: 60 }
          });
        }
      }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users_with_barcodes.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export Excel error:', err);
    res.status(500).json({ message: 'Error exporting Excel file' });
  }
};
const getProfileImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/profile/${filename}`;
};

const createUser = async (req, res) => {
  try {
    console.log('Incoming body:', req.body);
    console.log('File info:', req.file);

    // 1. Only 'admin' or 'librarian' can create users
    if (!['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admins or librarians can create users' });
    }

    const { username, email, password, date_of_birth, phone, RoleId } = req.body; // Changed to RoleId
    const profile_image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 8);

    const targetRole = await Role.findByPk(RoleId); // Use RoleId here
    if (!targetRole) return res.status(400).json({ message: 'Invalid roleId' });

    // 🚫 No one can create users with admin role
    if (targetRole.name === 'admin') {
      return res.status(403).json({ message: 'Creating users with admin role is not allowed' });
    }

    // 🚫 Librarians can only assign "user" role
    if (req.user.role === 'librarian' && targetRole.name !== 'user') {
      return res.status(403).json({ message: 'Librarians can only create users with the "user" role' });
    }

    // ✅ Generate unique barcode
    let barcode, isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const existingUser = await User.findOne({ where: { barcode } });
      if (!existingUser) isUnique = true;
    }

    // ✅ Create user
    const user = await User.create({
      username, email, password: hashedPassword, date_of_birth, phone,
      profile_image, roleId: RoleId, barcode, barcode_image: null // Use RoleId here
    });

    // ✅ Generate barcode image
    const barcodeDir = path.join(process.cwd(), 'uploads', 'barcodes');
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    const canvas = createCanvas(400, 150);
    const ctx = canvas.getContext('2d');
    JsBarcode(canvas, barcode, { format: 'CODE128', displayValue: true, fontSize: 18, margin: 20 });
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(username, canvas.width / 2, 140);

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodePath = path.join(barcodeDir, barcodeFilename);
    const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

    const out = fs.createWriteStream(barcodePath);
    canvas.createPNGStream().pipe(out);
    await new Promise(resolve => out.on('finish', resolve));

    user.barcode_image = barcodeImageUrl;
    await user.save();

    // ✅ Return response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username,
        email,
        date_of_birth,
        phone,
        profile_image: profile_image
          ? `${req.protocol}://${req.get('host')}/uploads/profile/${profile_image}`
          : null,
        barcode,
        barcode_image: barcodeImageUrl,
        role: targetRole.name,
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error during user creation', error: error.message });
  }
};
const getUserBarcode = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const canvas = createCanvas(300, 100);

    JsBarcode(canvas, user.id.toString(), {
      format: 'CODE128',
      displayValue: true,
      fontSize: 18,
      margin: 10,
    });

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating barcode' });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile_image = req.file ? req.file.filename : null;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (profile_image) {
      // Delete old profile image if it exists
      if (user.profile_image) {
        const oldImagePath = path.join(process.cwd(), "uploads", "profile", user.profile_image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      user.profile_image = profile_image;
      await user.save();
    }

    res.status(200).json({
      message: "Profile image uploaded successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: getProfileImageUrl(req, user.profile_image),
        phone: user.phone,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        role: user.Role ? { id: user.Role.id, name: user.Role.name, description: user.Role.description } : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ message: "Failed to upload profile image", error: error.message });
  }
};
module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,
  exportUsersWithImages,
  getUserBarcode,
  getAllUsers,
  getUserById,
  createUser,
  getUserProfile,
  getRoles,
  updateUser,
  deleteUserById,
  deleteAccount,
  uploadProfileImage
}