
console.log("Rammstein");
var express = require('express');
var body_parser = require('body-parser');
var path = require('path');
var express_validator = require('express-validator');

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('banddb', ['band'])

var app = express(); 

// var logger = function(res, res, next){
//     console.log('Logging...');
//     next();

// }

// app.use(logger);

/**
 * Body Parser Middelware
 */
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/**
 * Set Static Path
 */
app.use(express.static(path.join(__dirname,'public')));

app.use(function(req, res, next){
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
 
     // Pass to next layer of middleware
    //  next();
    res.locals.errors = null;
    next();
})

//Express Validator
app.use(express_validator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam +='['+namespace.shift() +']';
        }

        return{
            parap:formParam,
            msg:msg,
            value:value
        }
    }
}))

var person = [{
    name:"Metallica",
    age:23,
},
{
    name:"Rammstein",
    age:23,
},
{
    name:"Korn",
    age:23,
}
]

app.get('/',function(req, res){
    db.band.find(function(err, docs){
        console.log(docs);
        res.render('index',{
            title:'Test passing var',
            persons:docs
        });
    });
});


app.get('/bands',function(req, res){
    db.band.find(function(err, docs){
        console.log(docs);  
        res.json(docs);
    });
       
});

app.delete('/band/delete/:id', function(req, res){
   db.band.remove({_id:ObjectId(req.params.id)}, function(err, result){
       if(err){
         console.log(err);
       }else{
          res.redirect('/');
       }
   })

});

app.post('/band/add', function(req, res){

    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('errors'); 
        res.render('index',{
            title:'Test passing var',
            persons:person,
            errors:errors
        })
            
    }else{
        var newBand = {
            name:req.body.name,
            age:req.body.id
        }
        console.log(newBand);
        db.band.insert(newBand, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');            
        });
    }
});


app.listen(7878, function(){
    console.log("Server Strarted on port 69");
});   