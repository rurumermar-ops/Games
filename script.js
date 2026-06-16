const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Creamos la imagen con la ruta directa ya que está en la misma carpeta
const appleImage = new Image();
appleImage.src = "apple.png";

// Una manzana roja pixelada en Base64 por si el servidor de GitHub tarda en responder
const fallbackApple = new Image();
fallbackApple.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAD9JREFUSE1jZGBgUGBgYBBgGAVDCRgG4YgNOf7/b2CE0v//w9isg6mXpDgaDkdD0XAwHI6GouFwOBoOxuEwDAIApA0mEQC93vYAAAAASUVORK5CYII=";

const box = 25;

let snake;
let food;

let dx;
let dy;

let score = 0;
let gameLoop;
let retroMode = true;

function startGame(){
    clearInterval(gameLoop);

    retroMode = document.getElementById("retroToggle").checked;

    snake = [
        {x: 250, y: 250}
    ];

    food = randomFood();

    dx = box;
    dy = 0;

    score = 0;

    hideAll();

    canvas.style.display = "block";

    gameLoop = setInterval(draw, 90);
}

function randomFood(){
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

function hideAll(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("settingsMenu").style.display = "none";
    document.getElementById("gameover").style.display = "none";
}

function openSettings(){
    hideAll();
    document.getElementById("settingsMenu").style.display = "block";
}

function backMenu(){
    clearInterval(gameLoop);
    canvas.style.display = "none";
    hideAll();
    document.getElementById("menu").style.display = "block";
}

document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp" && dy === 0){
        dx = 0;
        dy = -box;
    }
    if(e.key === "ArrowDown" && dy === 0){
        dx = 0;
        dy = box;
    }
    if(e.key === "ArrowLeft" && dx === 0){
        dx = -box;
        dy = 0;
    }
    if(e.key === "ArrowRight" && dx === 0){
        dx = box;
        dy = 0;
    }
});

function gameOver(){
    clearInterval(gameLoop);
    canvas.style.display = "none";
    document.getElementById("scoreText").innerText = "Score: " + score;
    document.getElementById("gameover").style.display = "block";
}

function draw(){
    ctx.clearRect(0, 0, 500, 500);

    // --- DIBUJAR LA COMIDA (MANZANA) ---
    if (appleImage.complete && appleImage.naturalWidth !== 0) {
        // Dibuja tu apple.png si ya cargó
        ctx.drawImage(appleImage, food.x, food.y, box, box);
    } else {
        // Si no ha terminado de cargar, usa el respaldo para que el juego NO se congele
        ctx.drawImage(fallbackApple, food.x, food.y, box, box);
    }

    // --- DIBUJAR LA SERPIENTE ---
    snake.forEach(part => {
        if(retroMode){
            ctx.fillStyle = "lime";
            ctx.fillRect(part.x, part.y, box, box);
        } else {
            let g = ctx.createRadialGradient(
                part.x + 12, part.y + 12, 2,
                part.x + 12, part.y + 12, 15
            );
            g.addColorStop(0, "#7CFC00");
            g.addColorStop(1, "#145214");
            ctx.fillStyle = g;

            ctx.beginPath();
            ctx.arc(part.x + 12, part.y + 12, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if(head.x < 0 || head.y < 0 || head.x >= 500 || head.y >= 500){
        gameOver();
        return;
    }

    for(let i = 0; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            gameOver();
            return;
        }
    }

    if(head.x === food.x && head.y === food.y){
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}
