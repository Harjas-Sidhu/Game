import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function generateToken(email, password) {
    try {
        if (!process.env.USER_SECRET_TOKEN) {
            console.error("User secret not found!");
            return { status: 500, msg: "Internal Server error! Check Console!" };
        }
        return { status: 200, token: jwt.sign({ email, password }, process.env.USER_SECRET_TOKEN) };
    } catch (err) {
        console.error(err);
        return { status: 500, msg: "Internal Server error! Check Console!", token: null};
    }
}

async function generateHashedPassword(password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return { status: 200, password: hashedPassword }
    } catch (err) {
        console.error(err);
        return { status: 500, msg: "Internal Server error! Check Console!", password: null };
    }
}

class User {
    constructor() {
        this.schema = new mongoose.Schema({
            _id: mongoose.Types.ObjectId,
            email: String,
            name: String,
            score: Number,
            rank: Number,
            friends: [mongoose.Types.ObjectId],
            password: String,
            noOfMatchesPlayed: Number,
            noOfTop1: Number,
            noOfTop2: Number,
            noOfTop3: Number,
        });
        this.model = new mongoose.model("User", this.schema);
        this.rank = 1;
    }

    async authenticate(parsedRequest) {
        try {
            const user = await this.model.findOne(
                {
                    email: parsedRequest.email
                }
            );
            if (user) {
                const passwordMatch = await bcrypt.compare(parsedRequest.password, user.password);
                if (passwordMatch == true) {
                    return {
                        status: 200,
                        msg: "User Authentication Successful!" ,
                        token: (generateToken(user.email, parsedRequest.password)).token
                    };
                } else {
                    return { 
                        status: 400, 
                        msg: "Invalid Credentials",
                        token: null 
                    };
                }

            } else {
                return { 
                    status: 400, 
                    msg: "User Not Found!",
                    token: null 
                 };
            }
        } catch (err) {
            console.log(err);
            return { 
                status: 500, 
                msg: "Internal Server error! Check Console!",
                token: null 
             };
        }
    }

    async register(parsedRequest) {
        try {
            const exsistingUser = await this.model.findOne(
                {
                    email: parsedRequest.email
                }
            );
            if (exsistingUser) {
                return {
                    status: 400,
                    msg: "User with the given email already exists!",
                    token: null
                };
            }

            const password = (await generateHashedPassword(parsedRequest.password)).password;

            const newUser = new this.model(
                {
                    _id: new mongoose.Types.ObjectId(),
                    email: parsedRequest.email,
                    name: parsedRequest.name,
                    password: password,
                    score: 0,
                    rank: this.rank++,
                    friends: [],
                    noOfMatchesPlayed: 0,
                    noOfTop1: 0,
                    noOfTop2: 0,
                    noOfTop3: 0
                }
            );

            await newUser.save();
            
            return {
                status: 200,
                msg: "User Registered Successfully",
                token: generateToken(newUser.email, password).token
            };
        } catch (err) {
            console.log(err);
            return {
                status: 500,
                msg: "Internal Server error! Check Console!",
                token: null
            };
        }
    }
}

export const user = new User();