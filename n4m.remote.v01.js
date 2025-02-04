const fs = require("fs");
const http = require("http");
const path = require("path");
const maxAPI = require("max-api");
const port = 2112;

const requestHandler = (request, response) => {
    // Add CORS headers to allow requests from other origins (like 127.0.0.1)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }

    // Handle POST request
    if (request.method === "POST") {
        let body = [];
        request.on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            try {
                let points = JSON.parse(body);
                maxAPI.outlet(points.message);  // This sends the received message to Max
            } catch (err) {
                response.statusCode = 500;
                response.end(`Error: ${err}.`);
            }
        });
        response.end("success");
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        console.log("something bad happened", err);
    }
    console.log(`server is listening on ${port}`);
});
