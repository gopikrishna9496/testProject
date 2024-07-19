const express = require('express')
const app = express();
const port = 3000;
const logic = require('./logic');

app.get('/', (req, res) => {
    logic(req, function(err,response){
        if( err ){
            res.send({ status : 500 , message :  err.toString()});
        }else{
            res.send({ status : 200 , message :  response});
        }
    });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})