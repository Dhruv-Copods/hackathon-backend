import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Lowdb with JSONFilePreset
const defaultData = { posts: [] };
const db = await JSONFilePreset('db.json', defaultData);

// API Routes
app.get('/posts', async (req, res) => {
  res.json(db.data.posts);
});

app.post('/posts', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newPost = { id: Date.now(), title };
  await db.update(({ posts }) => posts.push(newPost));

  res.json(newPost);
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  await db.update(({ posts }) => posts.filter((post) => post.id !== parseInt(id, 10)));
  res.json({ message: 'Post deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
