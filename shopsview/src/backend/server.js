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
const filePath = path.join(__dirname, 'items.json'); // Changed filename
const ordersFilePath = path.join(__dirname, 'orders.json');
const usersFilePath = path.join(__dirname, 'users.json');

const readItemsFile = () => { // Changed function name
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

const writeItemsFile = (data) => { // Changed function name
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const writeOrdersFile = (data) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2));
};

// 1. CREATE: Add Item attached to a specific Shop
app.post('/add-item', upload.single('image'), (req, res) => { // Changed route path
  try {
    const { name, description, price, category, shopId } = req.body;
    const items = readItemsFile();

    const item = {
      id: Date.now().toString(),
      shopId: shopId || "General",
      name,
      description,
      price: parseFloat(price),
      category,
      image: req.file ? req.file.filename : null
    };

    items.push(item);
    writeItemsFile(items);

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUsersFile();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      res.json({ success: true, shopId: user.shopId });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. READ: Get Items belonging ONLY to a specific shop
app.get('/list-item', (req, res) => { // Changed route path
  const { shopId } = req.query;
  let items = readItemsFile();

  if (shopId) {
    items = items.filter(item => item.shopId === shopId);
  }
  res.json({ success: true, data: items });
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

// 4. UPDATE: Edit Item
app.put('/edit-item/:id', upload.single('image'), (req, res) => { // Changed route path
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    let items = readItemsFile();

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }

    let updatedImage = items[itemIndex].image;
    if (req.file) {
      if (updatedImage) {
        const oldPath = path.join(__dirname, 'uploads', updatedImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedImage = req.file.filename;
    }

    items[itemIndex] = {
      ...items[itemIndex],
      name,
      description,
      price: parseFloat(price),
      category,
      image: updatedImage
    };

    writeItemsFile(items);
    res.json({ success: true, message: "Updated successfully", data: items[itemIndex] });
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

// 6. DELETE: Remove Item
app.delete('/delete-item/:id', (req, res) => { // Changed route path
  try {
    const { id } = req.params;
    let items = readItemsFile();

    const inventoryItem = items.find(item => item.id === id);
    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: "Product item not found" });
    }

    if (inventoryItem.image) {
      const imgPath = path.join(__dirname, 'uploads', inventoryItem.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    items = items.filter(item => item.id !== id);
    writeItemsFile(items);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});