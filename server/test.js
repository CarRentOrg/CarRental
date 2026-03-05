const mongoose = require("mongoose");
const uri = "mongodb+srv://bbaagii0830_db_user:greatone1234@cluster0.uqqr64y.mongodb.net/?appName=Cluster0";
const uriWithDb = uri.includes("?") ? uri.replace("?", "/car-rental?") : `${uri}/car-rental`;
console.log("Connecting to:", uriWithDb);
mongoose.connect(uriWithDb).then(() => {
  console.log("Connected");
  process.exit(0);
}).catch(err => {
  console.error("Error connecting:", err.message);
  process.exit(1);
});
