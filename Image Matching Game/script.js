const images = [
    "img1.jpg", "img1.jpg", "img2.jpg", "img2.jpg",
    "img3.jpg", "img3.jpg", "img4.jpg", "img4.jpg",
    "img5.jpg", "img5.jpg", "img6.jpg", "img6.jpg"
];

// Shuffle images
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let chancesLeft = 8;
let matchedPairs = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const gameBoard = document.getElementById("gameBoard");
const restartButton = document.getElementById("restartButton");
const gameResult = document.getElementById("gameResult");
const chancesDisplay = document.getElementById("chances");
const scoreDisplay = document.getElementById("score");

// Load sounds
const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const winSound = new Audio("win.mp3");
const loseSound = new Audio("lose.mp3");

// Initialize game
function initGame() {
    gameBoard.innerHTML = "";
    gameResult.innerHTML = "";
    restartButton.style.display = "none";
    chancesLeft = 8;
    matchedPairs = 0;
    score = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    chancesDisplay.textContent = `Chances Left: ${chancesLeft}`;
    scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;

    shuffle(images).forEach((imgSrc) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="${imgSrc}" alt="Image">`;
        
        card.addEventListener("click", () => {
            if (lockBoard || card.classList.contains("flipped")) return;

            flipSound.play();
            card.classList.add("flipped");

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                lockBoard = true;
                checkMatch();
            }
        });

        gameBoard.appendChild(card);
    });
}

// Check for match
function checkMatch() {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        matchSound.play();
        matchedPairs++;
        score += 10;
        scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;

        if (matchedPairs === images.length / 2) {
            gameOver(true);
        } else {
            resetTurn();
        }
    } else {
        chancesLeft--;
        score -= 5;
        scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
        chancesDisplay.textContent = `Chances Left: ${chancesLeft}`;
        
        if (chancesLeft === 0) {
            gameOver(false);
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetTurn();
            }, 1000);
        }
    }
}

// Handle game over
function gameOver(isWin) {
    lockBoard = true;
    restartButton.style.display = "block";

    if (isWin) {
        winSound.play();
        gameResult.innerHTML = "🎉 You Won! 🎉";
        gameResult.style.color = "yellow";

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    } else {
        loseSound.play();
        gameResult.innerHTML = "😢 You Lost! Try Again! 😢";
        gameResult.style.color = "red";
    }

    scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Reset turn
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Restart game
restartButton.addEventListener("click", initGame);

// Start game on load
initGame();
