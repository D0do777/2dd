const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const keys = {}

document.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()] = true
if(e.code === "Space") player.gravityDir *= -1
})

document.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()] = false
})

document.addEventListener("mousedown",()=>{
lasers.push({
x:player.x + player.width/2,
y:player.y + player.height/2,
vx:15
})
})

function collision(a,b){
return(
a.x < b.x + b.width &&
a.x + a.width > b.x &&
a.y < b.y + b.height &&
a.y + a.height > b.y
)
}

const player={
x:200,
y:canvas.height-120,
width:50,
height:50,
vx:0,
vy:0,
speed:6,
gravity:0.7,
gravityDir:1
}

const platforms=[
{x:-100000,y:canvas.height-40,width:200000,height:40},
{x:-100000,y:0,width:200000,height:40}
]

const enemies=[
{x:600,y:canvas.height-90,width:50,height:50,dir:1,shoot:true},
{x:1000,y:canvas.height-90,width:50,height:50,dir:-1,shoot:false}
]

const enemyLasers=[]
const lasers=[]

let gameOver=false

function updatePlayer(){

if(keys["d"] || keys["arrowright"]) player.vx=player.speed
else if(keys["q"] || keys["arrowleft"]) player.vx=-player.speed
else player.vx=0

player.vy += player.gravity * player.gravityDir

player.x += player.vx
player.y += player.vy

for(let p of platforms){

if(collision(player,p)){

if(player.gravityDir===1){
player.y=p.y-player.height
player.vy=0
}

else{
player.y=p.y+p.height
player.vy=0
}

}

}

}

function updateEnemies(){

for(let e of enemies){

e.x += e.dir*2

if(e.x<200 || e.x>1500) e.dir*=-1

if(collision(player,e)) killPlayer()

if(e.shoot && Math.random()<0.01){

enemyLasers.push({
x:e.x,
y:e.y+20,
vx:-8
})

}

}

}

function updateLasers(){

for(let l of lasers){

l.x += l.vx

for(let e of enemies){

if(collision(l,e)){
enemies.splice(enemies.indexOf(e),1)
}

}

}

}

function updateEnemyLasers(){

for(let l of enemyLasers){

l.x += l.vx

if(collision(l,player)) killPlayer()

}

}

function killPlayer(){

if(gameOver) return

gameOver=true

document.getElementById("gameOver").style.display="block"

}

function restartGame(){
window.location.reload()
}

}

function draw(){

ctx.fillStyle="black"
ctx.fillRect(0,0,canvas.width,canvas.height)

for(let p of platforms){

ctx.fillStyle="gray"
ctx.fillRect(p.x,p.y,p.width,p.height)

}

for(let e of enemies){

ctx.fillStyle="red"
ctx.fillRect(e.x,e.y,e.width,e.height)

}

ctx.fillStyle="cyan"
ctx.fillRect(player.x,player.y,player.width,player.height)

for(let l of lasers){

ctx.fillStyle="lime"
ctx.fillRect(l.x,l.y,12,4)

}

for(let l of enemyLasers){

ctx.fillStyle="orange"
ctx.fillRect(l.x,l.y,12,4)

}

}

function update(){

if(gameOver) return

updatePlayer()
updateEnemies()
updateLasers()
updateEnemyLasers()

}

function gameLoop(){

update()
draw()

requestAnimationFrame(gameLoop)

}

gameLoop()
