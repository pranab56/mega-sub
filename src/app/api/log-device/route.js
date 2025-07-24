import { MongoClient } from 'mongodb';

require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('cloud');
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to database:', err.message, err.stack);
      throw new Error('Database connection error');
    }
  }
  return db;
}

export async function POST(req) {
  try {
    const { domainName, deviceType, email } = await req.json();
    console.log('Received data:', { domainName, deviceType, email });

    if (!domainName || !deviceType) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid input' }),
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const deviceCollection = db.collection('device_count');

    // Update or insert document
    await deviceCollection.updateOne(
      { domainName },
      {
        $setOnInsert: { domainName, email }, // Ensure domainName is used
        $inc: { [`deviceCounts.${deviceType}`]: 1 },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error logging device:', error.message, error.stack);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
