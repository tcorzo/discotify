/**
 * @name Discotify
 * @version 1.0.0
 * @description A Spotify-Discord connector to right-click + "Play on Discord"
 * @author tcorzo
 * @license
 */

// bd/src/discotify.plugin.ts
var import_http = require("http");
module.exports = class Discotify {
  start() {
    this.startServer();
  }
  stop() {
  }
  observer(changes) {
  }
  startServer() {
    this.server = (0, import_http.createServer)(function (req, res) {
      if (req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello, World!\n");
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed\n");
      }
    });
    this.server.listen(8443);
    console.log("Server running on port 8443");
  }
};