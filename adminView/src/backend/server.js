const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });
const filePath = path.join(__dirname, 'foods.json');
const ordersFilePath = path.join(__dirname, 'orders.json');
const usersFilePath = path.join(__dirname, 'users.json');

const readFoodsFile = () => {
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : [];
  }
  return [];
};

const readOrdersFile = () => {
  if (fs.existsSync(ordersFilePath)) {
    const raw = fs.readFileSync(ordersFilePath, 'utf8');
    return raw ? JSON.parse(raw) : [];
  }
  return [];
};

const readUsersFile = () => {
  if (fs.existsSync(usersFilePath)) {
    const raw = fs.readFileSync(usersFilePath, 'utf8');
    return raw ? JSON.parse(raw) : [];
  }
  return [];
};

const writeFoodsFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const writeOrdersFile = (data) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));
};

// 1. CREATE: Add Food attached to a specific Shop
app.post('/add-food', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, shopId } = req.body;
    const foods = readFoodsFile();

    const food = {
      id: Date.now().toString(),
      shopId: shopId || "General", // Fallback safety allocation
      name,
      description,
      price: parseFloat(price),
      category,
      image: req.file ? req.file.filename : null
    };

    foods.push(food);
    writeFoodsFile(foods);

    res.json({ success: true, food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUsersFile();

    // Find a user that matches both credentials perfectly
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Success! Return their unique shop identification string
      res.json({ success: true, shopId: user.shopId });
    } else {
      // Access Denied
      res.status(401).json({ success: false, message: "Invalid username or password." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. READ: Get Foods belonging ONLY to a specific shop
app.get('/list-food', (req, res) => {
  const { shopId } = req.query;
  let foods = readFoodsFile();

  if (shopId) {
    foods = foods.filter(item => item.shopId === shopId);
  }
  res.json({ success: true, data: foods });
});

// 3. READ: Get Orders belonging ONLY to a specific shop
app.get('/list-orders', (req, res) => {
  const { shopId } = req.query;
  let orders = readOrdersFile();

  if (shopId) {
    orders = orders.filter(item => item.shopId === shopId);
  }
  res.json({ success: true, data: orders });
});

// 4. UPDATE: Edit Food
app.put('/edit-food/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    let foods = readFoodsFile();

    const foodIndex = foods.findIndex(item => item.id === id);
    if (foodIndex === -1) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    let updatedImage = foods[foodIndex].image;
    if (req.file) {
      if (updatedImage) {
        const oldPath = path.join(__dirname, 'uploads', updatedImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedImage = req.file.filename;
    }

    foods[foodIndex] = {
      ...foods[foodIndex],
      name,
      description,
      price: parseFloat(price),
      category,
      image: updatedImage
    };

    writeFoodsFile(foods);
    res.json({ success: true, message: "Updated successfully", data: foods[foodIndex] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. UPDATE: Order Status Changes
app.put('/update-order-status/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let orders = readOrdersFile();

    const orderIndex = orders.findIndex(item => item.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    orders[orderIndex].status = status;
    writeOrdersFile(orders);

    res.json({ success: true, message: "Status updated successfully", data: orders[orderIndex] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. DELETE: Remove Food
app.delete('/delete-food/:id', (req, res) => {
  try {
    const { id } = req.params;
    let foods = readFoodsFile();

    const foodItem = foods.find(item => item.id === id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    if (foodItem.image) {
      const imgPath = path.join(__dirname, 'uploads', foodItem.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    foods = foods.filter(item => item.id !== id);
    writeFoodsFile(foods);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});