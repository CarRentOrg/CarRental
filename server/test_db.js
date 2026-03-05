const mongoose = require("mongoose");
const uri = "mongodb+srv://Admin1user:Test123@cluster0.uqqr64y.mongodb.net/owner?retryWrites=true&w=majority";

async function testConnection() {
    console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ":****@"));
    try {
        const clientOptions = {
            serverApi: { version: '1', strict: true, deprecationErrors: true },
            bufferCommands: false
        };
        await mongoose.connect(uri, clientOptions);
        console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED: Authentication failed. This means either your username 'Admin1user' or password 'Test123' is wrong in Atlas.");
        console.error("Error Detail:", err.message);
        process.exit(1);
    }
}

testConnection();
