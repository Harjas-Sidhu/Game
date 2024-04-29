import jwt from "jsonwebtoken";
import { user } from "../DB/userModel.mjs";

export default async function checkaAuth(req, res, next) {
    try {
        if(!req.cookies) {
            return {
                status: 400,
                msg: "Cookies not Enabled!"
            }
        }
        const userToken = req.cookies.user;
        if(!userToken) {
            return {
                status: 401,
                msg: "UnAuthenticated User!"
            }
        }
        const decodedToken = await jwt.verify(userToken, process.env.USER_SECRET_TOKEN);
        const userData = await user.findOne(
            {
                email: decodedToken.email,
                password: decodedToken.password
            }
        );
        if(!userData) {
            return {
                status: 401,
                msg: "Invalid User Credentials"
            }
        }
        req.params.cookiesData = decodedToken;
        req.params.userName = userData.name;
        req.params.password = userData.password;

        next();
    } catch (err) {
        console.error(err);
        return {
            status: 500,
            msg: "Internal Server error! Check Console!"
        }
    }
}