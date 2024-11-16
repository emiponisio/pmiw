//link al video:https://youtu.be/UH1h6kZ2C-w?feature=shared

let medusas = [];
let jugador;
let estado = "inicio";
let fondo, puntaje, dory;
let imgJugador, imgMedusa, imgDory;
let sonidoFondo, sonidoRecogeDory, sonidoTocaMedusa;
let dificultad = 1; 
let tiempoInicio;
let tiempoNivel = 15000;
let nivelCompletado = false;
let tocoMedusa = false; 

function preload() {
  imgJugador = loadImage('data/marlin.png');
  imgMedusa = loadImage('data/medusa.png');
  imgDory = loadImage('data/dory.png');
  sonidoFondo = loadSound('data/sonidoFondo.mp3');
  sonidoRecogeDory = loadSound('data/sonidoRecogeDory.mp3');
  sonidoTocaMedusa = loadSound('data/sonidoTocaMedusa.mp3');
}

function setup() {
  createCanvas(640, 480);
  fondo = new Fondo();
  puntaje = new Puntaje();
  dory = new Dory(random(width), random(-200, 0), 2);
  resetJuego();
  tiempoInicio = millis();
  sonidoFondo.loop();
}

function draw() {
  background(0, 100, 200);
  fondo.mostrar(dificultad);

  if (estado === "inicio") {
    mostrarInstrucciones();
  } else if (estado === "jugando") {
    actualizarJuego();
    comprobarTiempoNivel();
  } else if (estado === "resultado") {
    mostrarResultado();
  } else if (estado === "creditos") {
    mostrarCreditos(); 
  }

  mostrarNivelDificultad();
}

function resetJuego() {
  jugador = new Jugador(width / 2, height - 50);
  medusas = [];
  nivelCompletado = false;  
  tocoMedusa = false; 

  let cantidadMedusas = 10 + (dificultad - 1) * 5;
  let velocidadBase = 2 + dificultad;

  if (dificultad === 1) {
    cantidadMedusas = 5;
    velocidadBase = 2;
  } else if (dificultad === 2) {
    cantidadMedusas = 12;
    velocidadBase = 2.5;
  } else if (dificultad === 3) {
    cantidadMedusas = 12;  
    velocidadBase = 2.5;    
  }

  for (let i = 0; i < cantidadMedusas; i++) {
    medusas.push(new Medusa(random(width), random(-500, 0), random(velocidadBase - 1, velocidadBase + 3)));
  }

  dory.reaparecer();
  puntaje.reiniciar();
  estado = "inicio";
}

function mostrarInstrucciones() {
  textSize(20);
  fill(255);
  textAlign(CENTER);
  text("Ayuda a Marlin a cruzar el campo de medusas.", width / 2, height / 2 - 40);
  text("Usa las flechas para moverte.", width / 2, height / 2);
  text("Presiona Enter para comenzar.", width / 2, height / 2 + 40);
  text("Dificultad: " + (dificultad === 1 ? "Fácil" : dificultad === 2 ? "Medio" : "Difícil"), width / 2, height / 2 + 80);
}

function mostrarNivelDificultad() {
  textSize(20);
  fill(255);
  textAlign(LEFT);
  text("Nivel: " + (dificultad === 1 ? "Fácil" : dificultad === 2 ? "Medio" : "Difícil"), 10, 30);
}

function comprobarTiempoNivel() {
  let tiempoTranscurrido = millis() - tiempoInicio;
  if (tiempoTranscurrido > tiempoNivel) {
    // Al finalizar el tiempo
    if (dificultad === 3 && !tocoMedusa) {
  
      estado = "resultado"; 
      nivelCompletado = true;
    } else {
      cambiarNivel(); 
    }
  }
}

function cambiarNivel() {
  if (dificultad < 3) {
    dificultad++;
  } else {
    if (!tocoMedusa) {
      
      estado = "resultado"; 
      nivelCompletado = true; 
    } else {
     
      estado = "resultado"; 
    }
  }
  resetJuego();
  tiempoInicio = millis(); 
}

function actualizarJuego() {
  if (jugador) {
    jugador.mostrar();
    jugador.mover();
  }

  for (let medusa of medusas) {
    medusa.mostrar();
    medusa.mover();
    if (medusa.toca(jugador)) {
      tocoMedusa = true;
      sonidoTocaMedusa.play(); 
 
      estado = "resultado"; 
      break;
    }
  }

  dory.mostrar();
  dory.mover();

  if (dory.toca(jugador)) {
    puntaje.aumentar(15);
    sonidoRecogeDory.play(); 
    dory.reaparecer();
  }

  puntaje.mostrar();
}

function mostrarResultado() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  if (estado === "resultado" && nivelCompletado) {
    text("¡Ganaste! Marlin atravesó las medusas.", width / 2, height / 2);
    text("Puntuación Total: " + puntaje.puntos, width / 2, height / 2 + 40);
  } else if (estado === "resultado") {
    text("¡Perdiste! Marlin tocó una medusa.", width / 2, height / 2);
    text("Puntuación Total: " + puntaje.puntos, width / 2, height / 2 + 40);
  }
  textSize(20);
  text("Presiona R para reiniciar o C para ver los créditos.", width / 2, height / 2 + 80);
}

function mostrarCreditos() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text("Créditos:", width / 2, height / 2 - 60);
  textSize(20);
  text("Hecho por: Francisco Pinna Dietrich y Emilia Ponisio", width / 2, height / 2 - 30);
;
}

function keyPressed() {
  if (estado === "inicio" && keyCode === ENTER) {
    estado = "jugando";
  } else if (estado === "resultado" && (key === 'R' || key === 'r')) {
    resetJuego();
    dificultad = 1; // Reiniciar la dificultad al nivel 1
    estado = "inicio"; // Cambiar al estado de "inicio" después de presionar "R"
  } else if (estado === "resultado" && (key === 'C' || key === 'c')) {
    estado = "creditos"; // Cambiar a la pantalla de créditos
  } else if (estado === "creditos" && (key === 'R' || key === 'r')) {
    resetJuego(); // Reinicia el juego y vuelve al inicio
    dificultad = 1; // Asegura que la dificultad esté en nivel 1
    estado = "inicio"; // Regresar al estado "inicio" desde los créditos
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tam = 30;
  }

  mostrar() {
    image(imgJugador, this.x, this.y, this.tam, this.tam);
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
