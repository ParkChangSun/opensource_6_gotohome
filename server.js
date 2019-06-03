var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.locals.pretty = true;
app.set('views', './views');
app.engine('html', require('ejs').renderFile);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false }));

app.use(express.static(__dirname + '/public'));

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aeuna',
    database: 'my_db'
});

connection.connect(function(err){
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Success DB connection');
})

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res){
  res.render('index1.html',{ alert:false});
});

app.post('/',function(req,res){
  var name = req.body.name;
  var pwd = req.body.pwd;

  var sql = `SELECT * FROM user_info WHERE username = ?`;
  connection.query(sql,[name],function(error,results,fields){
      if (results.length==0){
          res.render('index1.html',{ alert:true});
      }
      else {
          
          var db_pwd = results[0].password;
          if(pwd == db_pwd){
              res.render('index.html');
          }
          else{
              res.render('index1.html', { alert:true});
          }
      }
  });
});

app.get('/index', function(req, res){ 
  res.render('index.html');
});

app.get('/register', function(req, res){
  res.render('register.html');
});

app.post('/register', function(req,res){
  var name = req.body.name;
  var pwd = req.body.pwd;
  var pwdconf = req.body.pwdconf; 

var sql = `INSERT INTO user_info VALUES (?,?)`;
connection.query(sql,[name,pwd],function(error,results,fields){
    console.log(results);
});
res.redirect('/');
});


io.on('connection', function(socket){
	console.log('A user connected');

	socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
  	console.log('message: ' + msg);
  	io.emit('chat message', msg);
  });
});

server.listen(3000, function(){
	console.log('Connected 3000');
});