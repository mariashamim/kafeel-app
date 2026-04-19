import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['elderly', 'caregiver', 'volunteer', 'donor', 'admin'],
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Elderly specific
  age: { type: Number },
  medicalConditions: { type: String },
  emergencyContact: { type: String },
  
  // Caregiver specific
  licenseNumber: { type: String },
  experience: { type: Number },
  
  // Volunteer specific
  skills: { type: String },
  availability: { type: String },
  
  // Donor specific
  paymentInfo: { type: String },
  
  // Admin specific
  adminCode: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);