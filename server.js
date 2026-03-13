import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());





app.post('/webhooks/3cx/reportcall', (req, res) => {
  const { caller, displayName } = req.query;
  console.log('3CX Call Info:', { caller, displayName });
  res.send('received');
});

/*
app.post('/webhooks/3cx/reportcall', async (req, res) => {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const LOCATION_ID = process.env.LOCATION_ID;
  const CUSTOM_PHONE_FIELD_ID = process.env.CUSTOM_PHONE_FIELD_ID;
  const CUSTOM_PHONE_FIELD_KEY = process.env.CUSTOM_PHONE_FIELD_KEY;
  const SYNC_TAG = process.env.SYNC_TAG || 'sync-3cx';
  const CUSTOM_FIELD_ID = process.env.CUSTOM_FIELD_ID;
  const CUSTOM_FIELD_KEY = process.env.CUSTOM_FIELD_KEY;
  
  const token = req.headers['x-3cx-token'];
  if (token !== '3cx-secret') return res.status(403).send('Forbidden');

  const { callerNumber, callerName } = req.body;
    console.log('Raw body:', req.body);

  if (!callerNumber) return res.status(400).send('callerNumber missing');

  const normalizedPhone = callerNumber.replace(/[^0-9]/g, '');
  console.log('3CX Call:', callerNumber, callerName);

  try {

    // SEARCH CONTACT
    const search = await axios.get(
      'https://services.leadconnectorhq.com/contacts',
      {
        headers: {
          Accept: 'application/json',
          Version: '2021-07-28',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        },
        params: {
          locationId: LOCATION_ID,
          limit: 100
        }
      }
    );

    // FILTER BY PHONE in Node
    const existingContact = search.data.contacts.find(c =>
      c.customFields?.some(f => f.id === CUSTOM_PHONE_FIELD_ID && f.value === normalizedPhone)
    );

    let contactId;

    if (existingContact) {
      contactId = existingContact.id;
      console.log('Found contact in GHL:', contactId);

      // Merge existing tags with SYNC_TAG
      const currentTags = existingContact.tags || [];
      if (!currentTags.includes(SYNC_TAG)) currentTags.push(SYNC_TAG);

      // ADD TAG if needed
      await axios.put(
        `https://services.leadconnectorhq.com/contacts/${contactId}`,
        { tags: currentTags },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Version: '2021-07-28',
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        }
      );

      console.log('Updated contact and added sync tag in GHL');

    } else {
      // CREATE NEW CONTACT
      const create = await axios.post(
        'https://services.leadconnectorhq.com/contacts',
        {
          firstName: callerName || 'Unknown',
          name: callerName || 'Unknown',
          locationId: LOCATION_ID,
          tags: [SYNC_TAG],
          customFields: [
            {
              id: CUSTOM_PHONE_FIELD_ID,
              key: CUSTOM_PHONE_FIELD_KEY,
              field_value: normalizedPhone
            },
            {
              id: CUSTOM_FIELD_ID,
              key: CUSTOM_FIELD_KEY,
              field_value: callerNumber //store 3CX contact id here if meron na
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Version: '2021-07-28',
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        }
      );
      contactId = create.data.contact.id;
      console.log('Created new contact in GHL with phone custom field and tag:', contactId);
    }

    res.status(200).send({ status: 'OK', contactId });
  } catch (err) {
    console.error('GHL Error full:', JSON.stringify(err.response?.data, null, 2));
    res.status(500).send('GHL API Error');
  }
});

*/








app.get("/", (req, res) => res.send("Backend is running 3cx testing webhook"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2026)`);
});