const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const JsBarcode = require("jsbarcode");

const signup = async (req, res) => {
  try {
    const { username, email, password, date_of_birth, phone } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required!" });
    }

    const { User, Role } = db;

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    const dob = date_of_birth
      ? new Date(date_of_birth.split('.').reverse().join('-')).toISOString().split('T')[0]
      : null;

    if (dob && isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: "Invalid date of birth format. Use DD.MM.YYYY." });
    }

    if (dob && new Date(dob) > new Date()) {
      return res.status(400).json({ message: "Date of birth cannot be in the future." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Get default role (user)
    const role = await Role.findOne({ where: { name: "user" } });
    const roleId = role ? role.id : null;

    // ✅ Generate unique 12-digit barcode
    let barcode, isUnique = false;
    while (!isUnique) {
      barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const existing = await User.findOne({ where: { barcode } });
      if (!existing) isUnique = true;
    }

    // ✅ Create user in DB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      date_of_birth: dob,
      phone,
      profile_image,
      roleId,
      barcode,
      barcode_image: null
    });

    // ✅ Generate barcode image
    const barcodeDir = path.join(process.cwd(), 'uploads', 'barcodes');
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

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
    ctx.fillText(username, canvas.width / 2, 140);

    const barcodeFilename = `barcode_${user.id}.png`;
    const barcodePath = path.join(barcodeDir, barcodeFilename);
    const barcodeImageUrl = `${req.protocol}://${req.get('host')}/uploads/barcodes/${barcodeFilename}`;

    const out = fs.createWriteStream(barcodePath);
    canvas.createPNGStream().pipe(out);
    await new Promise((resolve) => out.on('finish', resolve));

    user.barcode_image = barcodeImageUrl;
    await user.save();

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        profile_image: profile_image ? `${req.protocol}://${req.get('host')}/uploads/profile/${profile_image}` : null,
        barcode: user.barcode,
        barcode_image: user.barcode_image,
        role: role?.name || "user",
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
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
