const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Activamos el suavizado de imágenes para que la manzana no se pixelee al escalarla
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Cargamos tu manzana original
const appleImage = new Image();
appleImage.src = "apple.png";

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

    // Posición inicial perfecta alineada con la cuadrícula
    snake = [
        {x: 250, y: 250},
        {x: 225, y: 250},
        {x: 200, y: 250}
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
    // --- 1. FONDO DE REJILLA ESTILO CYBERPUNK (MEJORA x100) ---
    ctx.fillStyle = "#0c1020";
    ctx.fillRect(0, 0, 500, 500);
    
    // Dibujamos líneas de cuadrícula sutiles para dar profundidad
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 500; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
        ctx.stroke();
    }

    // --- 2. DIBUJAR MANZANA NITIDA Y CON EFECTO DE LUZ ---
    // Sombra brillante debajo de la manzana
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff2a2a";
    
    // Dibujamos la manzana un pelín más grande (31px) y bien centrada
    ctx.drawImage(appleImage, food.x - 3, food.y - 3, 31, 31);
    
    // Desactivamos la sombra temporalmente para la serpiente
    ctx.shadowBlur = 0;

    // --- 3. DIBUJAR SERPIENTE ESTILO NEÓN GLOW ---
    snake.forEach((part, index) => {
        const isHead = index === 0;

        if (retroMode) {
            // Modo retro estilizado con bordes limpios
            ctx.fillStyle = isHead ? "#22c55e" : "#4ade80";
            ctx.fillRect(part.x + 1, part.y + 1, box - 2, box - 2);
        } else {
            // Modo moderno premium: Serpiente redondeada con degradado brillante y luz neón
            ctx.shadowBlur = isHead ? 14 : 6;
            ctx.shadowColor = "#3bf6ff";

            let gradient = ctx.createRadialGradient(
                part.x + 12.5, part.y + 12.5, 2,
                part.x + 12.5, part.y + 12.5, 14
            );
            
            if (isHead) {
                gradient.addColorStop(0, "#00ffff");
                gradient.addColorStop(1, "#0088cc");
            } else {
                gradient.addColorStop(0, "#a8ffb2");
                gradient.addColorStop(1, "#10b981");
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            // Dibujamos círculos suaves en vez de cuadrados feos
            ctx.arc(part.x + 12.5, part.y + 12.5, 11, 0, Math.PI * 2);
            ctx.fill();
            
            // Ojos pequeños minimalistas para la cabeza de la serpiente
            if (isHead) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(part.x + 8, part.y + 10, 2.5, 0, Math.PI * 2);
                ctx.arc(part.x + 17, part.y + 10, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    // Resetear sombras finales para que no afecten al texto
    ctx.shadowBlur = 0;

    // --- LÓGICA DE MOVIMIENTO ---
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (head.x < 0 || head.y < 0 || head.x >= 500 || head.y >= 500) {
        gameOver();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    // --- MARCADOR DE PUNTOS MODERNO ---
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 18px Arial";
    ctx.fillText("SCORE: " + score, 20, 35);
}
