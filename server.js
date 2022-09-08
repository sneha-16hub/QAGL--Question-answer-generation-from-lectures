const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
var sessions = require("express-session");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const axios = require("axios");
const https = require("https");
const multer = require("multer");
const Queue = require("bull");
const fs = require("fs");
const taskQueue = new Queue("task doer");
var nodeoutlook = require("nodejs-nodemailer-outlook");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
require("dotenv").config();
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//database connections

// mongoose.connect(
//   "mongodb+srv://nakshatra:" +
//     process.env.DB_PASS +
//     "@cluster0.aiapt.mongodb.net/qaglDB?retryWrites=true&w=majority",
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );
mongoose.connect(
  "mongodb+srv://naksh160201:S56behiyQx0POABm@nakshatracluster.qrbdl.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// mongodb+srv://naksh160201:S56behiyQx0POABm@nakshatracluster.qrbdl.mongodb.net/?retryWrites=true&w=majority

// mongodb+srv://nakshatra:admin@cluster0.aiapt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.set("useCreateIndex", true);

//user schema
const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});
const upldsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  filenamee: { type: String, required: true, unique: true },
  status: { type: String, required: true },
});
const User = new mongoose.model("User", usersSchema);
const Upld = new mongoose.model("Upld", upldsSchema);
//nodemailer transporter
// var transporter = nodemailer.createTransport({
//   service: "hotmail",
//   auth: {
//     user: process.env.TS_U,
//     pass: process.env.TS_P,
//   },
// });
//routes

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/audio");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

taskQueue.process(function (job, done) {
  // job.data contains the custom data passed when the job was created
  // job.id contains id of this job.

  // transcode video asynchronously and report progress
  console.log(job.data.task);
  // call done when finished

  var spawn = require("child_process").spawn;

  // Parameters passed in spawn -
  // 1. type_of_script
  // 2. list containing Path of the script
  //    and arguments for the script

  // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
  // so, first name = Mike and last name = Will
  // var execSync=require('exec-sync');
  // var process=execSync('python ./public/uploads/audio/converter.py'+job.data.task)
  var process = spawn("python", [
    "./public/uploads/audio/converter.py",
    job.data.task,
  ]);
  process.on('close', (code) => {
    Upld.findOne({ username: job.data.username }, function (err, found) {
      if (err) {
        console.log(err);
      } else {
        if (found) {
          found.status = "success";
          found.save(function (err) {
            if (!err) {
              console.log("saved success");
            } else {
            }
          });
        } else {
          console.log("error");
        }
      }
    });
  })

  done();

  // or give a error if error
  done(new Error("error transcoding"));

  // or pass it a result
  done(null, { width: 1280, height: 720 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  throw new Error("some unexpected error");
});

app.get("/", (req, res) => {
  if (!req.session.loggedIn) res.render("login");
  // res.send("already logged in .. logout using /logout");
  else {
    Upld.findOne({ username: req.session.username }, function (err, found) {
      if (err) {
        console.log(err);
      } else {
        if (found) {
          res.render("index1", {
            fily: found.filenamee,
            status: found.status,
          });
        } else {
          res.render("index");
        }
      }
    });
  }
});

app.post("/authenticate", (req, res) => {
  User.findOne({ email: req.body.username }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        if (found.password === req.body.password) {
          req.session.loggedIn = true;
          req.session.username = req.body.username;
          console.log(req.session.username);
          //res.send("logged in");
          //res.redirect('/');
          Upld.findOne({ username: req.body.username }, function (err, found) {
            if (err) {
              console.log(err);
            } else {
              if (found) {
                res.render("index1", {
                  fily: found.filenamee,
                  status: found.status,
                });
              } else {
                res.render("index");
              }
            }
          });
        } else {
          res.send("wrong pass");
        }
      } else {
        res.send("register yourself");
      }
    }
  });
});
app.post("/uploadaudio", upload.single("audio"), async (req, res) => {
  let upld = new Upld({
    username: req.session.username,
    filenamee: req.file.filename,
    status: "pending",
  });

  try {
    upld = await upld.save();
    console.log("start");
    await taskQueue.add({
      task: req.file.filename,
      username: req.session.username,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("error 404");
  }
});

app.post("/removeEntry", (req, res) => {
  Upld.findOne({ username: req.session.username }, function (err, found1) {
    if (!err && found1) {
      fs.unlink("./public/uploads/audio/" + found1.filenamee, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      Upld.remove({ username: req.session.username }, function (err) {
        if (!err) {
          res.redirect("/");
        } else {
          res.send("error 404");
        }
      });
    } else {
      res.send("snap it");
    }
  });
});

app.get("/forgot", (req, res) => {
  if (!req.session.loggedIn) res.render("forgotpassword");
});

app.post("/reset", (req, res) => {
  User.findOne({ email: req.body.username }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        found.resetPasswordToken = String(otpGenerator.generate(6));
        found.resetPasswordExpires = Date.now() + 300000; // 5 min in ms
        // req.session.forgotuname = found.email;
        found.save(function (err) {
          if (!err) {
            req.session.forgotuname = found.email;
            console.log("saved success");
          } else {
            res.send("try later ");
          }
        });

        var mailOptions = {
          from: "qagl.official@outlook.com",
          to: found.email,
          subject: "Password reset for qagl.com",
          text:
            "Someone requested to change the password for qagl.com account with username: " +
            found.email +
            " .If it wasnt you then dont worry ,your password will remain unchanged. Dont share this OTP with anyone . This OTP will remain valid for 5 minutes OTP: " +
            found.resetPasswordToken,
        };

        // transporter.sendMail(mailOptions, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     req.session.forgotuname = found.email;
        //     console.log("Email sent: ");
        //     res.render("OTP");
        //   }
        // });

        nodeoutlook.sendEmail({
          auth: {
            user: "qagl.official@outlook.com",
            pass: "adminNakshatra",
          },
          from: "qagl.official@outlook.com",
          to: found.email,
          subject: "Password reset for qagl.com",
          text:
            "Someone requested to change the password for qagl.com account with username: " +
            found.email +
            " .If it wasnt you then dont worry ,your password will remain unchanged. Dont share this OTP with anyone . This OTP will remain valid for 5 minutes OTP: " +
            found.resetPasswordToken,
          onError: (e) => console.log(e),
          onSuccess: (i) => {
            console.log(req.session.forgotuname);
            console.log(found.email);
            console.log("Email sent: ");
            req.session.save(function (err) {
              if (!err) res.render("OTP");
            });
          },
        });
      } else {
        res.send("not registered");
      }
    }
  });
});

app.post("/checkotp", (req, res) => {
  console.log(req.session.username);
  console.log(req.session.forgotuname);
  User.findOne({ email: req.session.forgotuname }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        if (
          found.resetPasswordToken === req.body.otp &&
          found.resetPasswordExpires > Date.now()
        ) {
          found.password = req.body.passw;

          found.save(function (err) {
            if (!err) {
              console.log("saved success");
              nodeoutlook.sendEmail({
                auth: {
                  user: "qagl.official@outlook.com",
                  pass: "adminNakshatra",
                },
                from: "qagl.official@outlook.com",
                to: found.email,
                subject: "Password changed successfully",
                text: "Your password was changed successfully.",
                onError: (e) => console.log(e),
                onSuccess: (i) => {
                  console.log(req.session.forgotuname);
                  console.log(found.email);
                  console.log("Email sent: ");
                  req.session.save(function (err) {
                    if (!err) res.redirect("/");
                  });
                },
              });
            } else {
              res.send("wrong otp");
            }
          });
        } else {
          res.send("ERROR 404");
        }
      } else {
        res.send("no such user");
      }
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  res.redirect("/");
});

app.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, function (err, found) {
    if (err) console.log(err);
    else {
      if (!found) {
        const user = new User({
          name: req.body.name,
          gender: req.body.gender,
          email: req.body.email,
          password: req.body.psw,
          phone: req.body.phone,
        });
        user.save(function (err) {
          if (!err) {
            nodeoutlook.sendEmail({
              auth: {
                user: "qagl.official@outlook.com",
                pass: "adminNakshatra",
              },
              from: "qagl.official@outlook.com",
              to: req.body.email,
              subject: "Successful registration with qagl.com",
              text:
                "Congrats! you are successfully registered with username " +
                req.body.email,
              onError: (e) => console.log(e),
              onSuccess: (i) => {
                console.log("Email sent: ");
                res.redirect("/");
              },
            });
          } else {
            res.send("phone number is already registered with other userID.");
          }
        });
      } else {
        res.send("username taken");
      }
    }
  });
});

app.post("/download", function (req, res) {
  Upld.findOne({ username: req.session.username }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        const namy = found.filenamee.replace(/\.[^/.]+$/, "");
        // const file = `${__dirname}/public/uploads/audio/${namy}.pdf`;
        const file = `${__dirname}/public/uploads/audio/summary.pdf`;
        res.download(file); // Set disposition and send it.
      } else {
        res.send("error");
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Started");
});
