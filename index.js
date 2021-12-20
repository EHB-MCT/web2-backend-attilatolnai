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

//get all fleamarket data from dataMarket
app.get('/dataMarket', async (req, res) => {
    try{
      await client.connect();
      //retrieve all data from the collection "fleamarkets" from the database "courseProject"
      const colli = client.db('courseProject').collection('fleamarkets');
      const chs = await colli.find({}).toArray();

      //Sending the data from the collection with the response
      res.status(200).send(chs);
    }catch(error){
      //If there is an error this will catch it
      console.log(error)
      res.status(500).send({
        error: 'Something went wrong',
        value: error
      });
    }finally{
      await client.close();
    }
    //example data:
    //let testMarket = {
    //     name: "Fleamarket Brussel",
    //     location: "Bd Sylvain Dupuis 433, 1070 Brussels",
    //     date: "19/12/2021",
    //     time: "7h - 15h"
    // }
    // res.send(testMarket)
    //res.send('you are getting data from testMarket!')
  });

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

  app.post('/saveMarket', (req,res) =>{
    console.log(req.body);
    res.send(`Data received with id: ${req.body._id}, name: ${req.body.name}, 
    location: ${req.body.location}, date: ${req.body.date} and time: ${req.body.time} !`)
  });

  app.post('/savePerson', (req,res) =>{
    console.log(req.body);
    res.send(`Data received with id: ${req.body._id}, pin name: ${req.body.pin_name}, 
    tags: ${req.body.tags}, description: ${req.body.description} and pin location: ${req.body.pin_location} !`)
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})