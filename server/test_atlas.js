const mongoose = require("mongoose");
const uri =
  "mongodb+srv://bbaagii0830_db_user:greatone1234@cluster0.uqqr64y.mongodb.net/car-rental?appName=Cluster0";

async function run() {
  try {
    const clientOptions = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    };
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
  } catch (err) {
  } finally {
    await mongoose.disconnect();
  }
}
run();
