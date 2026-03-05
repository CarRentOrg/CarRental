const uri = "mongodb+srv://bbaagii0830_db_user:greatone1234@cluster0.uqqr64y.mongodb.net/?appName=Cluster0";
const parsedUri = new URL(uri);
if (parsedUri.pathname === "/" || parsedUri.pathname === "") {
    parsedUri.pathname = "/car-rental";
}
console.log(parsedUri.toString());
