const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Working on localhost!')
})

app.get('/data', (req, res) => {
    let testMarket = {
        //fleamarket
        name: "Fleamarket Brussel",
        location: "Bd Sylvain Dupuis 433, 1070 Brussels",
        date: "19/12/2021",
        time: "7h - 15h"
    }
        //person
        //pin_name: "lot 1",
        //tags: "games, books, bike, clothes",
        //description: "A lot of videogames, some children books, a kid sized bike and M sized clothes",
        //pin_location: "50.83801363908659, 4.2867502898428445"

    res.send(testMarket)
    //res.send('you are getting data!')
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})