import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'User must have a username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please, provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please, confirm your password'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = '';
  next();
});

export default mongoose.model('User', UserSchema);
