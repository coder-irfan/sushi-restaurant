require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// First connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
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
      console.log("Super Admin already exists!");
      process.exit();
    }

    const admin = new Admin({
      name: "Coder Irfan",
      email: "superadmin@example.com",
      password: "Admin123%",
      role: "superadmin",
    });

    await admin.save();
    console.log("Super Admin created successfully!");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
