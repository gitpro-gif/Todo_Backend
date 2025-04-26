const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const TodoModel = require('./Models/Todo')

const app = express()

// CORS setup properly
app.use(cors({
    origin: 'https://verdant-griffin-cfd8d0.netlify.app', // your Netlify frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Test route to keep server awake
app.get("/", (req, res) => {
    res.send("Server is running!")
})

// Todo routes
app.get('/get', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post('/add', async (req, res) => {
    try {
        const task = req.body.task;
        const newTodo = await TodoModel.create({ task });
        res.json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        res.json(deletedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
