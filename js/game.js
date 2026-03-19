// ---------------- Canvas ----------------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------------- Input ----------------
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if(e.code === "Space") player.gravityDir *= -1;
});
document.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });
document.addEventListener("mousedown", () => {
    lasers.push({
        x: player.x + player.width/2,
        y: player.y + player.height/2,
        vx: 10
    });
});

// ---------------- Collision ----------------
function collision(a,b){
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ---------------- Player ----------------
const player = {
    x:200,
    y:500-32,
    width:32,
    height:32,
    vx:0,
    vy:0,
    speed:4,
    jump:12,
    gravity:0.6,
    gravityDir:1,
    onGround:false,
    coins:0
};

function updatePlayer(){
    player.onGround = false;

    if(keys["d"] || keys["arrowright"]) player.vx = player.speed;
    else if(keys["q"] || keys["arrowleft"]) player.vx = -player.speed;
    else player.vx = 0;

    player.vy += player.gravity * player.gravityDir;

    player.x += player.vx;
    player.y += player.vy;

    for(let p of platforms){
        if(collision(player,p)){
            if(player.gravityDir === 1){
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
            } else {
                player.y = p.y + p.height;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }
}

// ---------------- Platforms ----------------
const platforms = [
    {x:0, y:500, width:3000, height:40},
    {x:300, y:420, width:200, height:20},
    {x:700, y:380, width:200, height:20},
    {x:0, y:0, width:3000, height:20} // ligne du haut
];

// ---------------- Coins ----------------
const coins = [
    {x:500, y:420, width:16, height:16, collected:false},
    {x:750, y:420, width:16, height:16, collected:false}
];

function updateCoins(){
    for(let c of coins){
        if(!c.collected && collision(player,c)){
            c.collected = true;
            player.coins++;
        }
    }
}

// ---------------- Enemies ----------------
const enemies = [
    {x:600, y:460, width:32, height:32, dir:1},
    {x:900, y:460, width:32, height:32, dir:-1}
];

function updateEnemies(){
    for(let e of enemies){
        e.x += e.dir * 2;
        if(e.x < 500 || e.x > 900) e.dir *= -1;

        if(collision(player,e)){
            ctx.fillStyle = "white";
            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
            setTimeout(()=> location.reload(),1000);
        }
    }
}

// ---------------- Lasers ----------------
const lasers = [];
function updateLasers(){
    for(let l of lasers){
        l.x += l.vx;
        for(let e of enemies){
            if(collision(l,e)) enemies.splice(enemies.indexOf(e),1);
        }
    }
}

// ---------------- Camera ----------------
const camera = {x:0, y:0};
function updateCamera(){
    camera.x = player.x - canvas.width/2;
    camera.y = player.y - canvas.height/2;

    if(camera.x < 0) camera.x = 0;
    if(camera.y < 0) camera.y = 0;
}

// ---------------- Update & Draw ----------------
function update(){
    updatePlayer();
    updateEnemies();
    updateCoins();
    updateLasers();
    updateCamera();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.save();
    ctx.translate(-camera.x,-camera.y);

    for(let p of platforms){
        ctx.fillStyle="gray";
        ctx.fillRect(p.x,p.y,p.width,p.height);
    }

    for(let c of coins){
        if(!c.collected){
            ctx.fillStyle="yellow";
            ctx.fillRect(c.x,c.y,c.width,c.height);
        }
    }

    for(let e of enemies){
        ctx.fillStyle="red";
        ctx.fillRect(e.x,e.y,e.width,e.height);
    }

    ctx.fillStyle="cyan";
    ctx.fillRect(player.x,player.y,player.width,player.height);

    for(let l of lasers){
        ctx.fillStyle="lime";
        ctx.fillRect(l.x,l.y,10,3);
    }

    ctx.restore();

    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText("Coins: "+player.coins,20,40);
}

// ---------------- Game Loop ----------------
function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
