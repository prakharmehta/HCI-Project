const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000

app.set('views','./views');
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
 
 var dataToSend;
 // spawn new child process to call the python script
 const python = spawn('python', ['scripts/script1.py']);
 // collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  dataToSend = data.toString();
 });
 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
 // send data to browser
 res.send(dataToSend)
 });
 
})

app.get('/tts', (req, res) => {
    res.render('textToSpeech.ejs')
})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))