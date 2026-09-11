const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect("mongodb+srv://youssef:123456aa@g-10.4udy20h.mongodb.net/?appName=G-10") // ضع الرابط هنا مباشرة للتجربة
    .then(() => console.log("Connected!"))
    .catch((err) => console.log("error from db", err));
};

module.exports = { connectDB };