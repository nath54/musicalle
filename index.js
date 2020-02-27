

function jouer(){
    var nbc=document.getElementById("nbc").value;
    var nbn=document.getElementById("nbn").value;
    var vitd=document.getElementById("vitd").value;
    
    var page="game.html?"+nbc+"&"+nbn+"&"+vitd;
    document.location.href=page;
}