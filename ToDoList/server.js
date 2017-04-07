var express = require('express');
var app = express();
var fs = require("fs");
var user_id=0;
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(express.static('public'));

app.use(bodyParser.json());

  app.use(session({
 secret: "ok",
 resave: true,
 saveUninitialized: false,

}));

app.get('/', function (req, res) {
 res.sendFile( __dirname + "/" + "Registeration.html" );

 
})

  
  app.get('/To-doList.html', function (req, res) {
    if(req.session.email){
      res.sendFile( __dirname + "/" + "To-doList.html" );
    }
    else{
      res.sendFile( __dirname + "/" + "Registeration.html" );
    }
})

app.post('/ajaxRequest', function(req, res){
  a=req.body.allTasksArray;
  b=req.body.inprogressArray;
  c=req.body. completedArray;
  d=req.body.archivedArray;
  e=req.body.idbutton;
  f=req.body.idtask;
  g=req.body.state;
  

  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     data = JSON.parse( data );
   
     data[req.session.authenticatedUser].allTasksArray = a;
     data[req.session.authenticatedUser].inprogressArray = b;
     data[req.session.authenticatedUser].completedArray=c;
     data[req.session.authenticatedUser].archivedArray=d;
     data[req.session.authenticatedUser].idbutton=e;
     data[req.session.authenticatedUser].idtask=f;
     data[req.session.authenticatedUser].state=g;

     //console.log(data[authenticatedUser].name +" "+ data[authenticatedUser].allTasksArray[1]);
     fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data), function (err) {
        if (err) return console.log(err +"Json file not found.");
        
      });

  res.contentType('json');
  res.send({ some: JSON.stringify({response:'json'}) });
});
})
app.post('/register', urlencodedParser, function (req, res) {
  username = req.body.username;
  req.body.username="";
  email=req.body.email;
  req.body.email="";
  password = req.body.password;
  req.body.password="";

fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    if (err) return console.log(err +"Json file not found.");
    else{
    data = JSON.parse( data );
    var flag = 0;
    for (var user in data) {
      if(email == data[user].email){

      flag = 1;
    
       break;}
      
    
      else{
      flag = 0; 
      }
    }
if(flag == 1){
  
res.redirect("/RE404.html");
       app.get("/RE404.html", function (req, res) {
       
      res.sendFile( __dirname + "/" + "RE404.html" );

     })
      

res.end();
  
}

else{
 for (var user in data) {
  if(data[user].id !=null){
user_id=data[user].id;
}

 }

user_id++;




var user = {
      "user": {
      "name" : username,
      "password" : password,
      "email" : email ,
      "id": user_id,
      "allTasksArray":"",
      "inprogressArray":"",
      "completedArray":"",
      "archivedArray":"",
      "idbutton":"",
      "idtask":"",
      "state":"",
} }
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user"+user_id]=user["user"];
        
      req.session.authenticatedUser = "user"+user_id;
       user_id++;
    
  req.session.email = email;
  req.session.save(function(){console.log("saved")});
    res.redirect("/Registeration.html");
       app.get('/Registeration.html', function (req, res) {
      res.sendFile( __dirname + "/" + "Registeration.html" );
})
       res.end( JSON.stringify(data));

      
  

       fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data), function (err) {
          if (err) return console.log(err);
         // console.log(JSON.stringify(data));
        })

    });

   
  
}
    }
});

})


app.post('/signout', urlencodedParser, function (req, res) {
 
      req.session.destroy();
      res.redirect("/Registeration.html");
       app.get('/Registeration.html', function (req, res) {
      res.sendFile( __dirname + "/" + "Registeration.html" );
});

   


  })
    
app.post('/signin', urlencodedParser, function (req, res) {

  email = req.body.email;
  password = req.body.password;
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    
        if (err) return console.log(err +"Json file not found.");
   else{
    data = JSON.parse( data );
    var flag = 0;
    for (var user in data) {
      if( email == data[user].email){
      flag=1;
      if( password == data[user].password){
    flag = 2; req.session.authenticatedUser = user;
  req.session.save(function(){console.log("saved")});

     break;}
   break;}
      else{flag = 0;  }
    }
    if(flag == 2){
     fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, tables_data) {
    
     tables_data = JSON.parse(tables_data);
   
    req.session.email=email;
  req.session.save(function(){console.log("saved")});
    res.redirect("/To-doList.html");
  app.get('/To-doList.html', function (req, res) {
      res.sendFile( __dirname + "/" + "To-doList.html" );
})
       res.end();
      });
     

    }
    else if(flag ==1){
      
       res.redirect("/SP404.html");  
       app.get("/SP404.html", function (req, res) {
       
      res.sendFile( __dirname + "/" + "SP404.html" );

     })
      

res.end();
  
  }
  else if(flag ==0){
    res.redirect("/SU404.html");
       app.get("/SU404.html", function (req, res) {
       
      res.sendFile( __dirname + "/" + "SU404.html" );

     })
      

res.end();
  }
   }
  });
  
 })
 
app.post('/create', function(req, res){
fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, tables_data) {
  if (err) return console.log(err +"Json file not found.");
  else{
        tables_data = JSON.parse(tables_data);
    var ok ={
  allTasksArray:tables_data[req.session.authenticatedUser].allTasksArray,
  inprogressArray:tables_data[req.session.authenticatedUser].inprogressArray,
  completedArray:tables_data[req.session.authenticatedUser].completedArray,
  archivedArray:tables_data[req.session.authenticatedUser].archivedArray,
  idbutton:tables_data[req.session.authenticatedUser].idbutton,
  idtask:tables_data[req.session.authenticatedUser].idtask,
  state:tables_data[req.session.authenticatedUser].state,
  name:tables_data[req.session.authenticatedUser].name
}
  
     
       res.send(ok);
        fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(tables_data), function (err) {
          if (err) return console.log(err);
        })
  
}
})
})
var server = app.listen(8081, function () {
 var host = server.address().address
 var port = server.address().port
  
  //url http://localhost:8081/
 console.log("Example app listening at http://%s:%s", host, port);
})
