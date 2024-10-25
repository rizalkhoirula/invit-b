const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username harus diisi"],
      unique: [true, "username sudah digunakan"],
    },
    email: {
      type: String,
      required: [true, "email harus diisi"],
      unique: [true, "email sudah digunakan"],
      validator: {
        validator: validator.isEmail,
        message: "email harus berformat email",
      },
    },
    password: {
      type: String,
      required: [true, "password harus diisi"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (reqPassword) {
  return await bcryptjs.compare(reqPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
