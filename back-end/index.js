const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000
const fs = require('fs');

let rawdata = fs.readFileSync('./data/dictionary.json');
let dict = JSON.parse(rawdata);
console.log(dict);

app.use(bodyParser.json())

function success(res, payload) {
  return res.status(200).json(payload)
}

app.get("/game", async (req, res, next) => {
  try {

    let min = 0;
    let max = dict.length;
    let trueIndex = getRandomInt(min, max);
    let fakeIndex1 = getRandomInt(min, max);
    let fakeIndex2 = getRandomInt(min, max);

    max = 3;
    let word = dict[trueIndex]["WORD1"];
    let words = [dict[trueIndex]["WORD2"], dict[fakeIndex1]["WORD2"], dict[fakeIndex2]["WORD2"]];
    let randSwap = getRandomInt(min, max);
    [words[0], words[randSwap]] = [words[randSwap], words[0]];

    let obj = {"words": words, "trueIndex": randSwap, "trueWord": word};
    console.log(obj);
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