require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Database connection error:", err));
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    const newTask = new Task({
      title: req.body.title,
      priority: req.body.priority || 'Low'
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});