import mongoose from 'mongoose';
import { UserRole } from '@/lib/types/enums';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema); 