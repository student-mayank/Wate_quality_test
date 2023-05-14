const express = require("express");
const http = require("http");
const https = require("https");
const dotenv = require("dotenv");
const app = express();
const server = http.createServer(app);
dotenv.config();
app.use(express.static("public"));
server.listen(process.env.PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server in running on port ${process.env.PORT}`);
  }
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("connection!");

  https.get(process.env.URL, (response) => {
    response.on("data", (data) => {
      const dataOut = JSON.parse(data);

      const output = {
        tds: dataOut.feeds[0].field1,
        temperature: dataOut.feeds[0].field2,
        ec: dataOut.feeds[0].field3,
      };
      console.log(output);
      socket.emit("data", output);
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html", (err) => {
    console.log(err);
  });
});
