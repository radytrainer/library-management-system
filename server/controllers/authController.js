const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
const fs = require('fs');
const path = require('path');
const db = require('../models');
const authConfig = require('../config/auth.config');

// Store active user IDs and their last activity timestamp
const activeUsers = new Map(); // Map<userId, lastActiveTimestamp>

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
  const now = Date.now();
  const activeThreshold = 5 * 60 * 1000; // 5 minutes
  for (const [userId, lastActive] of activeUsers) {
    if (now - lastActive > activeThreshold) {
      activeUsers.delete(userId);
    }
  }
  io.emit('active-users', {
    count: activeUsers.size,
    userIds: Array.from(activeUsers.keys())
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

    const inactiveThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days
    const currentTime = new Date();
    if (user.lastActive && (currentTime - new Date(user.lastActive) > inactiveThreshold)) {
      await user.update({ isActive: false });
      return res.status(403).json({ message: "Account is inactive. Please contact support to reactivate." });
    }

    await user.update({ lastActive: currentTime, isActive: true });
    activeUsers.set(user.id, Date.now());
    broadcastActiveUsers();

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
        barcode_image: user.barcode_image,
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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const { User, Role } = db;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate barcode
    const barcodeValue = `USER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const canvas = createCanvas();
    JsBarcode(canvas, barcodeValue, { format: 'CODE128', displayValue: true });
    const barcodeImagePath = path.join(__dirname, '..', 'public', 'barcodes', `${barcodeValue}.png`);
    const out = fs.createWriteStream(barcodeImagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    // Wait for the file to be written
    await new Promise((resolve) => out.on('finish', resolve));

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isActive: true,
      lastActive: new Date(),
      barcode: barcodeValue,
      barcode_image: `/barcodes/${barcodeValue}.png`
    });

    const defaultRole = await Role.findOne({ where: { name: "user" } });
    if (defaultRole) {
      await user.setRole(defaultRole);
    }

    activeUsers.set(user.id, Date.now());
    broadcastActiveUsers();

    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: defaultRole?.name || "user",
        isActive: user.isActive,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const now = Date.now();
    const activeThreshold = 5 * 60 * 1000; // 5 minutes
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