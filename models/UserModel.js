const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L’email est requis'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    },
    role: {
      type: String,
      enum: ['admin', 'utilisateur'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//  Hash le mot de passe avant enregistrement si modifié
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Méthode pour comparer le mot de passe
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', UserSchema);

module.exports = User;
