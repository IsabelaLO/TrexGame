//declarando variáveis
var trex, trex_running, trexCollided;
var bordas;
var solo, imagemSolo;
var soloInvisivel;
var nuvens, imagemNuvens, nuvemGp;
var cacto, imagemCacto1, imagemCacto2, imagemCacto3, imagemCacto4, imagemCacto5, imagemCacto6, cactosGp;
var pontos = 0;
var play = 1;
var end = 0;
var gameState = play;
var gameOver, imagemGameOver;
var restart, imagemRestart;
var somPulo, somMorte, somPontos;
var recorde = 0;

//preload carrega as midías
function preload(){
 //animação do Trex
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  imagemNuvens = loadImage('cloud.png');

  imagemCacto1 = loadImage('obstacle1.png');
  imagemCacto2 = loadImage('obstacle2.png');
  imagemCacto3 = loadImage('obstacle3.png');
  imagemCacto4 = loadImage('obstacle4.png');
  imagemCacto5 = loadImage('obstacle5.png');
  imagemCacto6 = loadImage('obstacle6.png');
  imagemGameOver = loadImage('gameOver.png');
  imagemRestart = loadImage('restart.png');
  //imagem do solo
  imagemSolo = loadImage('ground2.png');
  somPulo =  loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somPontos = loadSound("checkpoint.mp3");
}
//setuo faz aconfiguração
function setup(){
  createCanvas(windowWidth,windowHeight);
  // criando as bordas
  bordas = createEdgeSprites ();
  //crie um sprite de trex
  trex = createSprite(50,height-40,20,50);
  trex.debug = false;
  trex.setCollider ("rectangle", -5, 0, 50, 50, 60);
  //trex.setCollider ("circle", 0, 0, 30);
  // adicione dimensão e posição ao trex
  trex.addAnimation("running", trex_running);
  trex.scale=0.5;
  //sprite do solo
  solo = createSprite(width/2, height-30, width, 2);
  solo.addImage('solo', imagemSolo);
  soloInvisivel = createSprite(width/2, height-10, width, 2);
  soloInvisivel.visible = false;

  trex.addAnimation("collide", trexCollided);

  nuvemGp = new Group();
  cactosGp = new Group();

  gameOver = createSprite(width/2, height-126, 100, 10);
  gameOver.addImage(imagemGameOver);
  gameOver.scale = 0.5
  gameOver.visible = false;
  restart = createSprite(width/2, height-78, 40, 40);
  restart.addImage(imagemRestart);
  restart.scale = 0.4
  restart.visible = false;

}
//draw faz o movimento, a ação do jogo
function draw(){
  if (trex.isTouching(cactosGp)) {
  gameState=end;  
  //somMorte.play();
  }

  if (gameState===play) {
    pontos += Math.round(getFrameRate()/60);
    if (pontos%100==0 &&pontos>0) {
      somPontos.play();
    }
    if (touches.length>0 || keyDown("space")&& trex.y > height-100){
      trex.velocityY = -10;
      somPulo.play();
      touches=[];
 }
 solo.velocityX = -(10+pontos/100);
 if(solo.x < 200){
    solo.x=solo.width/2;
 }
 createClounds();
 cactos();
  }
  if (gameState===end) {
    trex.changeAnimation("collide", trexCollided);
    solo.velocityX = 0;
    cactosGp.setVelocityXEach (0);
    nuvemGp.setVelocityXEach (0);
    cactosGp.setLifetimeEach (-1);
    nuvemGp.setLifetimeEach (-1);
    gameOver.visible = true;
    restart.visible = true;
    if (recorde<pontos) {
      recorde = pontos;
    }
    if (mousePressedOver(restart)) {
      gameState=play;
      gameOver.visible = false;
      restart.visible = false;
      nuvemGp.destroyEach ();
      cactosGp.destroyEach ();
      trex.changeAnimation("running", trex_running);
      pontos = 0;
    }
  }
  background("#def6ff");
  // fazero trex pular
 //coordenadas do mouse na tela
  text("X: "+mouseX+"  / Y: "+mouseY,mouseX,mouseY);
  
  fill('pink');
  stroke('purple');
  textSize(18);
  textAlign(CENTER, TOP);
  text("score: "+ pontos,  width-102, height-170);
  text("recorde: "+ recorde,  width-102, height-150);
  
 // chamando a  função de gravidade
  gravidade();
  //colisão do trex com as bordas
  trex.collide (soloInvisivel);
  
  //console.log(trex.y);

  drawSprites();

}
// função de gravidade
function gravidade(){
  trex.velocityY += 0.5;
}

function createClounds() {

  if(frameCount%60==0){
  nuvens = createSprite(width, random(height-146, height-106), 20, 20);
  nuvens.velocityX = -(10+pontos/100); 
  nuvens.addImage(imagemNuvens);
  nuvens.scale = random(0.3, 1.7);
  nuvens.depth = trex.depth - 1;
  nuvens.lifetime = width/nuvens.velocityX;
  nuvemGp.add(nuvens);
}
}

function cactos() {
  
  if (frameCount%50==0) {
    cacto = createSprite(width, height-30);
    cacto.velocityX = -(10+pontos/100);
    cacto.scale = 0.5;
    cacto.lifetime = width/cacto.velocityX;
    cactosGp.add(cacto);
    var sorteioCactos = Math.round(random(1, 6));
    switch (sorteioCactos) {
      case 1: cacto.addImage(imagemCacto1);
      break;  
      
      case 2: cacto.addImage(imagemCacto2);
      break;   

      case 3: cacto.addImage(imagemCacto3);   
      break;   

      case 4: cacto.addImage(imagemCacto4);   
      break;   

      case 5: cacto.addImage(imagemCacto5);   
      break;

      case 6: cacto.addImage(imagemCacto6);
      break;
    }
  }
}