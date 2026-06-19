// =========================
// FLAPPY BIRDY
// PART A
// VARIABLES + SAVE SYSTEM
// =========================

// Screens
const homeScreen =
document.getElementById("homeScreen");

const shopScreen =
document.getElementById("shopScreen");

const gameScreen =
document.getElementById("gameScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

// Buttons
const playBtn =
document.getElementById("playBtn");

const shopBtn =
document.getElementById("shopBtn");

const backFromShop =
document.getElementById("backFromShop");

const playAgainBtn =
document.getElementById("playAgainBtn");

const homeBtn =
document.getElementById("homeBtn");

// Canvas
const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

// Images
const pipeImage =
document.getElementById("pipeSprite");

const birdImage =
new Image();

// Sounds
const swoosh =
document.getElementById("swoosh");

const pointSound =
document.getElementById("point");

const flapSound =
document.getElementById("flap");

const hitSound =
document.getElementById("hit");

const dieSound =
document.getElementById("die");

// =========================
// SAVE DATA
// =========================

let coins =
parseInt(
localStorage.getItem("coins")
) || 0;

let highScore =
parseInt(
localStorage.getItem("highScore")
) || 0;

let selectedSkin =
localStorage.getItem("selectedSkin")
|| "bird.png";

let unlockedSkins =
JSON.parse(
localStorage.getItem(
"unlockedSkins"
)
)
|| ["bird.png"];

// Load selected bird
birdImage.src =
selectedSkin;

// =========================
// GAME VARIABLES
// =========================

let bird = null;

let pipes = [];

let score = 0;

let earnedCoins = 0;

let gameStarted = false;

let gameOver = false;

// =========================
// SAVE FUNCTION
// =========================

function saveGame(){

localStorage.setItem(
"coins",
coins
);

localStorage.setItem(
"highScore",
highScore
);

localStorage.setItem(
"selectedSkin",
selectedSkin
);

localStorage.setItem(
"unlockedSkins",
JSON.stringify(
unlockedSkins
)
);

updateUI();

}

// =========================
// UI UPDATE
// =========================

function updateUI(){

const coinDisplay =
document.getElementById(
"coinDisplay"
);

const highScoreDisplay =
document.getElementById(
"highScoreDisplay"
);

const shopCoinCount =
document.getElementById(
"shopCoinCount"
);

if(coinDisplay)
coinDisplay.innerText =
coins;

if(highScoreDisplay)
highScoreDisplay.innerText =
highScore;

if(shopCoinCount)
shopCoinCount.innerText =
coins;

}

updateUI();

// =========================
// PART B
// HOME + SHOP
// =========================

// Show Home
function showHome(){

homeScreen.style.display =
"flex";

shopScreen.style.display =
"none";

gameScreen.style.display =
"none";

gameOverScreen.style.display =
"none";

updateUI();

}

// Show Shop
function showShop(){

homeScreen.style.display =
"none";

shopScreen.style.display =
"block";

gameScreen.style.display =
"none";

gameOverScreen.style.display =
"none";

updateUI();

refreshShop();

}

// =========================
// REFRESH SHOP
// =========================

function refreshShop(){

const buttons =
document.querySelectorAll(
".buySkin"
);

buttons.forEach(button=>{

const skin =
button.dataset.skin;

const cost =
parseInt(
button.dataset.cost
);

if(
selectedSkin === skin
){

button.innerText =
"SELECTED";

button.style.background =
"#2196f3";

}
else if(
unlockedSkins.includes(
skin
)
){

button.innerText =
"USE";

button.style.background =
"#4caf50";

}
else{

button.innerText =
cost + " COINS";

button.style.background =
"#ff9800";

}

});

}

// =========================
// SHOP BUTTONS
// =========================

document
.querySelectorAll(
".buySkin"
)
.forEach(button=>{

button.addEventListener(
"click",

()=>{

const skin =
button.dataset.skin;

const cost =
parseInt(
button.dataset.cost
);

// Already unlocked

if(
unlockedSkins.includes(
skin
)
){

selectedSkin =
skin;

birdImage.src =
selectedSkin;

saveGame();

refreshShop();

return;

}

// Buy skin

if(
coins >= cost
){

coins -= cost;

unlockedSkins.push(
skin
);

selectedSkin =
skin;

birdImage.src =
selectedSkin;

saveGame();

refreshShop();

alert(
"Skin Unlocked!"
);

}
else{

alert(
"Not enough coins!"
);

}

}

);

});

// =========================
// BUTTON EVENTS
// =========================

playBtn.onclick =
()=>{

swoosh.currentTime = 0;

swoosh.play();

startGame();

};

shopBtn.onclick =
()=>{

swoosh.currentTime = 0;

swoosh.play();

showShop();

};

backFromShop.onclick =
()=>{

swoosh.currentTime = 0;

swoosh.play();

showHome();

};

homeBtn.onclick =
()=>{

swoosh.currentTime = 0;

swoosh.play();

showHome();

};

playAgainBtn.onclick =
()=>{

swoosh.currentTime = 0;

swoosh.play();

startGame();

};

// =========================
// INITIAL SCREEN
// =========================

showHome();

refreshShop();

// =========================
// PART C
// GAMEPLAY
// =========================

function startGame(){

homeScreen.style.display =
"none";

shopScreen.style.display =
"none";

gameOverScreen.style.display =
"none";

gameScreen.style.display =
"flex";

// Reset Game

bird = {

x:150,
y:250,

width:70,
height:70,

velocity:0

};

pipes = [];

score = 0;

earnedCoins = 0;

gameStarted = true;

gameOver = false;

birdImage.src =
selectedSkin;

}

// =========================
// JUMP
// =========================

function jump(){

if(
!gameStarted ||
gameOver
)
return;

bird.velocity = -9;

flapSound.currentTime = 0;

flapSound.play();

}

// Keyboard

document.addEventListener(
"keydown",

(event)=>{

if(
event.code === "Space"
){

jump();

}

}
);

// Mouse

canvas.addEventListener(
"click",

()=>{

jump();

}
);

// Mobile

canvas.addEventListener(
"touchstart",

()=>{

jump();

}
);

// =========================
// PIPE GENERATOR
// =========================

setInterval(()=>{

if(
!gameStarted ||
gameOver
)
return;

const gap = 230;

const topHeight =

Math.random() * 250
+ 80;

pipes.push({

x:canvas.width,

top:topHeight,

bottom:
topHeight + gap,

width:100,

passed:false

});

},2000);

// =========================
// UPDATE GAME
// =========================

function update(){

if(!bird)
return;

if(
!gameStarted ||
gameOver
)
return;

// Gravity

bird.velocity += 0.5;

bird.y += bird.velocity;

// Ceiling

if(
bird.y < 0
){

bird.y = 0;

bird.velocity = 0;

}

// Ground

if(
bird.y +
bird.height
>=
canvas.height
){

endGame();

}

// Move Pipes

for(
let pipe of pipes
){

pipe.x -= 4;

// Score

if(
!pipe.passed &&

pipe.x +
pipe.width
<
bird.x
){

pipe.passed =
true;

score++;

coins += 2;

earnedCoins += 2;

saveGame();

pointSound.currentTime = 0;

pointSound.play();

}

}

}

// =========================
// PART D
// COLLISION + DRAW
// =========================

function endGame(){

if(gameOver)
return;

gameOver = true;

// Sounds

hitSound.currentTime = 0;
hitSound.play();

setTimeout(()=>{

dieSound.currentTime = 0;
dieSound.play();

},200);

// High Score

if(
score > highScore
){

highScore = score;

saveGame();

}

// Update Game Over UI

document.getElementById(
"finalScore"
).innerText = score;

document.getElementById(
"finalHighScore"
).innerText =
highScore;

document.getElementById(
"earnedCoins"
).innerText =
earnedCoins;

// Show Screen

setTimeout(()=>{

gameOverScreen.style.display =
"block";

},500);

}

// =========================
// COLLISION
// =========================

function checkCollision(){

if(!bird)
return;

// Smaller hitbox

const hitX =
bird.x + 12;

const hitY =
bird.y + 12;

const hitW = 45;

const hitH = 45;

for(
let pipe of pipes
){

if(

hitX + hitW >
pipe.x &&

hitX <
pipe.x +
pipe.width &&

(

hitY <
pipe.top ||

hitY + hitH >
pipe.bottom

)

){

endGame();

}

}

}

// =========================
// DRAW
// =========================

function draw(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

// Sky

ctx.fillStyle =
"#70c5ce";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

// Don't draw if game not started

if(!bird)
return;

// Pipes

for(
let pipe of pipes
){

// Top Pipe

ctx.save();

ctx.translate(
pipe.x +
pipe.width / 2,

pipe.top
);

ctx.scale(
1,
-1
);

ctx.drawImage(

pipeImage,

-pipe.width / 2,

0,

pipe.width,

pipe.top

);

ctx.restore();

// Bottom Pipe

ctx.drawImage(

pipeImage,

pipe.x,

pipe.bottom,

pipe.width,

canvas.height -
pipe.bottom

);

}

// Bird

ctx.drawImage(

birdImage,

bird.x,

bird.y,

bird.width,

bird.height

);

// Score

ctx.fillStyle =
"white";

ctx.font =
"40px Arial";

ctx.fillText(

"Score: " + score,

20,

50

);

ctx.fillText(

"Coins: " + coins,

20,

100

);

ctx.fillText(

"Best: " + highScore,

20,

150

);

}

// =========================
// CLEAN PIPES
// =========================

function removeOldPipes(){

pipes =
pipes.filter(

pipe =>

pipe.x +
pipe.width >

-150

);

}

// =========================
// MAIN LOOP
// =========================

function gameLoop(){

update();

checkCollision();

removeOldPipes();

draw();

requestAnimationFrame(
gameLoop
);

}

gameLoop();

// =========================
// IMAGE DEBUG
// =========================

birdImage.onload =
()=>{

console.log(
"Bird Loaded"
);

};

pipeImage.onload =
()=>{

console.log(
"Pipe Loaded"
);

};

// =========================
// START SCREEN
// =========================

showHome();
