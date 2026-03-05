const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function testImageKit() {
    console.log("Testing ImageKit Configuration...");
    console.log("Public Key:", process.env.IMAGEKIT_PUBLIC_KEY ? "Found" : "Missing");
    console.log("Private Key:", process.env.IMAGEKIT_PRIVATE_KEY ? "Found" : "Missing");
    console.log("URL Endpoint:", process.env.IMAGEKIT_URL_ENDPOINT ? "Found" : "Missing");

    try {
        // Try to list files (simplest way to check auth)
        const result = await imagekit.listFiles({
            limit: 1
        });
        console.log("✅ SUCCESS: ImageKit is connected and working!");
        console.log("Found files count:", result.length);
    } catch (err) {
        console.error("❌ FAILED: ImageKit authentication or configuration error.");
        console.error("Error Detail:", err.message);
        if (err.help) console.log("Help:", err.help);
    }
}

testImageKit();
