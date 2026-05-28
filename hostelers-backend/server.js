const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const { sendOrderNotification } = require("./whatsappService");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.use(cors({ origin: "*" }));
app.use(express.json());

// Make io accessible in routes
app.set("io", io);

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SiTQSfwJUiF3S7",
  key_secret: process.env.RAZORPAY_SECRET || "MjdN1izor2iTWdsFPCTDKm3i",
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "venkateswararao123",
  database: process.env.DB_NAME || "hostelersdb"
});

db.connect(err => {
  if (err) console.log(err);
  else {
    console.log("MySQL Connected");
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        otp VARCHAR(10),
        otp_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(50) PRIMARY KEY,
        user_id INT,
        customer_name VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        item_name TEXT,
        quantity INT,
        total_amount DECIMAL(10, 2),
        status VARCHAR(50),
        order_time DATETIME
      )
    `;
    db.query(createUsersTable, (err) => {
      if(err) console.error("Error creating users table", err);
    });
    db.query(createOrdersTable, (err) => {
      if(err) console.error("Error creating orders table", err);
    });
  }
});



app.post("/orders", async (req, res) => {
  const { order_id, user_id, customer_name, phone, address, item_name, quantity, total_amount, status, items } = req.body;

  const now = new Date();
  const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');

  // 1. Save Order to Database
  const sql = "INSERT INTO orders (order_id, user_id, customer_name, phone, address, item_name, quantity, total_amount, status, order_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [order_id, user_id, customer_name, phone, address, item_name, quantity, total_amount, status, formattedTime], async (err, result) => {
    if (err) {
      console.error("Database error saving order:", err);
      return res.status(500).json({ error: "Failed to save order" });
    }

    // 2. Prepare order data for notifications
    const orderData = {
      id: order_id,
      customerName: customer_name,
      phone,
      address,
      items: items || [{ name: item_name, quantity }],
      total: total_amount,
      status
    };

    // 3. Send WhatsApp Message
    try {
      await sendOrderNotification(orderData);
    } catch (wsErr) {
      console.error("WhatsApp notification failed:", wsErr);
    }

    // 4. Emit real-time notification via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("new-order", orderData);
      console.log("Real-time notification emitted for order:", order_id);
    }

    res.json({ success: true, message: "Order placed and notification sent" });
  });
});

app.post("/api/notify-order", async (req, res) => {
  try {
    const order = req.body;
    console.log("Received order notification request:", order.id);

    // Send WhatsApp notification and await response
    const result = await sendOrderNotification(order);

    if (result && result.success) {
      res.json({ success: true, message: "Notification sent", sid: result.sid });
    } else {
      res.status(500).json({ success: false, message: result?.error || "Failed to send notification" });
    }
  } catch (error) {
    console.error("Error in notify-order endpoint:", error.message || error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.put("/update-status/:id", (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE orders SET status = ? WHERE order_id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Status updated");
    }
  );
});




// 🔥 AUTO DELETE (THIS MUST BE HERE)
setInterval(() => {
  console.log("Running delete...");

  const sql = `
    DELETE FROM orders 
    WHERE order_time < NOW() - INTERVAL 1 DAY
  `;

  db.query(sql, (err, result) => {
    if (err) console.log(err);
    else console.log("Deleted:", result.affectedRows);
  });

}, 24 * 60 * 60 * 1000);




app.post("/create-order", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const { amount } = req.body;
    const options = {
      amount: amount || 10000, // paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Order creation failed");
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET || "MjdN1izor2iTWdsFPCTDKm3i";

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

// Authentication Endpoints

app.post('/signup', async (req, res) => {
  const { email, password, phone } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (email, password, phone) VALUES (?, ?, ?)", [email, hashedPassword, phone || null], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Email already exists" });
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "User created successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, phone: user.phone } });
  });
});

app.post('/forgot-password', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "No user found with this phone number" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60000); // 5 mins expiry

    const formattedExpiry = expiry.getFullYear() + "-" +
      String(expiry.getMonth() + 1).padStart(2, "0") + "-" +
      String(expiry.getDate()).padStart(2, "0") + " " +
      String(expiry.getHours()).padStart(2, "0") + ":" +
      String(expiry.getMinutes()).padStart(2, "0") + ":" +
      String(expiry.getSeconds()).padStart(2, "0");

    db.query("UPDATE users SET otp = ?, otp_expiry = ? WHERE phone = ?", [otp, formattedExpiry, phone], async (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "Failed to update OTP" });

      try {
        // Simple SMS mock or actual Fast2SMS call
        if (process.env.FAST2SMS_API_KEY) {
          await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: { authorization: process.env.FAST2SMS_API_KEY, variables_values: otp, route: 'otp', numbers: phone }
          });
        } else {
          console.log(`[SMS MOCK] Sent OTP ${otp} to ${phone}`);
        }
        res.json({ message: "OTP sent successfully" });
      } catch (smsErr) {
        console.error("SMS Sending Error:", smsErr.response ? smsErr.response.data : smsErr);
        res.status(500).json({ error: "Failed to send SMS" });
      }
    });
  });
});

app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  db.query("SELECT * FROM users WHERE phone = ? AND otp = ?", [phone, otp], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "Invalid OTP or Phone Number" });

    const user = results[0];
    const now = new Date();
    const expiryDate = new Date(user.otp_expiry);

    if (now > expiryDate) return res.status(400).json({ error: "OTP expired" });

    res.json({ message: "OTP verified successfully" });
  });
});

app.post('/reset-password', async (req, res) => {
  const { phone, newPassword } = req.body;
  if (!phone || !newPassword) return res.status(400).json({ error: "Missing fields" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE phone = ?", [hashedPassword, phone], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Password updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/admin-login", (req, res) => {

  const { password } = req.body;

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "9848652242"; // mee number pettu

  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid password"
  });

});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});