//переменные
let gameWrapper = document.querySelector('#game-wrapper');
let heroImg = document.querySelector('#hero-img');
let heroImgBlock = document.querySelector('.hero-img-block');
let jumpButton = document.querySelector('#button-jump');
let attackButton = document.querySelector('#button-attack');
let info = document.querySelector('#info');
let styleHero = window.getComputedStyle(heroImgBlock);
let scoreDiv = document.querySelector('#score');
let finalTimerText = window.document.querySelector('#final-timer-text');
let fsBtn = window.document.querySelector('#fsBtn');
let restartBtn = window.document.querySelector('#restartBtn');

let rightPosition = 0;
let imgBlockPosition = 0;
let direction = 'right';
let timer = null;
let x = 0;
let fall = false;
let hit = false
let jump = false
let tileArray = [];
let objArray = [];
let enemiesArray = [];
let halfWidth = window.screen.width/2;
let heroX = Math.floor((Number.parseInt(styleHero.left)+48)/48);
let heroY = Math.floor(Number.parseInt(styleHero.bottom)/32);
let maxLives = 6;
let lives = 6;
let heartsArray = [];
let isRightBlocked = false;
let isLeftBlocked = false;
let wasHeroHit = false
let f1WallArray = [[-10, 0], [14, 32], [42, 53], [64, 74], [92, 105], [119, 144]];
let f2WallArray = [[54, 63]];
let isWallRight = false;
let isWallLeft = false;
let heroStep = 3;
let score = 0;
let nameUser = null

//функции

const moveWorldLeft = () => {
    objArray.map((elem) => {
        elem.style.left = (Number.parseInt(elem.style.left) - 32)+'px';
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    });
    enemiesArray.map(elem =>{
        elem.moveLeft()
    });
    f1WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
    f2WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
}
const moveWorldRight = () => {
    objArray.map((elem) => {
        elem.style.left = (Number.parseInt(elem.style.left) + 32)+'px';
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    });
    enemiesArray.map(elem =>{
        elem.moveRight()
    });
    f1WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
    f2WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
}

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(styleHero.left)+30)/30);
    heroY = Math.ceil(Number.parseInt(styleHero.bottom)/32);
}
const checkFalling = () =>{
    updateHeroXY();
    let isFalling = true;
    for (let i = 0; i < tileArray.length;i++){
        if((tileArray[i][0] === heroX) && ((tileArray[i][1]+1) === heroY)){
            isFalling = false;
        }
    }
    if(isFalling){
        fall = true;
        console.log(jump)
    }
    else{
        fall = false;
        console.log(jump)
    }
}
const fallHandler = () => {
    heroImg.style.top = '-256px';
    heroImgBlock.style.bottom = `${Number.parseInt(heroImgBlock.style.bottom)-32}px`;
    checkFalling();
}
const checkRightWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if(heroY === 1){
        f1WallArray.map(elem => {
            if(heroX === elem[0] - 2){
                isWallRight = true;
            }
        })
    }else if(heroY === 5){
        f2WallArray.map(elem => {
            if(heroX === elem[0] - 2){
                isWallRight = true;
            }
        })
    }
}
const checkLeftWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if(heroY === 1){
        f1WallArray.map(elem => {
            if(heroX === elem[1]){
                isWallLeft = true;
            }
        })
    }else if(heroY === 5){
        f2WallArray.map(elem => {
            if(heroX === elem[1]){
                isWallLeft = true;
            }
        })
    }
}
const rightHandler = () => {
    if(!isRightBlocked && !isWallRight){
        heroImg.style.transform = 'scale(1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition + 1;
        if(rightPosition > 7){
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 128}px`;
        heroImg.style.top = '-128px';
        heroImgBlock.style.left = `${imgBlockPosition * heroStep}px`;
        checkFalling();
        wasHeroHit = false;
        moveWorldLeft();
        checkRightWallCollide();
    }

}
const leftHandler = () => {
    if(!isLeftBlocked && !isWallLeft){
        heroImg.style.transform = 'scale(-1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition - 1;
        if(rightPosition > 8){
            rightPosition = 1;
        }
        heroImg.style.left = `-${rightPosition*128}px`;
        heroImg.style.top = '-128px';
        heroImgBlock.style.left = `${imgBlockPosition * heroStep}px`;
        checkFalling();
        wasHeroHit = false;
        moveWorldRight();
        checkLeftWallCollide();
    }
}
const jumpHandler = () => {
    isWallRight = false;
    isWallLeft = false;
    switch (direction){
        case 'right':{
            heroImg.style.transform = 'scale(1,1)';
            if(rightPosition > 8){
                rightPosition = 0;
                heroImgBlock.style.bottom = Number.parseInt(heroImgBlock.style.bottom+540)+'px';
                console.log(heroImgBlock.style.bottom)
                jump = false;
            }
            break;
        }
        case 'left':{
            heroImg.style.transform = 'scale(-1,1)';
            if(rightPosition > 8){
                rightPosition = 0;
                heroImgBlock.style.bottom = Number.parseInt(heroImgBlock.style.bottom+540)+'px';
                jump = false;
                console.log(heroImgBlock.style.bottom)
            }
            break;
        }
        default:break;
    }
    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition*128}px`;
    heroImg.style.top = '-256px';

}
const hitHandler = () => {
    switch (direction){
        case 'right':{
            heroImg.style.transform = 'scale(1,1)';
            rightPosition = rightPosition + 1;
            if(rightPosition > 3){
                rightPosition = 0;
                hit = false;
                wasHeroHit = true
            }
            break;
        }
        case 'left':{
            heroImg.style.transform = 'scale(-1,1)';
            rightPosition = rightPosition + 1;
            if(rightPosition > 8){
                rightPosition = 5;
                hit = false;
                wasHeroHit = true
            }
            break;
        }
        default:break;
    }
    heroImg.style.left = `-${rightPosition*128}px`;
    heroImg.style.top = '-384px';
}
const standHandler = () => {
    switch (direction){
        case 'right':{
            heroImg.style.transform = 'scale(1,1)';
            rightPosition = rightPosition + 1;
            if(rightPosition > 5){
                rightPosition = 0;
            }
            break;
        }
        case 'left':{
            heroImg.style.transform = 'scale(-1,1)';
            rightPosition = rightPosition + 1;
            if(rightPosition > 8){
                rightPosition = 3;
            }
            break;
        }
        default:break;
    }
    heroImg.style.left = `-${rightPosition*128}px`;
    heroImg.style.top = '0px';
    checkFalling();
}
const creatTile = (x, y = 1) => {
    let tile= document.createElement('img');
    tile.src = 'hero_img/tile.png';
    tile.style.position = 'absolute';
    tile.style.left = `${x*32}px`;
    tile.style.bottom = `${y*32}px`;
    gameWrapper.appendChild(tile);
    objArray.push(tile);
    tileArray.push([x, y]);
}
const creatTilesPlatform = (startX, endX, floor) => {
    for(let x_pos = startX - 1; x_pos < endX; x_pos++){
        creatTile(x_pos, floor);
    }
}
const createTilesBlackBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos++){
        for(let x_pos = startX - 1; x_pos < endX; x_pos++){
            creatTilesBlack(x_pos, y_pos);
        }
    }

}
const creatTilesBlack = (x, y =0) => {
    let tileBottom = document.createElement('img');
    tileBottom.src = 'hero_img/tile_12.png';
    tileBottom.style.position = 'absolute';
    tileBottom.style.left = `${x * 32}px`;
    tileBottom.style.bottom = `${y * 32}px`;
    objArray.push(tileBottom);
    gameWrapper.appendChild(tileBottom);
}
const addTiles = (i) => {
    creatTile(i);
    creatTilesBlack(i)


}

//обработчики событий

window.addEventListener('keydown', ev => {
    if(!ev.repeat){
        console.log(ev)
        clearInterval(timer);
        timer = setInterval(()=>{
            if(ev.code === 'KeyD'){
                direction = 'right';
                rightHandler();
            } else if(ev.code === 'KeyA'){
                direction = 'left';
                leftHandler();
            }
        },50)
    }
});
window.addEventListener('keyup', ev =>{
    if(ev.code === 'Space'){
        jump = true;
        console.log(jump)
    }
    if(ev.code === 'Enter'){
        hit = true;
    }
    clearInterval(timer);
    lifeCycle();
});
jumpButton.onclick = () => {
    jump = true;
}
attackButton.onclick = () => {
    hit = true;
}
// ================для мобилки
let onTouchStart = (ev) => {
    clearInterval(timer);
    if(ev.type === "touchstart"){
        x = ev.touches[0].screenX;
    }
    timer = setInterval(() => {
        if(x > halfWidth){
            direction = 'right';
            rightHandler();
        }
        else {
            direction ='left';
            leftHandler();
        }
    },50)
}
let onTouchEnd = (ev) => {

    clearInterval(timer);
    lifeCycle();
}
fsBtn.onclick = () => {
    if(window.document.fullscreen){
        fsBtn.src = 'fullscreen.png';
        window.document.exitFullscreen();
    }else{
        fsBtn.src = 'cancel.png';
        gameWrapper.requestFullscreen();
    }
}
restartBtn.addEventListener('click', ()=>{
    window.document.location.reload();
});
window.addEventListener('touchstart', onTouchStart,{ passive: false });
window.addEventListener('touchend', onTouchEnd,{ passive: false });

//=======================

class Enemy{
    ATTACK = 'attack';
    DEATH = 'death';
    HURT = 'hurt';
    IDLE = 'idle';
    WALK = 'walk';

    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    timer;
    sourceImg;
    state;
    animateWaschange;
    fps;
    startX;
    dir;
    stop;
    lives;

    constructor(x,y, src) {
        this.posX = x + this.getRandomOffset(8);
        this.startX = x;
        this.posY = y;
        this.blockSize = 96;
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.sourceImg = src;
        this.state = this.IDLE;
        this.animateWaschange = false;
        this.dir = 1;
        this.stop = false;
        this.lives =  30;

        this.createImg();
        this.changeAnimate(this.WALK , 6);
        enemiesArray.push(this)
        this.lifeCycle();

    }
    createImg(){
        this.block = window.document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = (this.posX * 32)+'px';
        this.block.style.bottom = (this.posY * 32)+'px';
        this.block.style.width = this.blockSize+'px';
        this.block.style.height = this.blockSize+'px';
        this.block.style.overflow = 'hidden';
        this.block.style.zIndex ='1'

        this.blockSize = Number.parseInt(this.blockSize)
        this.img = document.createElement('img');
        this.img.src = this.sourceImg+'enemy.png';
        this.img.style.position = 'absolute';
        this.img.style.left = 0 + 'px';
        this.img.style.bottom = 0 + 'px';
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.style.height = this.blockSize;

        this.block.appendChild(this.img);

        gameWrapper.appendChild(this.block);

    }
    lifeCycle(){
        this.timer = setInterval(()=>{
            if(this.animateWaschange){
                this.animateWaschange = false;
                switch (this.state){
                    case this.ATTACK:{
                        this.setAttack()
                        break;
                    }
                    case this.DEATH:{
                        this.setDeath()
                        score += 10
                        scoreDiv.innerHTML = score;
                        setInterval(()=>{
                            this.img.style.display = 'none'
                        },1000)
                        break;
                    }
                    case this.HURT:{
                        this.setHurt()
                        break;
                    }
                    case this.IDLE:{
                        this.setIdle()
                        break;
                    }
                    case this.WALK:{
                        this.setWalk()
                        break;
                    }
                    default:break;
                }
            }
            this.spritePos++;
            this.checkCollide();
            if(!this.stop){
                this.move();
            } else {
                if(this.state !== this.DEATH){
                    if(this.state !== this.HURT ){
                        this.changeAnimate(this.ATTACK);
                    }
                }
            }
            this.animate()
        },150)
    }
    animate(){
        if(this.spritePos > this.spriteMaxPos){
            this.spritePos = 0;
            if (this.state === this.ATTACK){
                lives--;
                updateHearts();
            }
            if(this.state === this.HURT){
                this.changeAnimate(this.ATTACK, 6);
                if(this.dir > 0){
                    this.spritePos = 1;
                }
            }
            if(this.state === this.DEATH){
                clearInterval(this.timer);
                isLeftBlocked = false;
                isRightBlocked = false;
                if(this.dir > 0){
                    this.spritePos = 5;
                }
            }
        }
        this.img.style.left = -(this.spritePos * this.blockSize)+'px'
    }
    setAttack(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'enemy_attack.png';
        this.spriteMaxPos = 5;
    }
    setDeath(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'enemy_death.png';
        this.spriteMaxPos = 5;
    }
    setHurt(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'enemy_hurt.png';
        this.spriteMaxPos = 2;
    }
    setIdle(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'enemy_idle.png';
        this.spriteMaxPos = 3;
    }
    setWalk(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'enemy_walk.png';
        this.spriteMaxPos = 5;
    }
    changeAnimate(stateStr, fps){
        this.fps = fps
        this.state = stateStr;
        this.animateWaschange = true;
    }
    move(){
        if(this.posX > (this.startX + 6)){
            this.dir *= -1;
            this.img.style.transform = 'scale(-1,1)'
        } else  if(this.posX <= this.startX){
            this.dir = Math.abs(this.dir);
            this.img.style.transform = 'scale(1,1)'
        }
        this.posX += this.dir;
        this.block.style.left = (this.posX * 32)+'px';
    }
    checkHurt(){
        if(wasHeroHit){
            if(this.lives <= 10){
                wasHeroHit = false;
                this.changeAnimate(this.DEATH,6 );

            } else{
                wasHeroHit = false
                this.changeAnimate(this.HURT, 3)
                this.showHurt();
                this.lives -= 10;
            }
        }
    }
    checkCollide(){
        if (heroY === this.posY){
            if(heroX === this.posX){
                //атака с левой стороны
                this.checkHurt();
                isRightBlocked = true
                this.stop = true
            } else if(heroX === (this.posX + 3)){
                //атака с правой стороны
                this.checkHurt();
                isLeftBlocked = true
                this.stop = true
            } else {
                isRightBlocked = false
                isLeftBlocked = false
                this.stop = false;
                this.changeAnimate(this.WALK,6)
            }
        } else {
            isRightBlocked = false
            isLeftBlocked = false
            this.stop = false;
            this.changeAnimate(this.WALK,6)
        }
    }
    showHurt(){
        let pos = 0
        let text = window.document.createElement('p');
        text.innerText = '-10';
        text.style.position = 'absolute';
        text.style.left = Number.parseInt(this.block.style.left + 70)+'px'
        // console.log(text.style.left)
        text.style.bottom = Number.parseInt(this.block.style.bottom + 32)+'px'
        // console.log(text.style.bottom)
        text.style.fontFamily = '\'Bungee Spice\', cursive'
        let hurtTimer = setInterval(()=>{
            text.style.bottom = `${Number.parseInt(text.style.bottom) + 16}px`
            if(pos > 2){
                clearInterval(hurtTimer);
                text.style.display = 'none';
            }
            pos++
        },100)
        gameWrapper.appendChild(text)
    }
    moveRight(){
        this.startX += 1;
        this.posX += 1;
    }
    moveLeft(){
        this.startX -= 1;
        this.posX -= 1;
    }
    getRandomOffset(max){
        let rand = Math.floor(Math.random() * max);
        return rand;
    }
}
class Enemy1 extends Enemy{
    constructor(x,y) {
        super(x,y,'hero_img/Enemy1/');
    }
    setAttack(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'GraveRobber_attack2.png';
        this.spriteMaxPos = 5;
    }
    setHurt(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'GraveRobber_hurt.png';
        this.spriteMaxPos = 2;
    }
    setDeath(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'GraveRobber_death.png';
        this.spriteMaxPos = 5;
    }
    setWalk(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'GraveRobber_walk.png';
        this.spriteMaxPos = 5;
    }
}
class Enemy2 extends Enemy{
    constructor(x,y) {
        super(x,y,'hero_img/Enemy2/');
    }
    setAttack(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'SteamMan_attack1.png';
        this.spriteMaxPos = 5;
    }
    setHurt(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'SteamMan_hurt.png';
        this.spriteMaxPos = 2;
    }
    setDeath(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'SteamMan_death.png';
        this.spriteMaxPos = 5;
    }
    setWalk(){
        this.img.style.width = (this.blockSize * this.fps)+'px';
        this.img.src = this.sourceImg + 'SteamMan_walk.png';
        this.spriteMaxPos = 5;
    }
}


class Heart{
    img;
    x;
    constructor(x, src) {
        this.x = x + 1;
        this.img = document.createElement('img');
        this.img.src = src;
        this.img.style.position = 'absolute';
        this.img.style.left = (this.x * 32)+'px';
        this.img.style.width = 32+'px';
        this.img.style.height = 32+'px';

        gameWrapper.appendChild(this.img);
    }
}

class HeartHeroDamage extends Heart{
    constructor(x) {
        super(x, 'hero_img/heart_hero_damage.png');
    }

}
class HeartHero extends Heart{
    constructor(x) {
        super(x, 'hero_img/heart_hero.png');
    }

}

const lifeCycle = () => {
    timer = setInterval(() => {
        if(hit){
            hitHandler();
        } else if (jump){
            jumpHandler();
        } else  if(fall){
            fallHandler();
        } else {
            standHandler();
        }
    },100);
}

const addHearts = () => {
    // let heartDamage = new HeartHeroDamage(0);
    // let heartHero = new HeartHero(1);
    for(let i = 0; i < maxLives; i++ ){
        let heartHeroDamage = new HeartHeroDamage(i);
        let heartHero = new HeartHero(i);
        heartsArray.push(heartHero);
    }
}
const updateHearts = () => {
    if(lives < 0){
        finalTimerText.innerHTML = 'Game Over'
        nameUser = prompt('ведите ваше имя');
        alert(`Ваши очки ${score}`)

    }
    for(let i = 0; i < lives; i++ ){
        heartsArray[i].img.style.display = 'block';
    }
    for(let i = lives; i < maxLives; i++ ){
        heartsArray[i].img.style.display = 'none';
    }
}
const createBackImg = (i) => {
    let img = window.document.createElement('img');
    img.src = "hero_img/background.png";
    img.style.position = 'absolute';
    img.style.left = (i * window.screen.width)-32+'px';
    img.style.bottom = 32 + 'px';
    img.style.width = window.screen.width + 'px';
    img.style.zIndex ='-1';
    gameWrapper.appendChild(img);
    objArray.push(img);
}
const addBackgroundImages = () => {
    for (let i = 0; i < 3; i++){
        createBackImg(i);
    }
}
const createImgElement = (src, x, y) => {
    let img = window.document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = (x * 32)+'px';
    img.style.bottom = (y * 32)+'px';
    img.style.zIndex = '1';
    img.style.transform = 'scale(2,2) translate(-25%, -25%)'
    gameWrapper.appendChild(img);
    objArray.push(img);
}
const addDecorationElement = (floor1, floor2, floor3) => {
    //деревья
    createImgElement('hero_img/decoration/tree.png', 4, floor1);
    createImgElement('hero_img/decoration/three_2.png', 35, floor1);
    createImgElement('hero_img/decoration/tree.png', 65, floor2);
    // камни
    createImgElement('hero_img/decoration/stone.png', 10, floor1);
    createImgElement('hero_img/decoration/stone_2.png', 111, floor1);
    createImgElement('hero_img/decoration/stone.png', 38, floor1);
    createImgElement('hero_img/decoration/stone_2.png', 102, floor3);
    //краш дерево
    createImgElement('hero_img/decoration/crash_tree.png', 22, floor2);
    createImgElement('hero_img/decoration/crash_tree2.png', 26, floor2);
    //кусты
    createImgElement('hero_img/decoration/grass.png', 84, floor1);
    createImgElement('hero_img/decoration/grass_2.png', 19, floor2);
    createImgElement('hero_img/decoration/grass_2.png', 50, floor2);
    createImgElement('hero_img/decoration/grass.png', 69, floor2);
    createImgElement('hero_img/decoration/grass_2.png', 100, floor2);
    createImgElement('hero_img/decoration/grass.png', 13, floor3);
    //боксы
    createImgElement('hero_img/decoration/box_2.png', 116, floor1);
    createImgElement('hero_img/decoration/box.png', 87, floor1);
    createImgElement('hero_img/decoration/box.png', 46, floor2);
    createImgElement('hero_img/decoration/box.png', 14, floor3);
    createImgElement('hero_img/decoration/box.png', 104, floor3);


}
const addEnemies = () => {
    let enemy1 = new Enemy1(8, 12);
    let enemy2 = new Enemy2(19, 5);
    let enemy3 = new Enemy1(40, 5);
    let enemy4 = new Enemy(62, 5,'hero_img/Enemy/');
    let enemy5 = new Enemy2(78, 1);
    let enemy6 = new Enemy1(93, 5);
    let enemy7 = new Enemy(98, 12,'hero_img/Enemy/');
}
const buildLevel = () => {
    let floor1 = 0;
    let floor2 = 4;
    let floor3 = 11;
    addDecorationElement(floor1 + 1, floor2 + 1, floor3 + 1);

    creatTilesPlatform(0, 14, floor1);
    creatTilesPlatform(33, 41, floor1);
    creatTilesPlatform(76, 91, floor1);
    creatTilesPlatform(106, 143, floor1);
    creatTilesPlatform(15, 32, floor2);
    creatTilesPlatform(42, 53, floor2);
    creatTilesPlatform(64, 75, floor2);
    creatTilesPlatform(92, 105, floor2);
    creatTilesPlatform(8, 20, floor3);
    creatTilesPlatform(54, 63, floor3);
    creatTilesPlatform(75, 87, floor3);
    creatTilesPlatform(99, 111, floor3);
    createTilesBlackBlock(15, 32, floor2);
    createTilesBlackBlock(42, 53, floor2);
    createTilesBlackBlock(64, 75, floor2);
    createTilesBlackBlock(92, 105, floor2);
    createTilesBlackBlock(54, 63, floor3);

    addEnemies();

}
const addStartScreen = () => {
    let div = window.document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = '3'
    div.style.left = 0+'px';
    div.style.bottom = 0+'px';
    div.style.width = '100%';
    div.style.height = '100vh';
    div.style.backgroundColor = '#38002c';
    div.style.display = 'grid';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    gameWrapper.appendChild(div);
    let btn = window.document.createElement('button');
    btn.innerText = 'PLAY';
    btn.style.fontFamily = 'Bungee Spice', "cursive";
    btn.style.fontSize = '30px';
    btn.style.backgroundColor = '#8babbf';
    btn.style.color = '#38002c';
    btn.style.padding = '20px';
    btn.style.border = 'none';
    btn.addEventListener('click', () => {
        div.style.display = 'none';
        fsBtn.src = 'cancel.png';
        gameWrapper.requestFullscreen();
    });
    let btnTwo = window.document.createElement('button');
    btnTwo.innerText = 'RECORDS';
    btnTwo.style.fontFamily = 'Bungee Spice', "cursive";
    btnTwo.style.fontSize = '30px';
    btnTwo.style.backgroundColor = '#8babbf';
    btnTwo.style.color = '#38002c';
    btnTwo.style.padding = '20px';
    btnTwo.style.border = 'none';
    btnTwo.addEventListener('click', () => {
        div.style.display = 'none';
        fsBtn.src = 'cancel.png';
        gameWrapper.requestFullscreen();
    });
    div.appendChild(btn);
    div.appendChild(btnTwo);

}

const start = () => {
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
    addStartScreen()
}

start();