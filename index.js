const express = require("express");
const { spawn } = require("child_process");
// const translate = require("google-translate-api");
const path = require("path");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const port = process.env.PORT || 3000;

// app.set('views','./views');
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("monumentSearch");
});

app.post("/tts", urlencodedParser, async (req, res) => {
  // if(!req.body) return res.
  let textToSummarize
  if (req.body.monument.toString().toLowerCase() == 'taj mahal') {
    textToSummarize = "./models/Taj_Mahal.txt"
  }
  else if (req.body.monument.toString().toLowerCase() == 'machu pichu') {
    textToSummarize = "./models/Machu_Pichu.txt"
  }
  else if (req.body.monument.toString().toLowerCase() == 'christ the redeemer') {
    textToSummarize = "./models/Christ_the_Redeemer.txt"
  }
  console.log(textToSummarize);
  console.log(req.body.languages.split("-")[0]);

  let dataToSend;
  // spawn new child process to call the python script
  const python2 = spawn("python", [
    "./public/scripts/text_summarization.py",
    textToSummarize
  ]);


  // collect data from script
  python2.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();


    console.log(dataToSend);

    const python1 = spawn("python", [
      "./public/scripts/textTranslation.py",
      dataToSend, req.body.languages.split("-")[0]
    ]);

    let translatedText
    // let translatedTextURI = "./models/translationOutput/translatedText.txt"
    python1.stdout.on("data", (data) => {
      console.log("Pipe data from python script ...");
      translatedText = data.toString();

      res.render("textToSpeech", {
        textToBeSummarized: translatedText,
        languageCode: req.body.languages
      });
    });

  
  })

  // console.log(req.body.languages);
  
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
