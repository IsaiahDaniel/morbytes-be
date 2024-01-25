import crypto from "crypto";
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is Required"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please Provide a Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [6, "password must be atleast six characters"],
        // select: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });


UserSchema.pre('save', async function(next: any) {

    if(!this.isModified("password")){
        next();
    }

    const hash = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, hash);
    next();

});

UserSchema.pre("save", async function(next: any) {
    const token = crypto.randomBytes(16).toString("hex");

    this.emailVerificationToken = token;
    next();

});

UserSchema.methods.matchPassword = async function(password: any){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;

}



export interface IUser extends Document {
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpire: any,
    matchPassword: any,
}

const User = model<any>("User", UserSchema);

export default User;