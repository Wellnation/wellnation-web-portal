const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const bodyParser = require("express");

const ReportAnalysis = require("./reportAnalysis");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
	next();
});
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://wellnation.vercel.app",
			"http://34.170.11.83:3000/",
		],
		credentials: true,
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Headers",
			"X-Requested-With",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: true, extended: true }));

app.post("/analyze-report", async (req, res) => {
	try {
		const report = req.body.text;
		// console.log(report)
		ReportAnalysis(report).then((analysisResult) => {
			res.status(200).json(analysisResult);
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			report: "Sorry, an error occurred while analyzing the report.",
			status: "error",
		});
	}
});

const io = new Server(8001, {
	cors: true,
});

const userToSocketMap = new Map();
const socketToUserMap = new Map();

io.on("connection", (socket) => {
	console.log("Socket connected", socket.id);

	socket.on("room:join", (data) => {
		const { roomId, userId } = data;
		console.log(userId, "joined room", roomId);
		userToSocketMap.set(userId, socket.id);
		socketToUserMap.set(socket.id, userId);
		io.to(roomId).emit("user:joined", { userId, id: socket.id });
		socket.join(roomId);
		io.to(socket.id).emit("room:join", data);
	});

	socket.on("user:call", (data) => {
		const { to, offer } = data;
		console.log(
			socketToUserMap.get(socket.id),
			"called",
			socketToUserMap.get(to)
		);
		io.to(to).emit("incoming:call", {
			from: socket.id,
			offer,
			sender: socketToUserMap.get(socket.id),
		});
	});

	socket.on("call:accepted", (data) => {
		const { to, ans } = data;
		io.to(to).emit("call:accepted", { from: socket.id, ans });
	});

	socket.on("peer:nego:needed", (data) => {
		const { to, offer } = data;
		io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
	});

	socket.on("peer:nego:done", (data) => {
		const { to, ans } = data;
		io.to(to).emit("peer:nego:final", { from: socket.id, ans });
	});

	socket.on("leave", () => {
		const userId = socketToUserMap.get(socket.id);
		console.log(userId, "left->", "room:", socket.id);
		userToSocketMap.delete(userId);
		socketToUserMap.delete(socket.id);
		io.to(socket.id).emit("room:leave", { from: socket.id });
	});
});

io.on("disconnect", () => {
	console.log("user disconnected");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
