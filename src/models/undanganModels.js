const mongoose = require("mongoose");
const UndanganSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String 
    },
    ucapan: { 
        type: String ,
        required: true
    },
    status: { 
        type: String, 
        enum: ['Datang', 'pending', 'Tidak Datang'], default: 'pending' 
    },
    isScanned: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
  });
  
  module.exports = mongoose.model('Undangan', UndanganSchema);
  