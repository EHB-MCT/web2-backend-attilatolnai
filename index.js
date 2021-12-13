const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/info.html')
})

app.get('/dataMarket', (req, res) => {
    //API data I want for each fleamarket
    let testMarket = {
        name: "Fleamarket Brussel",
        location: "Bd Sylvain Dupuis 433, 1070 Brussels",
        date: "19/12/2021",
        time: "7h - 15h"
    }
    res.send(testMarket)
    //res.send('you are getting data from testMarket!')
  })

  app.get('/dataPerson', (req, res) => {
    //API data I want for each fleamarket
    let testPerson = {
        pin_name: "lot 1",
        tags: "games, books, bike, clothes",
        description: "A lot of videogames, some children books, a kid sized bike and M sized clothes",
        pin_location: "50.83801363908659, 4.2867502898428445"
    }
    res.send(testPerson)
    //res.send('you are getting data from testPerson!')
  })

  app.post('/savePerson', (req,res) =>{
    console.log(req.body);
    res.send(`Data received with ${req.body.pin_name}!`)
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})