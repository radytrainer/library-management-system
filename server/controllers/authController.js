const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const db = require('../models/index');
const authConfig = require('../config/auth.config');

// Store active user IDs and their last activity timestamp
const activeUsers = new Map();

// Initialize Socket.IO
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        socket.disconnect();
        return;
      }

      const userId = decoded.id;
      activeUsers.set(userId, Date.now());
      broadcastActiveUsers();

      socket.on('user-interaction', async () => {
        activeUsers.set(userId, Date.now());
        try {
          const user = await db.User.findByPk(userId);
          if (user) {
            await user.update({ lastActive: new Date() });
          }
        } catch (error) {
          console.error('Error updating lastActive:', error);
        }
        broadcastActiveUsers();
      });

      socket.on('disconnect', () => {
        activeUsers.delete(userId);
        broadcastActiveUsers();
      });
    });
  });
};

// Broadcast active user count and list
const broadcastActiveUsers = () => {
  if (!io) return;
  const now = Date.now();
  const activeThreshold = 5 * 60 * 1000;
  for (const [userId, lastActive] of activeUsers) {
    if (now - lastActive > activeThreshold) activeUsers.delete(userId);
  }
  io.emit('active-users', {
    count: activeUsers.size,
    userIds: Array.from(activeUsers.keys()),
  });
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

    const inactiveThreshold = 30 * 24 * 60 * 60 * 1000;
    const currentTime = new Date();
    if (user.lastActive && (currentTime - new Date(user.lastActive) > inactiveThreshold)) {
      await user.update({ isActive: false });
      return res.status(403).json({ message: "Account is inactive. Please contact support to reactivate." });
    }

    await user.update({ lastActive: currentTime, isActive: true });

    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.Role?.name || "user",
        isActive: user.isActive,
        barcode: user.barcode,
        barcode_image: user.barcode_image
          ? `${req.protocol}://${req.get('host')}${user.barcode_image}`
          : null,
        qr_code_image: user.qr_code_image
          ? `${req.protocol}://${req.get('host')}${user.qr_code_image}`
          : null,
        profile_image: user.profile_image
          ? `${req.protocol}://${req.get('host')}/uploads/profile/${user.profile_image}`
          : null,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, phone, date_of_birth } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const { User, Role } = db;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 Generate unique numeric barcode (12 digits)
    let barcode, isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12 digits
      const exist = await User.findOne({ where: { barcode } });
      if (!exist) isUnique = true;
    }

    // Step 1: Create user (without images yet)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      date_of_birth,
      isActive: true,
      lastActive: new Date(),
      barcode
    });

    // ---------- Generate Barcode Image ----------
    const barcodeDir = path.join(process.cwd(), 'Uploads', 'barcodes');
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    const barcodeCanvas = createCanvas(400, 150);
    JsBarcode(barcodeCanvas, barcode, {
      format: "CODE128",   // Works for any numbers
      displayValue: true,  // Show number under barcode
      fontSize: 20,
      margin: 10,
      lineColor: "#000000",
      background: "#ffffff"
    });

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodePath = path.join(barcodeDir, barcodeFilename);
    const barcodeImageUrl = `/Uploads/barcodes/${barcodeFilename}`;

    const barcodeOut = fs.createWriteStream(barcodePath);
    barcodeCanvas.createPNGStream().pipe(barcodeOut);
    await new Promise((resolve, reject) => {
      barcodeOut.on('finish', resolve);
      barcodeOut.on('error', reject);
    });

    // ---------- Generate QR Code ----------
    const qrDir = path.join(process.cwd(), 'Uploads', 'qrcodes');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    const qrFilename = `qrcode_${user.id}.png`;
    const qrPath = path.join(qrDir, qrFilename);
    const qrImageUrl = `/Uploads/qrcodes/${qrFilename}`;
    const userDetailsUrl = `${req.protocol}://${req.get('host')}/user/${user.id}`;

    await QRCode.toFile(qrPath, userDetailsUrl, {
      type: 'png',
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Step 2: Update user with image paths
    await user.update({
      barcode_image: barcodeImageUrl,
      qr_code_image: qrImageUrl,
    });

    // Assign default role
    const defaultRole = await Role.findOne({ where: { name: "user" } });
    if (defaultRole) {
      await user.setRole(defaultRole);
    }

    // Track active users
    activeUsers.set(user.id, Date.now());
    broadcastActiveUsers();

    // Generate JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        role: defaultRole?.name || "user",
        isActive: user.isActive,
        barcode: user.barcode,
        barcode_image: `${req.protocol}://${req.get('host')}${barcodeImageUrl}`,
        qr_code_image: `${req.protocol}://${req.get('host')}${qrImageUrl}`,
        accessToken: token,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};



const getActiveUsers = async (req, res) => {
  try {
    const now = Date.now();
    const activeThreshold = 5 * 60 * 1000;
    for (const [userId, lastActive] of activeUsers) {
      if (now - lastActive > activeThreshold) {
        activeUsers.delete(userId);
      }
    }
    res.status(200).json({ count: activeUsers.size, userIds: Array.from(activeUsers.keys()) });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signin, signup, initSocket, getActiveUsers };