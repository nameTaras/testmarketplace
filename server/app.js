const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const router = require("node-async-router")();
const MongoClient = require("mongodb").MongoClient;

// const { AuthorizeAppToGoogleDrive } = require("./googleDriveApi/authorizeApp.js");

const Authentication = require("./authentication.js");
const AppRouter = require("./routes/appRouter.js");
const ProductsRouter = require("./routes/productRouter.js");
const UsersRouter = require("./routes/userRouter.js");
const ChatsRouter = require("./routes/chatRouter.js");
const Config = require("../config/config.server.js");

const app = express();
const server = require('http').Server(app);

app.use(express.static(__dirname + "/../build/"));

app.use((req, res, next) => {
	const noApiInPath = /^(?!\/?api).+$/.test(req.path);

	if (noApiInPath) {
		res.sendFile("index.html", { root: __dirname + "/../build/" });
	} else {
		next();
	}
});

const uridbMarketplace = Config.uriMongodb;
const port = Config.PORT;
const mongoClient = new MongoClient(
	uridbMarketplace,
	{ 
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
let dbClient = null;
mongoClient.connect((err, client) => {
	if (err) return console.log(err);
	server.listen(port);
	dbClient = client;
	//AuthorizeAppToGoogleDrive(dbClient);
});

app.use((req, res, next) => {
	if (!!dbClient) {
		req.mongo = dbClient;
		return next();
	}
});
app.use(session({
	store: new MongoStore({ url: uridbMarketplace, dbName: "marketplaceApp" }),
	secret: "secret",
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.json())
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});

Authentication(app, passport);

AppRouter(router);
UsersRouter(router, passport);
ProductsRouter(router);
ChatsRouter(router);

const io = require('socket.io')(server);

io.on('connection', socket => {
	socket.on('message', (msg, chatId, productId) => {
		socket.broadcast.emit('messageToClients', msg, chatId, productId);
	});

	socket.on('disconnect', () => {
		console.log(`Client with id ${socket.id} disconnected`);
	});
});

app.use(router);

process.on("SIGINT", () => {
	dbClient.close();
	process.exit();
});
