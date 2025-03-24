import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    name: string;
    age: number;
    role: string;
    batch?: string;
    phone: string;
    emergencyContact?: string;
    address: string;
    username: string;
    email: string;
    password: string;
    avatar: Buffer;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"],
    },
    role: {
        type: String,
        required: [true, "Please specify your role"],
    },
    batch: {
        type: String,
        enum: ["morning", "afternoon", "Both"],
        required: function (this: IUser) {
            return this.role === "Student";
        },
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    emergencyContact: {
        type: String,
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
    },
    username: {
        type: String,
        required: [true, "Please enter your username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    avatar: {
        type: 'Buffer',
        public_id: String,
        url: String, 
    }
});

export default mongoose.model<IUser>("User", userSchema);
