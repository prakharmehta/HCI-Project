const express = require("express");
const { spawn } = require("child_process");
const translate = require("google-translate-api");
const path = require("path");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const port = 3000;

// app.set('views','./views');
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("monumentSearch");
});

app.post("/tts", urlencodedParser, (req, res) => {
  // if(!req.body) return res.
  let dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", [
    "./public/scripts/text_summarization.py",
    req.body.monument,
  ]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();


    console.log(dataToSend);
    res.render("textToSpeech", {
      textToBeSummarized: dataToSend,
    });
  });
  python.stderr.on("data", (data) => console.log(data.toString()));
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });
});

app.get('/arModel', (req, res) => {
  res.render("arModel");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
