const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');
canvas.width=1024;
canvas.height=576;
c.fillRect(0,0,canvas.width,canvas.height);
const gravity=0.7;
class sprite{
constructor({position,velocity,offset}){
    this.position=position;
    this.velocity=velocity;
    this.width=50;
    this.height=150;
    this.attackbox={
        position: {
         x:this.position.x,
         y:this.position.y
        },
        offset,
        width : 100,
        height : 50
        
    }
    this.health=100;
    this.isattacking;
}
draw() {
    this.attackbox.position.x=this.position.x+this.attackbox.offset.x;
    this.attackbox.position.y=this.position.y;
    c.fillStyle='red'
    c.fillRect(this.position.x,this.position.y,this.width,this.height)
    c.fillStyle='green';
    if(this.isattacking){
    c.fillRect(this.attackbox.position.x,this.attackbox.position.y,this.attackbox.width,this.attackbox.height);
    }
}

update(){
    this.draw();
    this.position.x+=this.velocity.x;
    this.position.y+=this.velocity.y;
    if(this.position.y+this.height>=canvas.height){
        this.velocity.y=0;
    }
    else{
    this.velocity.y+=gravity;
    } 
}

attack(){
    this.isattacking=true;
    setTimeout(()=>{
    this.isattacking=false;
    },100);
}

}
function rectangularcollision({rectangle1,rectangle2}){
    return(
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x 
        && rectangle1.attackbox.position.x<=rectangle2.position.x+rectangle2.width
        && rectangle1.attackbox.position.y + rectangle1.attackbox.height >=rectangle2.position.y 
        && rectangle1.attackbox.position.y<=rectangle2.position.y + rectangle2.height 
    )
}
const player=new sprite({
    position: {
        x: 0,
        y: 0
      },
      velocity: {
        x: 0,
        y: 10
      },
      offset :{
       x:0,
       y:0
      }
})

const enemy=new sprite({
    position: {
        x: 400,
        y: 100
      },
      velocity: {
        x: 0,
        y: 10
      },
      offset :{
        x:-50,
        y:0
       }
})

console.log(player);
const keys={
    d :{
        pressed:false
    },
    a :{
        pressed:false
    },
    w:{
       pressed:false
    },
    ArrowLeft :{
        pressed:false
    },
    ArrowRight :{
        pressed:false
    },
    ArrowUp : {
        pressed:false
    }


}
let lastkey
function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();
    player.velocity.x=0;
    enemy.velocity.x=0;
    if(timer>0 && player.health>0 && enemy.health>0){
    if(keys.a.pressed && lastkey=='a'){
        player.velocity.x+=-5;
    }
    else if(keys.d.pressed && lastkey=='d'){
        
        player.velocity.x+=5;
    }
    else if(keys.w.pressed && player.position.y+player.height>=canvas.height && lastkey=='w')
    {
        player.velocity.y=-20;
    }
    else if(keys.ArrowRight.pressed && lastkey=='ArrowRight'){
        enemy.velocity.x+=5;
    }
    else if(keys.ArrowLeft.pressed && lastkey=='ArrowLeft'){
        enemy.velocity.x+=-5;
    }
    else if(keys.ArrowUp.pressed && enemy.position.y+enemy.height>=canvas.height && lastkey=='ArrowUp'){
        enemy.velocity.y=-20;
    }
}
    
    if(rectangularcollision({
        rectangle1:player,
        rectangle2:enemy
    })
        &&player.isattacking){
            player.isattacking=false;
         enemy.health-=20
         document.querySelector('#enemyHealth').style.width=enemy.health+ '%';

    }
    if(rectangularcollision({
        rectangle1:enemy,
        rectangle2:player
    })
        &&enemy.isattacking){
            enemy.isattacking=false;
            player.health-=20;
            document.querySelector('#playerHealth').style.width=player.health+ '%';
    }
    if(player.health<=0 || enemy.health<=0){
        determinewinner({player,enemy,timerid});
    }


}
let timer=document.querySelector('#timer').innerHTML;
let timerid;
function decreasetimer(){
timerid=setTimeout(decreasetimer,1000);
 if(timer>0){
    timer--;
    console.log(timer);
    document.querySelector('#timer').innerHTML=timer;
 }
 if(timer==0){
    document.querySelector('#displayText').style.display="flex";
     determinewinner({player,enemy,timerid});
    }

 }

function determinewinner({player,enemy,timerid}){
    clearTimeout(timerid);
    document.querySelector('#displayText').style.display="flex";
    if(player.health===enemy.health){
        document.querySelector('#displayText').innerHTML="Tie"; 
    }
    else if(player.health>enemy.health){
        document.querySelector('#displayText').innerHTML="Player 1 Wins"; 
    }
    else{
        document.querySelector('#displayText').innerHTML="Player 2 Wins"; 
    }

}
decreasetimer();
animate();
if (timer>=0 && player.health>0 && enemy.health>0){window.addEventListener('keydown',(event)=>{
    
switch(event.key){
    case 'd':
    keys.d.pressed= true;
    lastkey='d';
    break;
    case 'a':
    lastkey='a';
    keys.a.pressed= true;  
    break;
    case 'w':
        lastkey='w'
        keys.w.pressed=true;
        break;
    case 'ArrowLeft':
        lastkey='ArrowLeft';
        keys.ArrowLeft.pressed=true;
        break;
        case 'ArrowRight':
            lastkey='ArrowRight';
            keys.ArrowRight.pressed=true;
            break;
    case 'ArrowUp':
        lastkey='ArrowUp';
        keys.ArrowUp.pressed=true;
        break;
    case ' ':
        if(timer>0 && player.health>0 && enemy.health>0)
        player.attack();
        break;
    case 'ArrowDown':
        if(timer>0 && player.health>0 && enemy.health>0)
        enemy.attack();
}
})}
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed= false;
        break;
        case 'a':
            keys.a.pressed= false;
            break;
        case 'w':
            keys.w.pressed= false;
            break;
        case 'ArrowUp':
                keys.ArrowUp.pressed= false;
                break;
        case 'ArrowRight':
            keys.ArrowRight.pressed= false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed= false;
            break;
        case 'ArrowDown':
        enemy.isattacking=false;
        break;
    }
    })
    if(timer===0 || player.health===0 || enemy.health===0){
        setTimeout(()=>{
          console.log("kushagar sharma")
        },5000);
    }
