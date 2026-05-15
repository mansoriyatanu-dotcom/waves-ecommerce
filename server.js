require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
//app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
    return;
  }

  console.log("✅ MySQL Connected");
});

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

const sessions = {};

function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Not logged in" });
  }

  req.user = sessions[token];
  next();
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (Number(req.user.is_admin) !== 1) {
      return res.status(403).json({ error: "Admins only" });
    }

    next();
  });
}

// IMAGE UPLOAD
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  res.json({
    imageUrl: "/uploads/" + req.file.filename
  });
});

// HOME
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// AUTH
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const hashed = hashPassword(password);

  db.query(
    "INSERT INTO users (username, password, is_admin) VALUES (?, ?, 0)",
    [username, hashed],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Registration failed" });
      }

      const token = generateToken();

      sessions[token] = {
        id: result.insertId,
        username,
        is_admin: 0
      };

      res.json({
        token,
        username,
        is_admin: 0
      });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const hashed = hashPassword(password);

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, hashed],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(401).json({
          error: "Invalid username or password"
        });
      }

      const user = rows[0];
      const token = generateToken();

      sessions[token] = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin
      };

      res.json({
        token,
        username: user.username,
        is_admin: user.is_admin
      });
    }
  );
});

// PRODUCTS
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    res.json(rows);
  });
});

app.get("/api/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(rows[0]);
    }
  );
});

app.post("/api/products", requireAdmin, (req, res) => {
  const {
    id,
    name,
    description,
    details,
    price,
    stock,
    discount,
    category,
    img,
    image2,
    image3,
    amazon,
    flipkart,
    whatsapp
  } = req.body;

  db.query(
    `INSERT INTO products
    (id, name, description, details, price, stock, discount, category, img, image2, image3, amazon, flipkart, whatsapp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name,
      description,
      details,
      price,
      stock,
      discount,
      category,
      img,
      image2,
      image3,
      amazon,
      flipkart,
      whatsapp
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Product add failed" });
      }

      res.json({ message: "Product added successfully" });
    }
  );
});

app.put("/api/products/:id", requireAdmin, (req, res) => {
  const {
    name,
    description,
    details,
    price,
    stock,
    discount,
    category,
    img,
    image2,
    image3,
    amazon,
    flipkart,
    whatsapp
  } = req.body;

  db.query(
    `UPDATE products SET
      name = ?,
      description = ?,
      details = ?,
      price = ?,
      stock = ?,
      discount = ?,
      category = ?,
      img = ?,
      image2 = ?,
      image3 = ?,
      amazon = ?,
      flipkart = ?,
      whatsapp = ?
    WHERE id = ?`,
    [
      name,
      description,
      details,
      price,
      stock,
      discount,
      category,
      img,
      image2,
      image3,
      amazon,
      flipkart,
      whatsapp,
      req.params.id
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Product update failed" });
      }

      res.json({ message: "Product updated successfully" });
    }
  );
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const productId = req.params.id;

  db.query("DELETE FROM cart WHERE product_id = ?", [productId], (cartErr) => {
    if (cartErr) {
      console.log(cartErr);
      return res.status(500).json({ error: "Failed to remove product from cart" });
    }

    db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Product delete failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    });
  });
});

// CART
app.get("/api/cart", requireAuth, (req, res) => {
  db.query(
    `SELECT 
      c.id,
      c.quantity,
      p.id as product_id,
      p.name,
      p.price,
      p.img,
      p.discount
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch cart" });
      }

      res.json(rows);
    }
  );
});

app.post("/api/cart", requireAuth, (req, res) => {
  const { product_id, quantity } = req.body;
  const qty = Number(quantity) || 1;

  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [req.user.id, product_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Cart check failed" });
      }

      if (rows.length > 0) {
        db.query(
          "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
          [qty, req.user.id, product_id],
          (err2) => {
            if (err2) {
              return res.status(500).json({ error: "Cart update failed" });
            }

            res.json({ message: "Cart quantity increased" });
          }
        );
      } else {
        db.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [req.user.id, product_id, qty],
          (err2) => {
            if (err2) {
              console.log(err2);
              return res.status(500).json({ error: "Cart insert failed" });
            }

            res.json({ message: "Added to cart" });
          }
        );
      }
    }
  );
});

app.put("/api/cart/:id", requireAuth, (req, res) => {
  const qty = Number(req.body.quantity);

  if (qty <= 0) {
    db.query(
      "DELETE FROM cart WHERE product_id = ? AND user_id = ?",
      [req.params.id, req.user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Remove failed" });
        }

        res.json({ message: "Item removed" });
      }
    );

    return;
  }

  db.query(
    "UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?",
    [qty, req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }

      res.json({ message: "Quantity updated" });
    }
  );
});

app.delete("/api/cart", requireAuth, (req, res) => {
  db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Clear cart failed" });
    }

    res.json({ message: "Cart cleared" });
  });
});

// ORDERS
app.post("/api/orders", requireAuth, (req, res) => {
  const {
    customer_name,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    items,
    total
  } = req.body;

  db.query(
    `INSERT INTO orders
    (user_id, customer_name, phone, email, address, city, state, pincode, items, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      customer_name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      JSON.stringify(items),
      total
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Order failed" });
      }

      db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id], () => {
        res.json({ message: "Order placed successfully" });
      });
    }
  );
});

app.get("/api/admin/orders", requireAdmin, (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    res.json(rows);
  });
});

app.put("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Status update failed" });
      }

      res.json({ message: "Order status updated" });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});