import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/webhooks/3cx/reportcall', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("Backend is running wewewe"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2026)`);
});