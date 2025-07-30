const db = require("../models/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JsBarcode = require('jsbarcode');
const path = require("path");
const fs = require("fs");
const ExcelJS = require('exceljs');
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

    // ✅ Create canvas with size
    const canvas = createCanvas(300, 100); // width x height

    // ✅ Generate barcode
    JsBarcode(canvas, user.id.toString(), {
      format: 'CODE128',
      displayValue: true,
      fontSize: 18,
      margin: 10,
    });

    // ✅ Return as PNG
    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating barcode' });
  }
};

//create user by admin or librarian
const createUser = async (req, res) => {
  try {
    // ✅ Only Admin or Librarian can create users
    if (!req.userRole || !["admin", "librarian"].includes(req.userRole)) {
      return res.status(403).json({ message: "Only admins or librarians can create users!" });
    }

    const { username, email, password, date_of_birth, phone, roleId } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 8);

    // ✅ Role assignment & validation
    let assignedRoleId = roleId;
    const targetRole = await Role.findByPk(assignedRoleId);

    if (!targetRole) {
      return res.status(400).json({ message: "Invalid roleId!" });
    }

    // ✅ Librarian restrictions
    if (req.userRole === "librarian") {
      if (targetRole.name !== "user") {
        return res.status(403).json({ message: "Librarians can only create normal users!" });
      }
    }

    // ✅ Admin restriction
    if (targetRole.name === "admin" && req.userRole !== "admin") {
      return res.status(403).json({ message: "Only admins can create other admins!" });
    }

    // ✅ Generate unique barcode number
    let barcode;
    let isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const existingUser = await User.findOne({ where: { barcode } });
      if (!existingUser) isUnique = true;
    }

    // ✅ Create user without barcode_image first
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      phone,
      profile_image,
      roleId: assignedRoleId,
      barcode_image: null, // Will be set after barcode image generati
      barcode, // numeric code
    });

    // ✅ Generate barcode image
    const canvas = createCanvas(400, 150);
    const ctx = canvas.getContext('2d');

    JsBarcode(canvas, barcode, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 18,
      margin: 20,
    });

    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(username, canvas.width / 2, 140);

    // ✅ Save barcode PNG
    const barcodeDir = path.join(process.cwd(), 'uploads', 'barcodes');
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

    const out = fs.createWriteStream(path.join(barcodeDir, barcodeFilename));
    canvas.createPNGStream().pipe(out);
    await new Promise((resolve) => out.on('finish', resolve));

    // ✅ Save barcode image path to DB
    user.barcode_image = barcodeImageUrl;
    await user.save();

    // ✅ Create JWT token
    const roleName = targetRole.name;
    const token = jwt.sign(
      { id: user.id, role: roleName },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        phone: user.phone,
        profile_image: user.profile_image,
        barcode: user.barcode, // numeric code
        barcode_image: user.barcode_image, // image URL
        roleId: assignedRoleId.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
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
        "barcode_image",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth,
      profile_image: user.profile_image,
      phone: user.phone,
      barcode: user.barcode, // Include barcode
      barcode_image: user.barcode_image, // Include barcode image URL
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
      barcode_image: user.barcode_image, // Include barcode image URL
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
        barcode_image: user.barcode_image, // Include barcode image URL
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
    const userId = req.params.id;
    const { username, email, password, date_of_birth, phone, roleId, barcode } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // ✅ Role update rules
    if (roleId) {
      const targetRole = await Role.findByPk(roleId);
      if (!targetRole) return res.status(400).json({ message: "Invalid roleId!" });

      // Librarians cannot update to Admin or Librarian
      if (req.userRole === "librarian" && targetRole.name !== "user") {
        return res.status(403).json({ message: "Librarians can only set user role!" });
      }

      // Only Admin can assign Admin role
      if (targetRole.name === "admin" && req.userRole !== "admin") {
        return res.status(403).json({ message: "Only admins can assign admin role!" });
      }

      user.roleId = roleId;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (profile_image) user.profile_image = profile_image;

    if (password) {
      user.password = await bcrypt.hash(password, 8);
    }

    let regenerateBarcode = false;

    // ✅ If barcode is updated, regenerate image
    if (barcode && barcode !== user.barcode) {
      user.barcode = barcode;
      regenerateBarcode = true;
    }

    await user.save();

    // ✅ Regenerate barcode image if needed
    if (regenerateBarcode) {
      const canvas = createCanvas(400, 150);
      const ctx = canvas.getContext('2d');

      JsBarcode(canvas, user.barcode, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 18,
        margin: 20,
      });

      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(user.username, canvas.width / 2, 140);

      const barcodeDir = path.join(process.cwd(), 'uploads', 'barcodes');
      if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

      const barcodeFilename = `barcode_${user.id}.png`;
      const barcodePath = path.join(barcodeDir, barcodeFilename);
      const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

      const out = fs.createWriteStream(barcodePath);
      canvas.createPNGStream().pipe(out);
      await new Promise((resolve) => out.on('finish', resolve));

      user.barcode_image = barcodeImageUrl;
      await user.save();
    }

    res.status(200).json({
      message: "User updated successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        profile_image: user.profile_image,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        roleId: user.roleId,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user by specific ID
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // ✅ Delete barcode image file if exists
    if (user.barcode_image) {
      const filename = path.basename(user.barcode_image); // get file name from URL
      const filePath = path.join(process.cwd(), 'uploads', 'barcodes', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted barcode image: ${filePath}`);
      }
    }

    // ✅ Delete profile image file if exists
    if (user.profile_image) {
      const profilePath = path.join(process.cwd(), 'uploads', 'profiles', user.profile_image);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
        console.log(`Deleted profile image: ${profilePath}`);
      }
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully!" });
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
const exportUsersWithImages = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'profile_image', 'barcode', 'barcode_image']
    });

    if (!users.length) return res.status(404).json({ message: 'No users found' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users & Barcodes');

    // ✅ Define column widths (images will go in columns)
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

      // ✅ Add profile image if exists
      if (user.profile_image) {
        const profilePath = path.join(process.cwd(), 'uploads', user.profile_image);
        if (fs.existsSync(profilePath)) {
          const profileImg = workbook.addImage({
            filename: profilePath,
            extension: 'png' // or jpg depending on your files
          });
          sheet.addImage(profileImg, {
            tl: { col: 3, row: rowIndex - 1 }, // Column D (index 3)
            ext: { width: 60, height: 60 }
          });
        }
      }

      // ✅ Add barcode image if exists
      if (user.barcode_image) {
        const barcodePath = path.join(process.cwd(), 'uploads', 'barcodes', `barcode_${user.id}.png`);
        if (fs.existsSync(barcodePath)) {
          const barcodeImg = workbook.addImage({
            filename: barcodePath,
            extension: 'png'
          });
          sheet.addImage(barcodeImg, {
            tl: { col: 5, row: rowIndex - 1 }, // Column F (index 5)
            ext: { width: 150, height: 60 }
          });
        }
      }
    }

    // ✅ Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users_with_barcodes.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export Excel error:', err);
    res.status(500).json({ message: 'Error exporting Excel file' });
  }
};
module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  librarianBoard,
  exportUsersWithImages,
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