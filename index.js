const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Kết nối database thành công");
  })
  .catch((err) => {
    console.log("Không thể kết nối đến database", err);
    process.exit();
  });
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(5000, () => {
  console.log("Server đang chạy trên cổng" + port);
});
