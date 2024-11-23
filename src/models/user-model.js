import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true,
        unique:true
    },
    password: {
        type: String,
        require: true,
    },
},{
    timestamps: true,
})

// indexing db for better query performance
userSchema.index({_id: 1, email: 1,});

const User = mongoose.models['Users'] || mongoose.model('Users', userSchema);

export default User;