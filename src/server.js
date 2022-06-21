const express = require('express');
const path = require('path');
const { SocketUtil } = require('./modules/socket/socket');
const { getWords } = require('./db/words');

const ExpressServer = express();

ExpressServer.use("/assets", express.static(path.join(__dirname, "../dist", "assets")));
ExpressServer.use("/favicon.ico", express.static(path.join(__dirname, "../dist", "favicon.ico")));

ExpressServer.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
});
ExpressServer.get("/random/", async (req, res) => {
    const newWord = getWords();
    res.send(newWord);
});
SocketUtil.Initialize(ExpressServer);
//# sourceMappingURL=server.js.map