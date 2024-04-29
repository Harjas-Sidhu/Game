import router from "express";
import login from "../api/auth/login.mjs";
import register from "../api/auth/register.mjs";

const routes = router();

routes.post("/login", async (req, res) => {
    login(req, res);
});

routes.post("/register", async (req, res) => {
    register(req, res);
});


export default routes;