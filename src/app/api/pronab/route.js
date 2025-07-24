import { MongoClient } from 'mongodb';
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('cloud'); // Replace with your database name
}

export async function GET() {
  try {
    const client = await connectToDatabase()

    console.log("Connected to MongoDB successfully.");

    // Fetch all users from the "users" collection
    const users = await client.collection("mega_personal_login").find().toArray();

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users found" }),
        { status: 404 }
      );
    }

    // Return the list of users
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error in fetching all users:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching users", error: error.message }),
      { status: 500 }
    );
  }
}



