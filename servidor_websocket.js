// Servidor http + websocket
const fs = require("fs");
const net = require("net");
const dgram = require("dgram");
const enchufe_udp = dgram.createSocket("udp4");
const SerialPort = require("serialport");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(1000, () => {
  console.log("listening on 1000");
});

// Recibo TCP
var enchufe_tcp = new net.Socket();
// Conecta con sensor
enchufe_tcp.connect(3000, "192.168.1.3");

enchufe_tcp.on("data", (data) => {
  data = data.toString();
  console.log("sensor temperatura: " + data);
  io.emit("sensor_temperatura", data);
});

// Recibo UDP
enchufe_udp.on("message", function (msg, info) {
  msg = msg.toString("utf8");
  console.log("sensor calidad: " + msg);
  io.emit("sensor_calidad", msg);
});

enchufe_udp.bind("2001", "192.168.1.3");


// Recibo Serial
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort("COM4");
const parser = new Readline();
port.pipe(parser);
parser.on("data", (data) => {
  console.log("sensor arduino: " + data);
  io.emit("sensor_arduino", data);
});
port.write("arduino conectado\n");
