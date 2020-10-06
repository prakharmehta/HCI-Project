const express = require("express");
const { spawn } = require("child_process");
const translate = require("google-translate-api");
const path = require("path");

const app = express();
const port = 3000;

// app.set('views','./views');
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  translate("I spea Dutch!", { from: "en", to: "nl" })
    .then((res) => {
      console.log(res.text);
      //=> Ik spreek Nederlands!
      console.log(res.from.text.autoCorrected);
      //=> true
      console.log(res.from.text.value);
      //=> I [speak] Dutch!
      console.log(res.from.text.didYouMean);
      //=> false
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/tts", (req, res) => {
  let dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", [
    "./public/scripts/text_summarization.py",
    req.query.filename,
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
