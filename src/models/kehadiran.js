const mongoose = require("mongoose");
const KehadiranSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    },
    IdUndangan: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Undangan', 
      required: true 
    },
    JamKehadiran: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  module.exports = mongoose.model('Kehadiran', KehadiranSchema);
  