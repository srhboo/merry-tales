const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public")); //__dir and not _dir
app.get("/env.json", function (req, res) {
  res.send(
    Object.keys(process.env).reduce((a, k) => ((a[k] = process.env[k]), a), {})
  );
});
var port = 8000; // you can use any port
app.listen(port);
console.log("server on " + port);
