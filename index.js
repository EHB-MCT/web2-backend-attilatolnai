const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
require('dotenv').config();
const app = express();
const cors = require('cors');
//const port = 3000

const client =  new MongoClient(process.env.MONGO_URL);

//const app = express();
const port = process.env.PORT || 1337;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
  res.redirect('/info.html')
})

app.get('/dataMarket', (req, res) => {
    //API data I want for each fleamarket
    // let testMarket = {
    //     name: "Fleamarket Brussel",
    //     location: "Bd Sylvain Dupuis 433, 1070 Brussels",
    //     date: "19/12/2021",
    //     time: "7h - 15h"
    // }
    //res.send(testMarket)
    //res.send('you are getting data from testMarket!')
    try{
      //connect to the db
      client.connect();

      //retrieve the challenges collection data
      const colli = client.db('courseProject').collection('fleamarkets');
      const chs = colli.find({}).toArray();

      //Send back the data with the response
  res.status(200).send(chs);
  }catch(error){
      console.log(error)
      res.status(500).send({
          error: 'Something went wrong',
          value: error
      });
  }finally {
      client.close();
  }
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