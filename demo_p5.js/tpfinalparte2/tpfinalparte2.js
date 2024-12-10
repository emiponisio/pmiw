//link al video:https://youtu.be/UH1h6kZ2C-w?feature=shared

//variables globales:
let juego; //declara una variable juego
let imgJugador, imgMedusa, imgDory;
let sonidoFondo, sonidoRecogeDory, sonidoTocaMedusa;

function preload() 
  {
   imgJugador = loadImage('data/marlin.png');
   imgMedusa = loadImage('data/medusa.png');
   imgDory = loadImage('data/dory.png');
   sonidoFondo = loadSound('data/sonidoFondo.mp3');
   sonidoRecogeDory = loadSound('data/sonidoRecogeDory.mp3');
   sonidoTocaMedusa = loadSound('data/sonidoTocaMedusa.mp3');
  }

function setup() 
  {
    juego= new Juego();//creamos una instancia (objeto)de la clase juego y se ejecuta el constructor 
    juego.resetJuego(); //inicializa el juego
  }

function draw() {
  background(0, 100, 200);
  juego.fondo.mostrar(juego.dificultad);  //se llama del objeto juego a su propiedad objeto fondo a su método mostrar pasandole por argumento el nivel de dificultad
  if (juego.estado === "inicio") {
    juego.mostrarInstrucciones();
  } else if (juego.estado === "jugando") {
    juego.actualizarJuego();
    juego.comprobarTiempoNivel();
  } else if (juego.estado === "resultado") {
    juego.mostrarResultado();
  } else if (juego.estado === "creditos") {
    juego.mostrarCreditos(); 
  }
    juego.mostrarNivelDificultad();
}

class Juego 
  {
    constructor (){
    sonidoFondo.loop();
    createCanvas(640, 480);
    this.fondo = new Fondo();
    this.puntaje = new Puntaje();
    this.dory = new Dory(random(width), random(-200, 0), 2);
    this.tiempoInicio=millis();
    this.tiempoNivel=15000; 
    this.nivelcompletado=false;
    this.jugador=null;
    this.medusas=null;
    this.tocoMedusa=false;
    this.cantidadMedusas=5;
    this.velocidadBase=2;
    this.dificultad=1;
    this.estado= "inicio";
}

mostrarInstrucciones(){
  textSize(20);
  fill(255);
  textAlign(CENTER);
  text("Ayuda a Marlin a cruzar el campo de medusas.", width / 2, height / 2 - 40);
  text("Usa las flechas para moverte.", width / 2, height / 2);
  text("Presiona Enter para comenzar.", width / 2, height / 2 + 40);
  text("Dificultad: " + (this.dificultad === 1 ? "Fácil" : this.dificultad === 2 ? "Medio" : "Difícil"), width / 2, height / 2 + 80);
}
/*
Inicializa el juego
*/
resetJuego (){
  this.jugador = new Jugador(width / 2, height - 50);//crea un objeto de la clase jugador 
  this.medusas = []; //se declara un arreglo vacío
  this.nivelCompletado = false;  
  this.tocoMedusa = false;
  if (this.dificultad === 1) {
    this.cantidadMedusas = 5;
    this.velocidadBase = 2;
  } else if (this.dificultad === 2) {
    this.cantidadMedusas = 12;
    this.velocidadBase = 2.5;
  } else if (this.dificultad === 3) {
    this.cantidadMedusas = 12;  
    this.velocidadBase = 2.5;    
  }

  for (let i = 0; i < this.cantidadMedusas; i++) {
    this.medusas.push(new Medusa(random(width), random(-500, 0), random(this.velocidadBase - 1, this.velocidadBase + 3)));
  }

  this.dory.reaparecer();
  this.puntaje.reiniciar();
  this.estado = "inicio";
}

mostrarNivelDificultad() {
  textSize(20);
  fill(255);
  textAlign(LEFT);
  text("Nivel: " + (this.dificultad === 1 ? "Fácil" : this.dificultad === 2 ? "Medio" : "Difícil"), 10, 30);
}

comprobarTiempoNivel() {
  this.tiempoTranscurrido = millis() - this.tiempoInicio;
  if (this.tiempoTranscurrido > this.tiempoNivel) {
    if (this.dificultad === 3 && !this.tocoMedusa) {
      this.estado = "resultado"; 
      this.nivelCompletado = true;
    } else {
      this.cambiarNivel(); 
    }
  }
}
 cambiarNivel() {
  if (this.dificultad < 3) {
    this.dificultad++;
  } else {
    if (!this.tocoMedusa) {
      
      this.estado = "resultado"; 
      this.nivelCompletado = true; 
    } else {
     
      this.estado = "resultado"; 
    }
  }
  this.resetJuego();
  this.tiempoInicio = millis(); 
}

actualizarJuego() 
{   
  this.jugador.mostrar();
  this.jugador.mover();
  for (this.medusa of this.medusas) {
    this.medusa.mostrar();
    this.medusa.mover();
    if (this.medusa.toca(this.jugador)) {
      this.tocoMedusa = true;
      sonidoTocaMedusa.play(); 
 
      this.estado = "resultado"; 
      break;
    }
  }

  this.dory.mostrar();
  this.dory.mover();

  if (this.dory.toca(this.jugador)) {
    this.puntaje.aumentar(15);
    sonidoRecogeDory.play(); 
    this.dory.reaparecer();
  }

  this.puntaje.mostrar();
}

 mostrarResultado() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  if (this.estado === "resultado" && this.nivelCompletado) {
    text("¡Ganaste! Marlin atravesó las medusas.", width / 2, height / 2);
    text("Puntuación Total: " + this.puntaje.puntos, width / 2, height / 2 + 40);
  } else if (this.estado === "resultado") {
    text("¡Perdiste! Marlin tocó una medusa.", width / 2, height / 2);
    text("Puntuación Total: " + this.puntaje.puntos, width / 2, height / 2 + 40);
  }
  textSize(20);
  text("Presiona R para reiniciar o C para ver los créditos.", width / 2, height / 2 + 80);
}

mostrarCreditos() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text("Créditos:", width / 2, height / 2 - 60);
  textSize(20);
  text("Hecho por: Francisco Pinna Dietrich y Emilia Ponisio", width / 2, height / 2 - 30);

}
}



class Fondo {
  mostrar(dificultad) {
    if (dificultad === 1) {
      background(0, 150, 255);
    } else if (dificultad === 2) {
      background(0, 100, 200);
    } else if (dificultad === 3) {
      background(0, 50, 150);
    }
  }
}

class Puntaje {
  constructor() {
    this.puntos = 0;
  }

  aumentar(cantidad) {
    this.puntos += cantidad;
  }

  reiniciar() {
    this.puntos = 0;
  }

  mostrar() {
    textSize(20);
    fill(255);
    textAlign(RIGHT);
    text("Puntos: " + this.puntos, width - 10, 30);
  }
}

class Jugador {
  constructor(x, y)// fijamos la posición x y del puntero del jugador)
  { 
    this.x = x;
    this.y = y;
    this.tam = 30;
    }

  mostrar() {
    image(imgJugador, this.x, this.y, this.tam, this.tam); //muestra la imagen de marlin en las coordenadas que se pasan por argumento y con tamaño indicado
  }

  mover() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.tam) this.x += 5;
    if (keyIsDown(UP_ARROW) && this.y > 0) this.y -= 5;
    if (keyIsDown(DOWN_ARROW) && this.y < height - this.tam) this.y += 5;
  }
}

class Medusa {
  constructor(x, y, velocidad) {
    this.x = x;
    this.y = y;
    this.velocidad = velocidad;
    this.tam = 40;
  }

  mostrar() {
    image(imgMedusa, this.x, this.y, this.tam, this.tam);
  }

  mover() {
    this.y += this.velocidad;
    if (this.y > height) {
      this.y = random(-200, 0);
      this.x = random(width);
    }
  }

  toca(jugador) {
    return dist(this.x, this.y, jugador.x, jugador.y) < (this.tam + jugador.tam) / 2;
  }
}

class Dory {
  constructor(x, y, velocidad) {
    this.x = x;
    this.y = y;
    this.velocidad = velocidad;
    this.tam = 40;
    this.activa = true;
  }

  mostrar() {
    if (this.activa) {
      image(imgDory, this.x, this.y, this.tam, this.tam);
    }
  }

  mover() {
    if (this.activa) {
      this.y += this.velocidad;
      if (this.y > height) {
        this.reaparecer();
      }
    }
  }

  toca(jugador) {
    if (this.activa && dist(this.x, this.y, jugador.x, jugador.y) < (this.tam + jugador.tam) / 2) {
      this.activa = false;
      return true;
    }
    return false;
  }

  reaparecer() {
    this.x = random(width);
    this.y = random(-200, 0);
    this.activa = true;
  }
}


function keyPressed() {
  if (juego.estado === "inicio" && keyCode === ENTER) {
    juego.estado = "jugando";
  } else if (juego.estado === "resultado" && (key === 'R' || key === 'r')) {
    juego.resetJuego();
    juego.dificultad = 1;
    juego.estado = "inicio"; // Cambiar al estado de "inicio" después de presionar "R"
  } else if (juego.estado === "resultado" && (key === 'C' || key === 'c')) {
    juego.estado = "creditos"; // Cambiar a la pantalla de créditos
  } else if (juego.estado === "creditos" && (key === 'R' || key === 'r')) {
    juego.resetJuego(); // Reinicia el juego y vuelve al inicio
    juego.dificultad = 1; // Asegura que la dificultad esté en nivel 1
    juego.estado = "inicio"; // Regresar al estado "inicio" desde los créditos
  }
}
