const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public")); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log("server on " + port);
console.log("he", process.env);
