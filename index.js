//board
let board;
let boardWidth = 850; //ukuran area board
let boardHeight = 300;
let context; //nampilkan semua objek

//dino
let dinoWidth = 88; //ukuran dino
let dinoHeight = 94;
let dinoX = 50; //posisi dino
let dinoY = boardHeight - dinoHeight; //dino berdiri diatas tanah
let dinoImg;

let dino = { //simpan posisi dan ukuran dino
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

//cactus
let cactusArray = [];

let cactus1Width = 30; //ukuran cactus
let cactus2Width = 60;
let cactus3Width = 95;

let cactusHeight = 65;
let cactusX = 900; //posisi cactus
let cactusY = boardHeight - cactusHeight; //cactus di atas tanah

let cactus1Img; //simpan
let cactus2Img;
let cactus3Img;

//gerak
let velocityX = -5; //cactus gerak ke kiri
let velocityY = 0;
let gravity = 0.3; //dino gaya gravitasi

let gameOver = false; //kalah=berhenti
let gameStarted = false; //status game
let score = 0; //poin

let cactusInterval; //simpan interval

//start
window.onload = function () { //panggil board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //drawing di board

    dinoImg = new Image(); //gambar dino
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () { //load gambar
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image(); //gambar cactus
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    //event keyboard
    document.addEventListener("keydown", moveDino);

    //tombol start dan restart
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);
}

//fungsi mulai game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    gameOver = false;
    score = 0;
    cactusArray = [];

    //jalankan animasi dan spawn cactus tiap 1 detik
    requestAnimationFrame(update);
    cactusInterval = setInterval(placeCactus, 1000);

    //sembunyikan tombol
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
}

//fungsi update per frame
function update() {
    if (!gameStarted) return;
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height); //bersihkan canvas

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //menambahkan gravitasi dino 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); //load update dino

    //cactus
    for (let i = 0; i < cactusArray.length; i++) { //loop cactus
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        //cek tabrakan
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            clearInterval(cactusInterval); //hentikan spawn cactus
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
            //tampilkan tombol restart
            document.getElementById("restartBtn").style.display = "block";
        }
    }

    //score
    context.fillStyle = "white";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20); //posisi score
}

//fungsi kontrol dino (lompat)
function moveDino(e) {
    if (!gameStarted || gameOver) return;

    else if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) { //player(keyboard)
        //jump
        velocityY = -10; //kecepatan lompat
    }
}

//fungsi spawn cactus
function placeCactus() {
    if (gameOver || !gameStarted) {
        return;
    }

    //simpan posisi, ukuran cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //chance cactus spawn

    if (placeCactusChance > .70) { //chance cactus
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .30) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //cek jumlah cactus di array
    }
}

//fungsi restart game
function restartGame() {
    gameOver = false;
    gameStarted = false;
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/dino.png";
    cactusArray = [];
    score = 0;

    //hapus semua gambar dari canvas
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //tombol muncul lagi
    document.getElementById("startBtn").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
}

//fungsi deteksi tabrakan
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //kiri
        a.x + a.width > b.x &&      //kanan
        a.y < b.y + b.height &&     //atas
        a.y + a.height > b.y;       //bawah
}