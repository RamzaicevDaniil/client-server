const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000
const fs = require('fs');

let rawdata = fs.readFileSync('./data/dictionaryNew.json');
let dict = JSON.parse(rawdata);

app.use(bodyParser.json())

function success(res, payload) {
  return res.status(200).json(payload)
}

app.get("/game", async (req, res, next) => {
  try {

    let min = 0;
    let max = dict.length;
    let words = [];
    let fakeIndexes = [];
    let i = 0;
    while (i < 3) {
      let fi = getRandomInt(min, max);
      fakeIndexes.push(fi);
      words.push(dict[fi]["WORD2"]);
      i++;
    }
    max = 3;
    let word = dict[fakeIndexes[0]]["WORD1"];
    let randSwap = getRandomInt(min, max);
    [words[0], words[randSwap]] = [words[randSwap], words[0]];

    let obj = {"words": words, "trueIndex": randSwap, "trueWord": word};
    console.log(obj);
    // В этот хэдер надо записывать хост фронта
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.status(200);
    res.send(obj)
    return obj;

  } catch (err) {
    next({ status: 400, message: "failed to get todos" })
  }
})





app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || "there was an error processing request",
  })
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }