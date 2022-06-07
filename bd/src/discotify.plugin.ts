/**
 * @name Discotify
 * @version 1.0.0
 * @description A Spotify-Discord connector to right-click + "Play on Discord"
 * @author tcorzo
 * @license
 */

import { BdPlugin } from "@bandagedbd/bdapi";
import { createServer, Server } from "http";


module.exports = class Discotify {
    server: Server

    // Required function. Called when the plugin is activated (including after reloads)
    start() {
        this.startServer();
    }
    // Required function. Called when the plugin is deactivated
    stop() { }

    observer(changes) { } // Optional function. Observer for the `document`. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>

    private startServer() {
        this.server = createServer(function (req, res) {
            if (req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Hello, World!\n');
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.end('Method Not Allowed\n');
            }
        });
        this.server.listen(8443);
        console.log('Server running on port 8443');
    }

}
