require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const Student = require("./model/student");
const school = require("./model/school");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const generateTokens = require("./util/generateToken");
const verifyRefreshToken = require("./util/verifyRefreshToken");

const app = express();

app.use(express.json());

//Login gose here

// Register
app.post("/register", async (req, res) => {
  // our register logic gose here
  try {
    //Get user input
    const { first_name, last_name, email, password, school_id } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && school_id)) {
      res.status(400).send("All input is required");
    }

    //check if user already exist
    // Validate if user exist in our database
    const oldUser = await Student.findOne({ email });

    const school_IDD = await school.findOne({ school_id });
    // console.log(school_IDD._id);

    if (oldUser) {
      return res.status(409).send("User already exist. Please login");
    }

    //Encrpt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const student = await Student.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      school_id: school_IDD._id,
    });

    // // Create token
    // const token = jwt.sign(
    //     { user_id: user._id, email },
    //     process.env.TOKEN_KEY,
    //     {
    //         expiresIn: "2h"
    //     }
    // )

    // // save user token
    // user.token = token;

    // return new user
    res.status(201).json(student);
  } catch (err) {}
});

// Login Student
app.post("/login", async (req, res) => {
  // our login logic goes here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.password))) {
      // Create token
      const { accessToken, refreshToken } = await generateTokens(student);
      const studentDetail = {
        std_firstname: student.first_name,
        std_lastname: student.last_name,
        std_school: student.school_id,
      };

      return res.status(200).json({ accessToken, refreshToken, studentDetail });
    }

    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// get new access token
app.post("/refresh", async (req, res) => {
  try {
    const tokenDetails = await verifyRefreshToken(req.body);
    const payload = {
      user_id: tokenDetails.user_id,
      email: tokenDetails.email,
      school_id: tokenDetails.school_id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "14m",
    });
    res.status(200).json({
      error: false,
      accessToken,
      message: "Access token created successfully",
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/school", auth, async (req, res) => {
  try {
    const getSchool = await school.find({});
    //console.log(getStudent);

    return res.status(200).json(getSchool);
  } catch (err) {
    console.log(err);
  }
});

app.get("/student/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const getStudent = await Student.findOne({ _id: id });
    //console.log(getStudent);

    return res.status(200).json({
      _id: getStudent._id,
      first_name: getStudent.first_name,
      last_name: getStudent.last_name,
      email: getStudent.email,
      school_id: getStudent.school_id,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
