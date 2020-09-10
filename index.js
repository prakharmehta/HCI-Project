const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000

// app.set('views','./views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
 
  res.send("Hey")
 });

app.get('/tts', (req, res) => {
    let dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['scripts/text_summarization.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
     console.log(dataToSend);
     res.render('textToSpeech', {
        textToBeSummarized: dataToSend
    })
    });
    python.stderr.on('data',(data) => console.log(data.toString()))
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    })
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))