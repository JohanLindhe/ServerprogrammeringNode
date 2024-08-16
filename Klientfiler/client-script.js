'use strict';

let socket = io();

window.addEventListener('load', function(){
console.log("potatis");
//lyssnar på klick
this.document.querySelector(".btn").addEventListener('click', skickaInlägg);
});


function skickaInlägg(){

   
    let input = document.querySelector("#msg").value;
//kontrollerar textlängd
    if(input.length < 2){
    

    let errPlats = document.querySelector("#errorMsg");

    errPlats.textContent = "för kort inlägg";
    
    } else {
        //tömmer inputfältet
        //tar bort evt felmeddelande
        //
    document.querySelector("#msg").value = null;
    document.querySelector("#errorMsg").textContent = "";
    socket.emit("nyttMed", {"message" : input}); //skickar input så att app.js tar emot det
    
}}

socket.on("inlagg", function(data){
console.log("kom åtminstonde hit");

//sätter datum
let datum = new Date().toISOString().split("T")[0];
let dTextNode = document.createTextNode(datum);

let pTagg = document.createElement("p");
pTagg.appendChild(dTextNode);

let inlaggPlats = document.querySelector("#flow");

let cardDiv = document.createElement("div");
let namn  = document.createElement("h3");

namn.textContent =  data.namn

let allaMeddelande = document.createElement("p");
allaMeddelande.textContent = data.meddelande;


cardDiv.appendChild(namn);
cardDiv.appendChild(allaMeddelande);
cardDiv.appendChild(pTagg);

cardDiv.style.paddingTop = "20px";

inlaggPlats.appendChild(cardDiv);

});




