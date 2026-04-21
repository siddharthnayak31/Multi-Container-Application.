/**
 * Local test server - uses in-memory storage instead of MongoDB
 * Run with: node src/local-server.js
 * For production, use Docker Compose (docker-compose up -d)
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory store
const todos = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Helper: generate a unique ID
function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Root — serve the interactive UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Todo API is running (local mode — in-memory storage)',
    endpoints: {
      'GET /todos': 'Get all todos',
      'POST /todos': 'Create a new todo',
      'GET /todos/:id': 'Get a single todo',
      'PUT /todos/:id': 'Update a single todo',
      'DELETE /todos/:id': 'Delete a single todo',
    },
  });
});

// GET /todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const todo = {
    _id: generateId(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  todos.unshift(todo);
  res.status(201).json(todo);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t._id === req.params.id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const { title, description, completed } = req.body;
  if (title !== undefined) todos[index].title = title;
  if (description !== undefined) todos[index].description = description;
  if (completed !== undefined) todos[index].completed = completed;
  todos[index].updatedAt = new Date().toISOString();

  res.json(todos[index]);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.json({ message: 'Todo deleted successfully' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   Todo API running (local test mode)     ║');
  console.log('  ║                                          ║');
  console.log(`  ║   → http://localhost:${PORT}                ║`);
  console.log('  ║   → Using in-memory storage              ║');
  console.log('  ║   → For production, use Docker Compose   ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
