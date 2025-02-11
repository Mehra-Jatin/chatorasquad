import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid email format'], 
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6, 
    },
    age: {
      type: Number,
     default:18,
    },
    role: {
      type: String,
      enum: ['user', 'admin','hotel','resturant'],
      default: 'user',
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    gender:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;