const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// Câu 36: GET /api/hello
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

// Câu 46: GET /api/students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    console.error("Error getting students:", error);

    res.status(500).json({
      message: "Error getting students",
      error: error.message,
    });
  }
});

// Câu 37: POST /api/students
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);

    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
});

// Câu 38: PUT /api/students/:id
app.put("/api/students/:id", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId,
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    console.error("Error updating student:", error);

    res.status(500).json({
      message: "Error updating student",
      error: error.message,
    });
  }
});

// Câu 39: DELETE /api/students/:id
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
});
