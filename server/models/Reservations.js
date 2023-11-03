const mongoose=require('mongoose');

const reservationSchema=new mongoose.Schema({
    email:{
        type: 'String',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    b_date:{
        type: Date,
        default: Date.now()
    },
    date:{
        type: Date,
        required: true
    },
    time_slot:{
        type: String,
        required: true
    },
    party_size:{
        type: Number,
        required: true
    },
    T_id: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default:"Pending"
    }
});

const Reservation=mongoose.model('Reservation',reservationSchema);

module.exports = Reservation;