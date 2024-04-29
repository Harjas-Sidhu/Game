import { user } from "../../DB/userModel.mjs";

export default async function register(req, res) {
    let requestBody = "";

    req.on("data", (chunkBytes) => {
        requestBody += chunkBytes.toString();
    });

    req.on("end", async () => {
        try {
            requestBody = requestBody.toString();
            console.log("requestBody: ",requestBody);
            const parsedRequest = JSON.parse(requestBody);
            if (!parsedRequest.email || !parsedRequest.password || !parsedRequest.name) {
                res.status(400);
                res.send({msg: "Request Format Incorrect!"});
            } else {
                const { status, msg, token } = await user.register(parsedRequest);
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