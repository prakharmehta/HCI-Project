const express = require("express");
const { spawn } = require("child_process");
// const translate = require("google-translate-api");
const path = require("path");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const port = process.env.PORT || 5000;

// app.set('views','./views');
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("monumentSearch");
});

app.post("/tts", urlencodedParser, async (req, res) => {
  // if(!req.body) return res.
  let textToTranslate
  if (req.body.monument.toString().toLowerCase() == 'taj mahal') {
    textToTranslate = "./models/Taj_Mahal.txt"
  }
  else if (req.body.monument.toString().toLowerCase() == 'machu pichu') {
    textToTranslate = "./models/Machu_Pichu.txt"
  }
  else if (req.body.monument.toString().toLowerCase() == 'christ the redeemer') {
    textToTranslate = "./models/Christ_the_Redeemer.txt"
  }
  console.log(textToTranslate);
  console.log(req.body.languages.split("-")[0]);

  const python1 = await spawn("python", [
    "./public/scripts/textTranslation.py",
    textToTranslate, req.body.languages.split("-")[0]
  ]);
  let translatedText
  let translatedTextURI = "./models/translationOutput/translatedText.txt"
  await python1.stdout.on("data", (data) => {
    console.log("Pipe data from python script ...");
    translatedText = data.toString();
  })

  // console.log(req.body.languages);
  let dataToSend;
  // spawn new child process to call the python script
  const python2 = await spawn("python", [
    "./public/scripts/text_summarization.py",
    translatedTextURI
  ]);


  // collect data from script
  python2.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();


    console.log(dataToSend);
    res.render("textToSpeech", {
      textToBeSummarized: dataToSend,
      languageCode: req.body.languages
    });
  });
  python2.stderr.on("data", (data) => console.log(data.toString()));
  // in close event we are sure that stream from child process is closed
  python2.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });
});

app.post('/arModel', urlencodedParser, (req, res) => {
  console.log(req.body.monument_ar);
  monument = req.body.monument_ar;
  res.render("arModel", { model: monument });
})

app.get('/info', (req, res) => {
  res.render("moreInfo")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
