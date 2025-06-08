// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Load and save users
function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Failed to read users.json:", err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    console.log("✅ users.json successfully updated");
  } catch (err) {
    console.error("❌ Failed to write to users.json:", err);
  }
}

// POST /api/users — Create or return user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (!user) {
    user = { username, scores: [] };
    users.push(user);
    saveUsers(users);
    console.log(`👤 New user created: ${username}`);
    return res.status(201).json({ message: 'New user created', user });
  }

  console.log(`👋 Returning user: ${username}`);
  res.json({ message: 'Welcome back', user });
});

// POST /api/submit-score — Add a score entry
app.post('/api/submit-score', (req, res) => {
  const { username, score, mode, timestamp, type } = req.body;
  console.log("📩 Incoming score payload:", req.body);

  if (!username || score === undefined || !mode || !timestamp || !type) {
    console.log("❌ Missing data in score submission");
    return res.status(400).json({ error: 'Missing data' });
  }

  const users = loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log("❌ User not found:", username);
    return res.status(404).json({ error: 'User not found' });
  }

  const scoreEntry = {
    score,
    mode,
    type,
    timestamp
  };

  user.scores.push(scoreEntry);
  saveUsers(users);
  console.log(`✅ Score saved for ${username}:`, scoreEntry);

  res.json({ message: 'Score saved', scores: user.scores });
});

// GET /api/scores/:username — Get scores for a user
app.get('/api/scores/:username', (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.username === req.params.username);
  if (!user) {
    console.log("❌ Score lookup failed: user not found");
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ scores: user.scores });
});

// GET /api/leaderboard — Optional leaderboard (top 20)
app.get('/api/leaderboard', (req, res) => {
  const users = loadUsers();
  const allScores = users.flatMap(user =>
    user.scores.map(score => ({
      username: user.username,
      score: score.score,
      mode: score.mode,
      type: score.type,
      timestamp: score.timestamp
    }))
  );

  allScores.sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ leaderboard: allScores.slice(0, 20) });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});