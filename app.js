var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var setting=require('./setting')();
var users=require('./users')();
var Curl = require( 'node-libcurl' ).Curl;
var bodyParser = require('body-parser');
var User = require('./users/user');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

// *** Testing Part ***

// users.add({id : 1 , chanel : 'satar'});
// users.add({id : 2 , chanel : 'mokhtar'});
// users.add({id : 3 , chanel : 'kami'});
// users.add({id : 4 , chanel : 'zari'});
// users.add({id : 5 , chanel : 'dadar'});

app.get('/users',function (req,res,next) {
    res.json({users : users.get_list()});
});

app.get('/curl',function (req,res,next) {
    var curl = new Curl();

    curl.setOpt( 'URL', setting.auth_url );
    curl.setOpt( 'FOLLOWLOCATION', true );

    curl.on( 'end', function( statusCode, body, headers ) {

        console.info( statusCode );
        console.info( '---' );
        console.info( body );
        console.info( '---' );
        console.info( this.getInfo( 'TOTAL_TIME' ) );

        this.close();
    });

    curl.on( 'error', curl.close.bind( curl ) );
    curl.perform();
    res.send('success');
    //{"result":{"result":-1,"messages":["Invalid User"]}}
});

app.get('/register/:userid/:token', function(req, res, next) {
    users.add({id : req.params.userid , chanel : req.params.token});
    res.json({result:1 , chanel: req.params.token});
}); // end testing part

/*
[post] .../fire
password    // app password
user_id     // id of user
data        // data for send to user
 */
app.post('/fire',function (req,res,next) { 
    if(req.body.password == setting.password){
        var user = users.find(req.body.user_id);
        if(user !=null){
            console.log(user.chanel , req.body.data);
            io.emit(user.chanel,{ type: 1 , data : req.body.data});
            res.json({result: 'success'});
        }
        else
            res.json({result: 'user error'});
    }
    else
        res.json({result: 'password error'});
});

/*
io.connect( [server adress] , {query : 'id=[user id]'});
 */

io.on('connect',function (socket) {
    var user=users.find(socket.handshake.query.id);
    if(user != null){
        if(user.status == 'active'){
            socket.on(user.chanel,function(message) {
                //com from user
            });
            socket.user=user;
            socket.on('disconnect',function () {
                users.remove(socket.user.id);
            });
            io.emit(user.chanel,{type:'message',data:'welcome'});
            return;
        }else{
            user.chanel = socket.handshake.query.token;
        }
    }else{
        user = new User();
        user.id = socket.handshake.query.id;
        user.chanel = socket.handshake.query.token;
        socket.user = user;
        user.socket = socket;
        users.add(user);
    }
    
    // curl to adolpage for check token is valid or no
    var curl = new Curl();
    var url= setting.auth_url + '?token='+ user.chanel;
    console.log(url);
    curl.setOpt( 'URL', url );
    curl.setOpt( 'FOLLOWLOCATION', true );

    curl.on( 'end', function( statusCode, body, headers ) {
        console.log(body);
        if( statusCode == 200 ){
            var result=JSON.parse(body);
            if(result.result.result == 1){
                users.active(result.result.user.id);
            }
        }

        this.close();
    });

    curl.on( 'error', curl.close.bind( curl ) );
    curl.perform()
});


server.listen(80);