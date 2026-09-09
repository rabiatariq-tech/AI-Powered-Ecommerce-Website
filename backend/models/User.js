const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Please add a name'],
      trim:     true
    },
    email: {
      type:      String,
      required:  [true, 'Please add an email'],
      unique:    true,
      lowercase: true,
      match:     [/^\S+@\S+\.\S+$/, 'Please add a valid email']
    },
    password: {
      type:      String,
      required:  [true, 'Please add a password'],
      minlength: 6,
      select:    false  // never return password in queries by default
    },
    role: {
      type:    String,
      enum:    ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type:    String,
      default: ''
    }
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────
// CORRECT - async hooks don't need next in Mongoose v7+
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Method to compare entered password with hashed ──
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);