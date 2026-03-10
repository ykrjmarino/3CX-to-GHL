import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());





/*app.post('/webhooks/3cx/reportcall', async (req, res) => {

  console.log('Headers:', req.headers);
  console.log('Raw body:', req.body);

  res.send('received');
});
*/
app.post('/webhooks/3cx/reportcall', async (req, res) => {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const LOCATION_ID = process.env.LOCATION_ID;
  const CUSTOM_PHONE_FIELD_ID = process.env.CUSTOM_PHONE_FIELD_ID;
  const CUSTOM_PHONE_FIELD_KEY = process.env.CUSTOM_PHONE_FIELD_KEY;
  const SYNC_TAG = process.env.SYNC_TAG || 'sync-3cx';
  
  const token = req.headers['x-3cx-token'];
  if (token !== '3cx-secret') return res.status(403).send('Forbidden');

  console.log('Raw body:', req.body);
  const { callerNumber, callerName } = req.body;
  console.log('3CX Call:', callerNumber, callerName);

  if (!callerNumber) return res.status(400).send('callerNumber missing');

  try {
    const normalizedPhone = callerNumber.replace(/[^0-9]/g, '');

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
      c.customFields?.some(f => f.id === CUSTOM_PHONE_FIELD_ID && f.field_value === normalizedPhone)
    );

    let contactId;

    if (existingContact) {
      contactId = existingContact.id;
      console.log('Found contact in GHL:', contactId);

      // Update or add tag from env
      await axios.put(
        `https://services.leadconnectorhq.com/contacts/${contactId}`,
        { tags: [SYNC_TAG] },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Version: '2021-07-28',
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        }
      );

    } else {
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
              field_value: normalizedPhone
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










app.get("/", (req, res) => res.send("Backend is running 3cx"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2026)`);
});