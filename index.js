const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require('mongodb');
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


//----------------------------------------GET-------------------------------------------------------------
//get all fleamarket data from the database => DONE AND WORKING
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
    //let testMarket = {name: "Fleamarket Brussel", location: "Bd Sylvain Dupuis 433, 1070 Brussels", date: "19/12/2021", time: "7h - 15h"}
    //res.send(testMarket)
    //res.send('you are getting data from testMarket!')
  });
  //get all persons data from the database => DONE AND WORKING
  app.get('/dataPerson', async (req, res) => {
    try{
      await client.connect();
      //retrieve all data from the collection "persons" from the database "courseProject"
      const colli = client.db('courseProject').collection('persons');
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
    //let testPerson = {pin_name: "lot 1", tags: "games, books, bike, clothes", description: "A lot of videogames, some children books, a kid sized bike and M sized clothes", pin_location: "50.83801363908659, 4.2867502898428445"}
    //res.send(testPerson)
    //res.send('you are getting data from testPerson!')
  });
  //get data by id
  app.get('/dataMarket/:id', async (req,res) => {
    //id is located in the query: req.params.id
    try{
        //connect to the db
        await client.connect();

        //retrieve the boardgame collection data
        const colli = client.db('courseProject').collection('fleamarkets');

        //only look for a challenge with this ID
        const query = { _id: ObjectId(req.params.id)};

        const market = await colli.findOne(query);

        if(market){
            //Send back the file
              res.status(200).send(market);
            return;
        }else{
            res.status(400).send(`Fleamarket with id:${req.params.id} could not be found ` );
        }
      
    }catch(error){
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    }finally {
        await client.close();
    }
});

//----------------------------------------POST-------------------------------------------------------------
  //create a new fleamarket and add it to the database => DONE AND WORKING
  app.post('/saveMarket', async (req,res) =>{
    if(!req.body.name || !req.body.location || !req.body.date || !req.body.time){
      res.status(400).send('Bad request: missing name, location, date or time');
      return;
    }
    try{
      await client.connect();
       //retrieve all data from the collection "fleamarkets" from the database "courseProject"
       const colli = client.db('courseProject').collection('fleamarkets');
       //check if there isn't a fleamarket with the same name and location
       const bg = await colli.findOne({name: req.body.name, location: req.body.location});
       if(bg){
         res.status(400).send(`Bad request: There is already a fleamarket with the name ${req.body.name} in ${req.body.location}`);
         return;
       }
       //create a new fleamarket
       let newMarket = {
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        time: req.body.time
       }
       //Insert the new fleamarket into the database
       let insertResult = await colli.insertOne(newMarket);
       //Send back a successfull message if inserted successfully
       res.status(201).json(newMarket);
       return;
    }catch(error){
      console.log(error);
      res.status(500).send({
        error: 'Something went wrong',
        value: error
      });
    }finally{
      await client.close();
    }
    //console.log(req.body);
    //res.send(`Data received with id: ${req.body._id}, name: ${req.body.name}, location: ${req.body.location}, date: ${req.body.date} and time: ${req.body.time} !`)
  });
  //create a new person and add it to the database => DONE AND WORKING
  app.post('/savePerson', async (req,res) =>{
    if(!req.body.pin_name || !req.body.tags || !req.body.description || !req.body.pin_location){
      res.status(400).send('Bad request: missing pin name, tags, description or pin location');
      return;
    }
    try{
      await client.connect();
       //retrieve all data from the collection "persons" from the database "courseProject"
       const colli = client.db('courseProject').collection('persons');
       //check if there isn't a person with the same pin name and pin location
       const bg = await colli.findOne({name: req.body.pin_name, location: req.body.pin_location});
       if(bg){
         res.status(400).send(`Bad request: There is already a pin with the name ${req.body.name} at ${req.body.location}`);
         return;
       }
       //create a new person
       let newPerson = {
        pin_name: req.body.pin_name,
        tags: req.body.tags,
        description: req.body.description,
        pin_location: req.body.pin_location
       }
       //Insert the new person into the database
       let insertResult = await colli.insertOne(newPerson);
       //Send back a successfull message if inserted successfully
       res.status(201).json(newPerson);
       return;
    }catch(error){
      console.log(error);
      res.status(500).send({
        error: 'Something went wrong',
        value: error
      });
    }finally{
      await client.close();
    }
    //console.log(req.body);
    //res.send(`Data received with id: ${req.body._id}, pin name: ${req.body.pin_name}, 
    //tags: ${req.body.tags}, description: ${req.body.description} and pin location: ${req.body.pin_location} !`)
  });

  //----------------------------------------UPDATE-------------------------------------------------------------
  app.put('/dataMarket/:id', async (req,res) => {
    if(!req.body.name || !req.body.location || !req.body.date || !req.body.time){
      res.status(400).send('Bad request: missing name, location, date or time');
      return;
    }
    if(!req.params.id){
      res.status(400).send('Bad request: missing id');
      return;
    }
    try{
      await client.connect();
      const colli = client.db('courseProject').collection('fleamarkets');
      const bg = await colli.findOne({_id: ObjectId(req.params.id)});
      if(!bg){
      res.status(400).send(`Bad request: fleamarket with id ${req.params.id} does not exist`);
      return;
      }

      let newMarket = {
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        time: req.body.time
       }
       let updateResult = await colli.updateOne({_id: ObjectId(req.params.id)},
       {$set: newMarket});

       res.status(201).json(updateResult);
       return;
    }catch(error){
      console.log(error);
      res.status(500).send({
          error: 'Something went wrong',
          value: error
      });
    }finally{
      await client.close();
    }
  });

  //app.update('/updatePerson', async (req,res) => {})

  //----------------------------------------DELETE-------------------------------------------------------------
  //app.delete('/deleteMarket', async (req,res) => {})
  //app.delete('/deletePerson', async (req,res) => {})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})