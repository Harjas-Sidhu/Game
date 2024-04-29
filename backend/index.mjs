import express from "express";
import dotenv from "dotenv";
import { DBConnect } from "./DB/database.mjs";
import { user } from "./DB/userModel.mjs";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.mjs";
import { createServer } from "http";
import checkAuth from "./middleware/checkAuth.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:4200",
        credentials: true,
    }

));

const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    cors: {
        origin: "http://localhost:4200",
    },
});

let games = [];
let inputsToProcess = [];

DBConnect();

app.use(routes);

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
});

io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
    socket.on("join", (id) => {
        if (id) {
            const game = games.find(game => game.id === id);
            if (game && game.players.length < 5) {
                game.players.push(socket.id);
                socket.join(id);
                io.to(id).emit("playerJoined", socket.id);
                socket.emit("gameId", id);
            } else if (!game) {
                socket.emit("gameNotFound");
            } else {
                socket.emit("gameFull");
            }
            return;
        }
        for (let game of games) {
            if (game.players.length < 5) {
                game.players.push(socket.id);
                socket.join(game.id);
                socket.emit("gameId", game.id);
                io.to(game.id).emit("playerJoined", socket.id);
                return;
            }
        }
        let gameId = Math.floor(Math.random() * 100000 + 124721);
        games.push({
            id: gameId,
            players: [socket.id],
            aproovals: 0,
        });
        socket.join(gameId);
        socket.to(gameId).emit("playerJoined", socket.id);
        socket.emit("gameId", gameId);
    });
    socket.on("startGame", (id) => {
        const game = games.find(game => game.id === id);
        if(game) {
            io.to(game.id).emit("aprooves", socket.id);
            if (game.players.length > 1 && game.players.length < 6) {
                game.aproovals++;
                if (game.aproovals === game.players.length) {
                    io.to(game.id).emit("gameReady", "game is ready!");
                }
            } else {
                socket.emit("playersError");
            }
        }
    });
    socket.on("input", (input) => {
        try {
            const game = games.find(game => {
                return game.players.includes(socket.id);
            });
            if (game) {
                io.to(game.id).emit("input", { input: input, id: socket.id }, game.players);
            }
        } catch (err) {
            console.log(err);
        }
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
        for (let game of games) {
            if (game.players.includes(socket.id)) {
                game.players = game.players.filter(player => player !== socket.id);
                io.to(game.id).emit("playerLeft", game.players);
                if (game.players.length === 0) {
                    games = games.filter(g => g.id !== game.id);
                }
            }
        }
    });
});