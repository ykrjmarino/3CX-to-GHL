import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());





// Replace with your GoHighLevel API key
const GHL_API_KEY = 'your-ghl-api-key';
const GHL_BASE_URL = 'https://api.gohighlevel.com/v1';


app.post('/webhooks/3cx/reportcall', async (req, res) => {
  const token = req.headers['x-3cx-token'];
  if (token !== '3cx-secret') return res.status(403).send('Forbidden');

  const { callerNumber, callerName } = req.body; // adjust based on payload keys
  console.log('3CX Call:', callerNumber, callerName);

  try {
    // 1. Search contact in GHL
    const search = await axios.get(`${GHL_BASE_URL}/contacts`, {
      headers: { Authorization: `Bearer ${GHL_API_KEY}` },
      params: { phone: callerNumber },
    });

    let contactId;

    if (search.data && search.data.contacts && search.data.contacts.length > 0) {
      // Contact exists
      contactId = search.data.contacts[0].id;
      console.log('Found contact in GHL:', contactId);
    } else {
      // Contact not found → create new
      const create = await axios.post(
        `${GHL_BASE_URL}/contacts/`,
        { phone: callerNumber, name: callerName || 'Unknown' },
        { headers: { Authorization: `Bearer ${GHL_API_KEY}` } }
      );
      contactId = create.data.id;
      console.log('Created new contact in GHL:', contactId);
    }

    res.status(200).send({ status: 'OK', contactId });
  } catch (err) {
    console.error('GHL Error:', err.message);
    res.status(500).send('GHL API Error');
  }
});












app.get("/", (req, res) => res.send("Backend is running wewewe"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2026)`);
});