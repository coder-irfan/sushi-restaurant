require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// First connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1); // used if something goess wrong (means failure); process.exit(0) means success
  }
};

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "superadmin@example.com",
    });

    if (existingAdmin) {
      process.exit();
    }

    const admin = new Admin({
      name: "Coder Irfan",
      email: "superadmin@example.com",
      password: "Admin123%",
      role: "superadmin",
    });

    await admin.save();
  } catch (error) {
    process.exit(1);
  }
};

createSuperAdmin();
