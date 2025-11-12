const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas Connection
mongoose.connect('mongodb+srv://samikshamulik:iviQ6YhcmmutFLmx@express-crud.ofxfjht.mongodb.net/?appName=Express-crud')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Define Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// 🔹 CREATE (POST)
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// 🔹 READ ALL (GET)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// 🔹 READ SINGLE USER (GET by ID)
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// 🔹 UPDATE (PUT)
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
});

// 🔹 DELETE (DELETE)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('<h2>Express CRUD API 🚀</h2><p>Use /api/users in Postman to test the API.</p>');
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
