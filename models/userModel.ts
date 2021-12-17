import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'each user must have a name'],
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'each user must have a name'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'each user must have a name'],
      unique: true,
      validate: {
        validator: function (value: string): boolean {
          return validator.isEmail(value);
        },
        message: 'Please enter a valid email address',
      },
    },
    age: {
      type: Number,
      trim: true,
      required: [true, 'Each user must have an age'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const User = model('User', userSchema);

export default User;
