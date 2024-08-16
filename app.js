'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');

const io = require('socket.io')(http); //Vill köra socket.io på http server
 
// Framtida middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/potatis3',express.static(__dirname + '/Klientfiler'));
app.use('/node_modules',express.static(__dirname + '/node_modules'));


 
//lyssnar på port 3024
http.listen(3024, function(){
    console.log("Servern är igång!");
});
 
 
//kontrollerar om kaka finns eller inte. Om kaka finns skickas filen index.html om den inte finns skickas loggaIn.html 
app.get('/', function(req, res){
 
    let cookie = req.cookies.namn
 
    if(cookie === undefined){
        //leverera logga in html
        res.sendFile(__dirname + '/loggain.html');
       
    }
    else{
        //leverera index.html
        res.sendFile(__dirname + '/index.html');
      
    }
});
 
//sätter kaka vid logga in samt validera längden av namnet. Skickas tillbaka till '/'
app.post('/', function(req, res){

let mittNamn = req.body.nickname;

if(mittNamn.length < 3){
  

    res.redirect('/');
}

else{


res.cookie('namn', req.body.nickname, {maxAge: 1000 * 60 * 5000});

res.redirect('/'); }

});


//connectar till forumet, hämtar kaka, anropar funktion som fixar användarnamnet

io.on('connection', (socket) => {

let cookieString = socket.handshake.headers.cookie;

let cookielist = parsedes(cookieString);



socket.on("nyttMed", function(data){
//skickar data till clientscrtit filen
    io.emit("inlagg", {
        'meddelande' : data.message,
        'namn' : cookielist.namn
} )});


});



// gör favicon användbar
app.get('/favicon.ico', function(req,res) {
    res.sendFile(__dirname + '/favicon.ico'); //bilden vid hemside namnet
});

//funktionen som gör användarnamnet bra. tagen från w2 
function parsedes (rc) {

    let list = {};
    //*************************************************************************************** */
    //Funktion för att parsa cookie-sträng  
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    //Hämtad ifrån: https://stackoverflow.com/questions/45473574/node-js-cookies-not-working
    //*************************************************************************************** */
    return list;
}



