const db = require("../models/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JsBarcode = require('jsbarcode');
const path = require("path");
const QRCode = require('qrcode');
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
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'Role', attributes: ['id', 'name', 'description'], required: false }],
      attributes: ['id', 'username', 'email', 'date_of_birth', 'profile_image', 'phone', 'RoleId', 'barcode', 'barcode_image', 'qr_code_image', 'createdAt', 'updatedAt', 'status'],
      order: [['createdAt', 'ASC']],
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth,
      profile_image: getProfileImageUrl(req, user.profile_image),
      phone: user.phone,
      barcode: user.barcode,
      barcode_image: user.barcode_image,
      qr_code_image: user.qr_code_image,
      role: user.Role
        ? {
            id: user.Role.id,
            name: user.Role.name,
          }
        : null,
      status: user.status,
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

const createUser = async (req, res) => {
  try {
    const { username, email, password, date_of_birth, phone, roleId } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    // Check required fields
    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Username, email, password, and role are required' });
    }

    // Only admin or librarian can create users
    if (!['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admins or librarians can create users' });
    }

    // Check email uniqueness
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Check Role
    const targetRole = await Role.findByPk(roleId);
    if (!targetRole) return res.status(400).json({ message: 'Invalid roleId' });

    if (targetRole.name === 'admin') {
      return res.status(403).json({ message: 'Cannot assign admin role' });
    }

    if (req.user.role === 'librarian' && targetRole.name !== 'user') {
      return res.status(403).json({ message: 'Librarians can only assign "user" role' });
    }

    // Generate unique barcode
    let barcode, isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const exist = await User.findOne({ where: { barcode } });
      if (!exist) isUnique = true;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      phone,
      profile_image,
      roleId: roleId,
      barcode,
      barcode_image: null,
      qr_code_image: null,
    });

    // Generate and save barcode image
    const barcodeDir = path.join(process.cwd(), 'Uploads', 'barcodes');
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    const barcodeCanvas = createCanvas(400, 150);
    const ctx = barcodeCanvas.getContext('2d');
    JsBarcode(barcodeCanvas, barcode, { format: 'CODE128', displayValue: true, fontSize: 18, margin: 20 });
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(username, barcodeCanvas.width / 2, 140);

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodePath = path.join(barcodeDir, barcodeFilename);
    const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

    const barcodeOut = fs.createWriteStream(barcodePath);
    barcodeCanvas.createPNGStream().pipe(barcodeOut);
    await new Promise(resolve => barcodeOut.on('finish', resolve));

    // Generate and save QR code image
    const qrDir = path.join(process.cwd(), 'Uploads', 'qrcodes');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    const qrFilename = `qrcode_${user.id}.png`;
    const qrPath = path.join(qrDir, qrFilename);
    const qrImageUrl = `${req.protocol}://${req.get('host')}/uploads/qrcodes/${qrFilename}`;

    await QRCode.toFile(qrPath, barcode, { // Changed from user.id.toString() to barcode
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Update user with barcode and QR code image URLs
    user.barcode_image = barcodeImageUrl;
    user.qr_code_image = qrImageUrl;
    await user.save();

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
        qr_code_image: qrImageUrl,
        role: targetRole.name,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error during user creation', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log('Incoming PUT /user/:id request');
    const userId = req.params.id;
    const isSelfUpdate = req.user.id.toString() === userId.toString();

    const { username, email, password, date_of_birth, phone, roleId, barcode } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    const user = await User.findByPk(userId, {
      include: { model: Role, as: 'Role', attributes: ['id', 'name', 'description'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    if (req.userRole !== 'admin' && !isSelfUpdate) {
      return res.status(403).json({ message: 'You can only update your own account!' });
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
      if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Only admins can change roles!' });
      }
      const targetRole = await Role.findByPk(roleId);
      if (!targetRole) {
        return res.status(400).json({ message: 'Invalid roleId!' });
      }

      if (targetRole.name === 'admin' && user.id !== req.user.id) {
        return res.status(403).json({ message: 'Only the original admin can assign admin role to themselves!' });
      }

      if (req.userRole === 'librarian' && targetRole.name !== 'user') {
        return res.status(403).json({ message: 'Librarians can only assign the "user" role!' });
      }

      updates.roleId = roleId;
    }

    // Profile image
    if (profile_image) {
      if (user.profile_image) {
        const oldPath = path.join(process.cwd(), 'Uploads', 'profile', user.profile_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.profile_image = profile_image;
    }

    // Regenerate barcode and QR code if barcode changes
    if (barcode?.trim()) {
      // Delete old barcode image
      if (user.barcode_image) {
        const oldBarcodePath = path.join(process.cwd(), 'Uploads', 'barcodes', path.basename(user.barcode_image));
        if (fs.existsSync(oldBarcodePath)) {
          fs.unlinkSync(oldBarcodePath);
        }
      }

      // Generate new barcode image
      const barcodeDir = path.join(process.cwd(), 'Uploads', 'barcodes');
      if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

      const barcodeCanvas = createCanvas(400, 150);
      const ctx = barcodeCanvas.getContext('2d');
      JsBarcode(barcodeCanvas, barcode, { format: 'CODE128', displayValue: true, fontSize: 18, margin: 20 });
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(username || user.username, barcodeCanvas.width / 2, 140);

      const barcodeFilename = `barcode_${user.id}.png`;
      const barcodePath = path.join(barcodeDir, barcodeFilename);
      const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

      const barcodeOut = fs.createWriteStream(barcodePath);
      barcodeCanvas.createPNGStream().pipe(barcodeOut);
      await new Promise(resolve => barcodeOut.on('finish', resolve));

      updates.barcode_image = barcodeImageUrl;

      // Delete old QR code image
      if (user.qr_code_image) {
        const oldQrPath = path.join(process.cwd(), 'Uploads', 'qrcodes', path.basename(user.qr_code_image));
        if (fs.existsSync(oldQrPath)) {
          fs.unlinkSync(oldQrPath);
        }
      }

      // Generate new QR code image
      const qrDir = path.join(process.cwd(), 'Uploads', 'qrcodes');
      if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

      const qrFilename = `qrcode_${user.id}.png`;
      const qrPath = path.join(qrDir, qrFilename);
      const qrImageUrl = `${req.protocol}://${req.get('host')}/uploads/qrcodes/${qrFilename}`;

      await QRCode.toFile(qrPath, barcode, {
        type: 'png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      updates.qr_code_image = qrImageUrl;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    await user.update(updates);
    await user.reload();

    res.status(200).json({
      message: 'User updated successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_of_birth: user.date_of_birth,
        profile_image: getProfileImageUrl(req, user.profile_image),
        phone: user.phone,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        qr_code_image: user.qr_code_image,
        role: user.Role
          ? { id: user.Role.id, name: user.Role.name, description: user.Role.description }
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    console.log('➡️ DELETE called with ID:', req.params.id);

    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('❌ User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check for foreign key relation if user is a librarian
    if (user.Role?.name === 'librarian') {
      const borrowCount = await Borrow.count({ where: { librarian_id: userId } });
      console.log('📌 Borrow records linked to this librarian:', borrowCount);

      if (borrowCount > 0) {
        return res.status(400).json({
          message: '❗ Cannot delete this librarian. They are linked to borrow records.',
        });
      }
    }

    // Delete barcode image if exists
    if (user.barcode_image) {
      const barcodeFilename = path.basename(user.barcode_image);
      const barcodePath = path.join(process.cwd(), 'Uploads', 'barcodes', barcodeFilename);
      if (fs.existsSync(barcodePath)) {
        fs.unlinkSync(barcodePath);
        console.log('🗑 Barcode image deleted:', barcodePath);
      }
    }

    // Delete QR code image if exists
    if (user.qr_code_image) {
      const qrFilename = path.basename(user.qr_code_image);
      const qrPath = path.join(process.cwd(), 'Uploads', 'qrcodes', qrFilename);
      if (fs.existsSync(qrPath)) {
        fs.unlinkSync(qrPath);
        console.log('🗑 QR code image deleted:', qrPath);
      }
    }

    // Delete profile image if exists
    if (user.profile_image) {
      const profilePath = path.join(process.cwd(), 'Uploads', 'profiles', user.profile_image);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
        console.log('🗑 Profile image deleted:', profilePath);
      }
    }

    // Safe to delete
    await user.destroy();
    console.log('✅ User deleted successfully with ID:', userId);

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('❌ Delete user error:', error);
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

async function generateQRCodesForExistingUsers() {
  try {
    const users = await User.findAll();
    const qrDir = path.join(process.cwd(), 'Uploads', 'qrcodes');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    for (const user of users) {
      if (!user.qr_code_image && user.barcode) {
        const qrFilename = `qrcode_${user.barcode}.png`;
        const qrPath = path.join(qrDir, qrFilename);
        const qrImageUrl = `${process.env.BASE_URL}/uploads/qrcodes/${qrFilename}`; // Set BASE_URL in your .env file

        await QRCode.toFile(qrPath, user.barcode, {
          type: 'png',
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });

        await user.update({ qr_code_image: qrImageUrl });
        console.log(`QR code generated for user ${user.id}`);
      }
    }
    console.log('QR code generation complete.');
  } catch (error) {
    console.error('Error generating QR codes:', error);
  }
}
const getProfileImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/profile/${filename}`;
};
const generateUserQRCode = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.barcode) {
      return res.status(400).json({ message: 'User does not have a barcode' });
    }

    const qrData = user.barcode; // always encode barcode

    // Generate QR code
    const qrFileName = `qr_${user.id}.png`;
    const qrFolder = path.join(__dirname, '..', 'public', 'qrcodes');
    if (!fs.existsSync(qrFolder)) fs.mkdirSync(qrFolder, { recursive: true });
    const qrFilePath = path.join(qrFolder, qrFileName);

    await QRCode.toFile(qrFilePath, qrData, { width: 300, margin: 2 });

    // Save path in DB
    user.qr_code_image = `/qrcodes/${qrFileName}`;
    await user.save();

    res.json({ message: 'QR code generated', qrCodeUrl: user.qr_code_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating QR code' });
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
  generateUserQRCode,
  getUserBarcode,
  getAllUsers,
  getUserById,
  createUser,
  getUserProfile,
  getRoles,
  updateUser,
  deleteUserById,
  deleteAccount,
  uploadProfileImage,
  generateQRCodesForExistingUsers
}