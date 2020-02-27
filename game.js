
const canvas=document.getElementById("can");
const ctx=canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();

var parameters = location.search.substring(1).split("&");

function rch(liste){
	return liste[Math.random()*liste.length];
}

function rand(a,b){
	return(parseInt(a+Math.random()*(b-a)));
}


const tex=canvas.width;
const tey=canvas.height;
var encour=true;

var brx=300
var bry=500
var brtx=150
var brty=75

var dt=new Date();
var t1=dt.getTime();

var fps=0;

var clbg=[0,0,0];
var nbc=parseInt(parameters[0]);
var vitd=parseInt(parameters[2]);
var dup=dt.getTime();
var tup=0.1;
var mode="normal";
var nbns=parseInt(parameters[1]);
var score=0;
var cln=[rand(0,255),rand(0,255),rand(0,255)];

//chargement
function chargement(){
    ctx.font = "50px Arial";
    ctx.fillStyle="rgb(0,0,200)";
    ctx.fillText("chargement...", 30, 200);
}
window.requestAnimationFrame( chargement );
//
var sons=[]
var dirsons="sons/"
for(x=24;x<109;x++){
	sons.push(dirsons+x+".mp3")
}

//

notes=[]


function suppr_note(r){
	notes.splice(r,1);
}

function create_note(){
	if(notes.length>=1){
		dny=notes[notes.length-1].y;
    }
    else{ dny=0; }
	ntx=parseInt(tex/nbc);
	nx=parseInt(parseInt(Math.random()*nbc)*ntx);
    nty=250
	ns=rch(sons);
	for(m=0;m<3;m++){
		cln[m]+=rand(-10,10);
		if(cln[m]>255){ cln[m]=255; }
		if(cln[m]<0){ cln[m]=0; }
	}
	ny=dny-rand(nty,2.5*nty);
	ncl=cln
	n={x:nx,y:ny,tx:ntx,ty:nty,son:ns,cl:ncl};
    notes.push( n );
}

function charger(){
	for(w=0;w<nbns;w++){
		create_note();
	}
}

function tocl(cl){ return "rgb("+cl[0]+","+cl[1]+","+cl[2]+")"; }

function update(){
	var dt=new Date();
	if(dt.getTime()-dup>=tup){
		dup=dt.getTime();
		var torem=[];
		var nbn=0;
	    for( n of notes ){
		    n.y+=vitd;
		    if(n.y>=tey){
			    torem.push(notes.indexOf(n));
			}
	    }
	    
	    for( r of torem ){
		    suppr_note(r)
		}
		if(mode=="infinite"){
		    for( r of torem){
                create_note();
            }
        }
        if( notes.length==0 ){
		    encour=false;
        }
        for(w=0;w<3;w++){
            clbg[w]-=3;
            if( clbg[w] < 0 ){ clbg[w]=0; }
        }
	}
	
	
}

function aff(){
	//nettoyage de l'ecran
	ctx.fillStyle=tocl(clbg);
	//alert(ctx.fillStyle);
	ctx.fillRect( 0 , 0 , tex , tey );
	for(n of notes){
		if(n.y+n.ty>0 && n.y<tey){
		    ctx.fillStyle=tocl(n.cl);
		    ctx.fillRect(n.x,n.y,n.tx,n.ty);
		    ctx.strokeStyle=tocl([0,0,0]);
		    ctx.strokeRect(n.x,n.y,n.tx,n.ty);
		    //alert(n);
	    }
    }
    //affichage des fps
	ctx.font = "20px Arial";
	ctx.fillStyle="rgb(200,200,200)";
    ctx.fillText(fps+"", 40, 30);
    //affichage des fps
	ctx.font = "20px Arial";
	ctx.fillStyle="rgb(200,200,200)";
    ctx.fillText(notes.length+"", 40, 90);
}

function getCursorPosition(canvas, event) {
	const x = (event.clientX - rect.left)/rect.width*tex;
    const y = (event.clientY - rect.top)/rect.height*tey;
	if(encour){
   // alert(rect.width+" "+rect.height);
 //   alert(x+" / "+tex+" - "+y+" / "+tey);
        var torem=[];
        for( n of notes ){
            if( x>=n.x && x<=n.x+n.tx && y>=n.y && y<=n.y+n.ty ){
                new Audio(n.son).play();
                torem.push( notes.indexOf(n) );
                score+=1;
                for(w=0;w<3;w++){
                    clbg[w]+=50;
                    if(clbg[w]>255){ clbg[w]=255; }
                }
            }
        }
        for( r of torem ){
            suppr_note(r);
        }
        if(mode=="infinite"){
            for( r of torem){
                create_note();
            }
        }
    }
    else{
        
        if( x>=brx && y>=bry && x<=brx+brtx && y<=bry+brty){
            var page="index.html";
            //var page="game.html?"+nbc+"&"+nbns+"&"+vitd;
            document.location.href=page;
        }
    }
}

canvas.addEventListener('mouseup', function(e) {
    getCursorPosition(canvas, e)
})



function boucle(){
	var dt=new Date();
    var t1=dt.getTime();
    update();
	aff();
	var dt=new Date();
	var tt=(dt.getTime()-t1)/1000;
	if(tt!=0){ fps=1./tt; }
	//boucle
	if(encour){ window.requestAnimationFrame( boucle ); }
	else{
		 var pc=score/nbns*100.0;
		 pcc=pc+"";
		 if(pcc.length>6){
			var pp="";
			for(w=0;w<6;w++){
				pp+=pcc[w];
		    }
		    //alert(pp);
		    pc=pp;
		 }
		 else{
		     pc=pcc;
		 }
		 ctx.fillStyle="rgb(0,0,0)";
		 ctx.fillRect(0,0,tex,tey);
		 ctx.fillStyle="rgb(0,100,0)";
		 ctx.fillRect(brx,bry,brtx,brty);
		 ctx.font = "30px Arial";
         ctx.fillStyle="rgb(200,200,200)";
         ctx.fillText("La partie est finie", 30, 200);
         ctx.fillText("Performance : "+pc+" %", 30, 250);
         ctx.fillText("Notes : "+score+"/"+nbns,30,300);
         ctx.fillText("menu",brx+20,bry+35);
    }
}


function main(){
	if(encour){ window.requestAnimationFrame( boucle ); }
	
}

charger();
main();

