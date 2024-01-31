"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./middleware/logger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const mongoose_1 = __importDefault(require("mongoose"));
const websockethelper_1 = require("./helpers/websockethelper");
const { verifyLogin, verifyWebsocketLogin, } = require("./middleware/verifyLogin");
const bodyParser = require("body-parser");
var whitelist = ["http://example1.com", "http://example2.com"];
// var corsOptions = {
//   origin: function (origin : any, callback:Function) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
let corsOptions = {
    origin: "*",
};
//config
(0, dotenv_1.configDotenv)();
(0, dbConfig_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//middlewares
app.use((0, cookie_parser_1.default)());
app.use(function (req, res, next) {
    res.header("Content-Type", "application/json;charset=UTF-8");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(logger_1.logger);
app.use("/auth", require("./routes/auth"));
app.use(verifyLogin);
app.get("/", (req, res) => {
    console.log("hi");
});
app.use("/user", require("./routes/user"));
app.use("/contact", require("./routes/contacts"));
app.use("/message", require("./routes/message"));
mongoose_1.default.connection.once("open", () => {
    console.log("DB connected");
});
const s = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//websocket Code
exports.wss = new ws_1.WebSocketServer({ noServer: true });
function SocketError(e) {
    console.log(e);
}
const connections = {};
s.on("upgrade", (req, socket, head) => {
    socket.on("error", SocketError);
    (0, logger_1.upgradeLogs)(req);
    try {
        console.log("ws cookie", req.headers.cookie);
        // verifyWebsocketLogin(req.headers["sec-websocket-protocol"]);
    }
    catch (err) {
        console.log(err);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
    exports.wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", SocketError);
        exports.wss.emit("connection", ws, req);
    });
});
exports.wss.on("connection", (ws, req) => {
    ws.on("error", SocketError);
    ws.send(JSON.stringify({ message: "Connection established" }));
    const user_id = req.headers["sec-websocket-protocol"];
    // wss.clients.forEach((client) => {
    //   connections[user_id ? user_id.toString() : ""] = client;
    // });
    connections[user_id ? user_id.toString() : ""] = ws;
    ws.on("message", (msg, isBinary) => {
        //messagehandler
        (0, websockethelper_1.messageHandler)(msg, connections);
    });
    ws.on("close", () => {
        console.log("Connection closed");
    });
});
