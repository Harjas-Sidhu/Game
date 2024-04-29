import { user } from "../../DB/userModel.mjs";

export default async function login(req, res) {
    let requestBody = "";

    req.on("data", (chunkBytes) => {
        requestBody += chunkBytes.toString();
    });

    req.on("end", async () => {
        try {
            const parsedRequest = JSON.parse(requestBody);
            if (!parsedRequest.email || !parsedRequest.password) {
                res.status(400);
                res.send({msg: "Request Format Incorrect!"});
            } else {
                const { status, msg, token } = await user.authenticate(parsedRequest);
                if (token) {
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                    res.cookie("user", token, {
                        
                    });
                }
                res.status(status);
                res.send({msg: msg});
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.send({msg: "Internal Server error! Check console!"});
        }
    });
}