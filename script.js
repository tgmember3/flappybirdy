// =========================
// FLAPPY BIRDY
// PART A
// =========================

const homeScreen =
document.getElementById("homeScreen");

const shopScreen =
document.getElementById("shopScreen");

const gameScreen =
document.getElementById("gameScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

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

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

// =========================
// SOUNDS
// =========================

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
localStorage.getItem("unlockedSkins")
)
|| ["bird.png"];

// =========================
// UI
// =========================

function updateUI(){

document.getElementById(
"coinDisplay"
).innerText = coins;

document.getElementById(
"highScoreDisplay"
).innerText = highScore;

document.getElementById(
"shopCoinCount"
).innerText = coins;

}

updateUI();

// =========================
// SAVE
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
// SCREENS
// =========================

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

}

playBtn.onclick = ()=>{

swoosh.currentTime = 0;
swoosh.play();

startGame();

};

shopBtn.onclick = ()=>{

swoosh.currentTime = 0;
swoosh.play();

showShop();

};

backFromShop.onclick = ()=>{

swoosh.currentTime = 0;
swoosh.play();

showHome();

};

// =========================
// SHOP SYSTEM
// =========================

const skinButtons =
document.querySelectorAll(
".buySkin"
);

skinButtons.forEach(button=>{

button.addEventListener(
"click",

()=>{

let skin =
button.dataset.skin;

let cost =
parseInt(
button.dataset.cost
);

if(
unlockedSkins.includes(
skin
)
){

selectedSkin = skin;

saveGame();

// Update all buttons to show proper state
updateSkinButtons();

return;

}

if(
coins >= cost
){

coins -= cost;

unlockedSkins.push(
skin
);

selectedSkin = skin;

saveGame();

updateSkinButtons();

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

// Function to update skin buttons
function updateSkinButtons() {
    skinButtons.forEach(button => {
        let skin = button.dataset.skin;
        if (unlockedSkins.includes(skin)) {
            if (selectedSkin === skin) {
                button.innerText = "SELECTED";
                button.style.backgroundColor = "#4CAF50";
            } else {
                button.innerText = "SELECT";
                button.style.backgroundColor = "#2196F3";
            }
        } else {
            button.innerText = `BUY (${button.dataset.cost} coins)`;
            button.style.backgroundColor = "#FF9800";
        }
    });
}

// Call this after loading
setTimeout(updateSkinButtons, 100);

// =========================
// BIRD IMAGE
// =========================

const birdImage =
new Image();

// Load bird image with error handling
birdImage.onerror = function() {
    console.error("Failed to load bird image:", selectedSkin);
    // Create a fallback bird (red circle)
    birdImage.src = "";
};

// Generate a simple bird using canvas as fallback
function createFallbackBird() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 70;
    tempCanvas.height = 70;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw a simple bird
    tempCtx.fillStyle = '#FFD700';
    tempCtx.beginPath();
    tempCtx.arc(35, 35, 30, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Eye
    tempCtx.fillStyle = 'white';
    tempCtx.beginPath();
    tempCtx.arc(45, 25, 10, 0, Math.PI * 2);
    tempCtx.fill();
    
    tempCtx.fillStyle = 'black';
    tempCtx.beginPath();
    tempCtx.arc(48, 25, 5, 0, Math.PI * 2);
    tempCtx.fill();
    
    // Beak
    tempCtx.fillStyle = '#FF6B35';
    tempCtx.beginPath();
    tempCtx.moveTo(60, 35);
    tempCtx.lineTo(70, 30);
    tempCtx.lineTo(60, 25);
    tempCtx.fill();
    
    birdImage.src = tempCanvas.toDataURL();
}

birdImage.src =
selectedSkin;

function loadSelectedSkin(){

birdImage.src =
selectedSkin;
birdImage.onerror = createFallbackBird;

}

loadSelectedSkin();

// =========================
// GAME VARIABLES
// =========================

let bird;
let pipes = []; // Initialize pipes array

let score;

let earnedCoins;

let gameStarted;

let gameOver;

// Pipe generation interval reference
let pipeInterval;

// =========================
// PART B
// GAMEPLAY
// =========================

const pipeImage =
document.getElementById(
"pipeSprite"
);

// Create fallback pipe image
const pipeFallbackCanvas = document.createElement('canvas');
pipeFallbackCanvas.width = 100;
pipeFallbackCanvas.height = 400;
const pipeCtx = pipeFallbackCanvas.getContext('2d');

// Draw a simple pipe
pipeCtx.fillStyle = '#4CAF50';
pipeCtx.fillRect(20, 0, 60, 400);
pipeCtx.fillStyle = '#388E3C';
pipeCtx.fillRect(10, 0, 80, 30);
pipeCtx.fillRect(10, 370, 80, 30);

const fallbackPipeImage = new Image();
fallbackPipeImage.src = pipeFallbackCanvas.toDataURL();

// Use fallback if pipe image doesn't load
pipeImage.onerror = function() {
    this.src = fallbackPipeImage.src;
};

function startGame(){

homeScreen.style.display =
"none";

shopScreen.style.display =
"none";

gameOverScreen.style.display =
"none";

gameScreen.style.display =
"flex";

loadSelectedSkin();

bird = {

x:150,
y:250,

width:70,
height:70,

velocity:0

};

pipes = []; // Reset pipes array

score = 0;

earnedCoins = 0;

gameStarted = true;

gameOver = false;

// Clear any existing pipe interval
if (pipeInterval) {
    clearInterval(pipeInterval);
}

// Start pipe generation
pipeInterval = setInterval(()=>{

if(
!gameStarted ||
gameOver
)
return;

let gap = 230;

let topHeight =
Math.random() * 250 + 80;

pipes.push({

x:canvas.width,

top:topHeight,

bottom:
topHeight + gap,

width:100,

passed:false

});

},2000);

}

// =========================
// JUMP
// =========================

function jump(){

if(
!gameStarted ||
gameOver
) return;

bird.velocity = -9;

flapSound.currentTime = 0;

flapSound.play();

}

document.addEventListener(
"keydown",
(e)=>{

if(
e.code === "Space"
){

e.preventDefault(); // Prevent page scroll
jump();

}

}
);

canvas.addEventListener(
"click",
jump
);

canvas.addEventListener(
"touchstart",
jump
);

// =========================
// GAME OVER
// =========================

function endGame(){

if(gameOver)
return;

gameOver = true;

// Clear pipe interval
if (pipeInterval) {
    clearInterval(pipeInterval);
    pipeInterval = null;
}

hitSound.currentTime = 0;
hitSound.play();

setTimeout(()=>{

dieSound.currentTime = 0;
dieSound.play();

},200);

if(
score > highScore
){

highScore = score;

}

saveGame();

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

setTimeout(()=>{

gameOverScreen.style.display =
"block";

},500);

}

// =========================
// PLAY AGAIN
// =========================

playAgainBtn.onclick =
()=>{

swoosh.currentTime = 0;
swoosh.play();

startGame();

};

homeBtn.onclick =
()=>{

swoosh.currentTime = 0;
swoosh.play();

showHome();

};

// =========================
// UPDATE
// =========================

function update(){

if(
!gameStarted ||
gameOver
)
return;

bird.velocity += 0.5;

bird.y += bird.velocity;

// Ground

if(
bird.y +
bird.height
>=
canvas.height
){

endGame();

}

// Ceiling

if(
bird.y < 0
){

bird.y = 0;

}

// Pipes - check if pipes array exists and has items
if (pipes && pipes.length > 0) {
    for(
    let i = pipes.length - 1; i >= 0; i--
    ){
        let pipe = pipes[i];

        pipe.x -= 4;

        // Coins + Score
        if(
        !pipe.passed &&
        pipe.x +
        pipe.width <
        bird.x
        ){

        pipe.passed = true;

        score++;

        coins += 2;

        earnedCoins += 2;

        saveGame();

        pointSound.currentTime = 0;

        pointSound.play();

        }

        // Accurate Hitbox
        let hitX =
        bird.x + 12;

        let hitY =
        bird.y + 12;

        let hitW =
        45;

        let hitH =
        45;

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

        // Remove old pipes
        if (pipe.x + pipe.width < -150) {
            pipes.splice(i, 1);
        }
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

// Pipes
if (pipes && pipes.length > 0) {
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

    // Check if pipeImage loaded properly
    if (pipeImage && pipeImage.complete && pipeImage.naturalWidth > 0) {
        ctx.drawImage(

        pipeImage,

        -pipe.width/2,

        0,

        pipe.width,

        pipe.top

        );
    } else {
        // Use fallback
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(-pipe.width/2, 0, pipe.width, pipe.top);
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(-pipe.width/2 - 10, 0, pipe.width + 20, 30);
    }

    ctx.restore();

    // Bottom Pipe
    if (pipeImage && pipeImage.complete && pipeImage.naturalWidth > 0) {
        ctx.drawImage(

        pipeImage,

        pipe.x,

        pipe.bottom,

        pipe.width,

        canvas.height -
        pipe.bottom

        );
    } else {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(pipe.x - 10, pipe.bottom, pipe.width + 20, 30);
    }

    }
}

// Bird
if (birdImage && birdImage.complete && birdImage.naturalWidth > 0) {
    ctx.drawImage(

    birdImage,

    bird.x,

    bird.y,

    bird.width,

    bird.height

    );
} else {
    // Fallback bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x + 35, bird.y + 35, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.x + 45, bird.y + 25, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + 48, bird.y + 25, 5, 0, Math.PI * 2);
    ctx.fill();
}

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

}

// =========================
// GAME LOOP
// =========================

function gameLoop(){

update();

draw();

requestAnimationFrame(
gameLoop
);

}

gameLoop();

// =========================
// START
// =========================

showHome();