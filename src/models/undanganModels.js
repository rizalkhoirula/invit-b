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
        enum: ['Hadir', 'Tidak Hadir'],
        required: true  

    },
    Jumlahtamu:{
        type: String,
        // enum: ['1', '2', '3', '4'],
        required: false
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
  