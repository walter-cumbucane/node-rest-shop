#!/usr/bin/env node

//IMports the http module
const http = require('http');

//IMports the app variable
const app = require('./app');

//To acess the port environment variable in node
const port = process.env.PORT;

//Creates a server
const server = http.createServer(app);

//Starts the listening
server.listen(port);
