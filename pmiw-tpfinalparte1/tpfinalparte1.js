//link a video explicativo https://youtu.be/PsLBPbmXXkM

let impa = [];
let txpa = [];
let estado = "ini";
let sonido; // Variable para el sonido

function preload() {
  // Cargar las imágenes
  for (let i = 1; i < 15; i++) {
    impa[i] = loadImage("img" + i + ".jpg", img => {
      console.log("Imagen cargada: img" + i + ".jpg");
    }, err => {
      console.error("Error cargando imagen: img" + i + ".jpg", err);
    });
  }
  
  // Cargar el sonido
  sonido = loadSound('sonido.mp3', 
    () => console.log("Sonido cargado: sonido.mp3"),
    (err) => console.error("Error cargando sonido: ", err)
  );
}

function setup() {
  createCanvas(640, 480);
  
  // Arreglos de texto con la historia de "Buscando a Nemo"
  txpa[0] = "Créditos: Hecho por Francisco Pinna Dietrich y Emilia Ponisio";
  txpa[1] = "Buscando a Nemo";
  txpa[2] = "En el gran arrecife de coral, Marlin es un pez payaso sobreprotector que cuida de su hijo Nemo. Pero Nemo, curioso y valiente, decide explorar más allá del arrecife y es capturado por un buzo. ¿Qué hará Marlin, quedarse en el arrecife o ir a buscarlo?";
  txpa[3] = "Marlin se queda en el arrecife, temeroso de salir, y vive lamentándose por no haber ido tras Nemo.";
  txpa[4] = "Decidido, Marlin emprende una travesía por el océano en busca de su hijo. En el camino, conoce a Dory, un pez azul con problemas de memoria. ¿Marlin decide continuar solo o confiar en Dory?";
  txpa[5] = "Marlin sigue solo, pero rápidamente se pierde en el vasto océano, sin saber hacia dónde ir.";
  txpa[6] = "Juntos, Marlin y Dory se enfrentan a tiburones amistosos y una colosal medusa. ¿Deciden nadar por un oscuro cañón o sobre él?";
  txpa[7] = "Marlin y Dory nadan sobre el cañón y se encuentran con un enjambre de medusas peligrosas que los hiere gravemente.";
  txpa[8] = "A pesar de las dificultades, logran encontrar una pista importante: la dirección del dentista que se llevó a Nemo. Dory lo recuerda justo a tiempo. ¿Siguen la pista o se rinden?";
  txpa[9] = "Si se rinden, nunca sabrán lo cerca que estuvieron de encontrar a Nemo.";
  txpa[10] = "Deciden seguir la pista y llegan a Sídney, nadan hasta la superficie.";
  txpa[11] = "Dentro de la pecera del dentista, Nemo ha hecho nuevos amigos que están planeando un escape.";
  txpa[12] = "Nemo sigue el plan y, aunque enfrenta dificultades, finalmente logra escapar de la pecera y reunirse con Marlin y Dory en el océano. ¡F I N!";
}

function draw() {
  background(0);
  
  if (impa.length === 0 || impa[2] === undefined) {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Cargando...", width / 2, height / 2);
    return;
  }
  
  // Lógica para mostrar las pantallas según el estado
  if (estado === "ini") {
    pantall(2, 1);
    dosBotones("Créditos", "Iniciar");
  } else if (estado === "creditos") {
    pantall(1, 0);
  } else if (estado === "pan1") {
    pantall(3, 2);
    dosBotones("Quedarse", "Buscarlo");
  } else if (estado === "pan2") {
    pantall(4, 3);
  } else if (estado === "pan3") {
    pantall(5, 4);
    dosBotones("Confiar en Dory", "Seguir solo");
  } else if (estado === "pan4") {
    pantall(6, 5);
  } else if (estado === "pan5") {
    pantall(5, 6);
  } else if (estado === "pan6") {
    pantall(7, 6);
    dosBotones("Nadar sobre", "Cañón oscuro");
  } else if (estado === "pan7") {
    pantall(8, 7);
  } else if (estado === "pan8") {
    pantall(9, 8);
    dosBotones("Rendirse", "seguir pista");
  } else if (estado === "pan9") {
    pantall(11, 9);
  } else if (estado === "pan10") {
    pantall(12, 10);  
  } else if (estado === "pan11") {
    pantall(13, 11);  
  } else if (estado === "pan12") {
    pantall(14, 12);  
  }
}

function pantall(nF, nT) {
  textSize(16);  
  fill(255);
  image(impa[nF], 0, 0, 640, 480);  
  textAlign(LEFT);  
  textWrap(WORD);  
  text(txpa[nT], 50, 50, 540, 380);  
}

function dosBotones(b1, b2) {
  // Botón 1
  fill(200);
  rect(80, 400, 200, 60, 10); // Usamos un rectángulo con bordes redondeados
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text(b1, 180, 435);
  
  // Botón 2
  fill(200);
  rect(360, 400, 200, 60, 10); // Usamos un rectángulo con bordes redondeados
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text(b2, 460, 435);
}

function dis(px, py, w, h) {
  return mouseX > px && mouseX < px + w && mouseY > py && mouseY < py + h;
}

function mousePressed() {
  if (estado === "ini") {
    if (dis(80, 400, 200, 60)) { // Área del primer botón
      estado = "creditos";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la pantalla de créditos
      }
    } else if (dis(360, 400, 200, 60)) { // Área del segundo botón
      estado = "pan1";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido al iniciar
      }
    }
  } else if (estado === "creditos") {
    estado = "ini";
  } else if (estado === "pan1") {
    if (dis(80, 400, 200, 60)) {
      estado = "pan2";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Quedarse"
      }
    } else if (dis(360, 400, 200, 60)) {
      estado = "pan3";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Buscarlo"
      }
    }
  } else if (estado === "pan2") {
    estado = "ini";
  } else if (estado === "pan3") {
    if (dis(80, 400, 200, 60)) {
      estado = "pan6";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Confiar en Dory"
      }
    } else if (dis(360, 400, 200, 60)) {
      estado = "pan4";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Seguir solo"
      }
    }
  } else if (estado === "pan4") {
    estado = "ini";
  } else if (estado === "pan6") {
    if (dis(80, 400, 200, 60)) {
      estado = "pan7";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Nadar sobre"
      }
    } else if (dis(360, 400, 200, 60)) {
      estado = "pan8";
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Cañón oscuro"
      }
    }
  } else if (estado === "pan7") {
    estado = "ini";
  } else if (estado === "pan8") {
    if (dis(80, 400, 200, 60)) {
      estado = "pan9";  
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Rendirse"
      }
    } else if (dis(360, 400, 200, 60)) {
      estado = "pan10";  
      if (sonido.isLoaded()) {
        sonido.play(); // Reproducir sonido en la opción "Seguir pista"
      }
    }
  } else if (estado === "pan9") {
    estado = "ini";  
  } else if (estado === "pan10") {
    estado = "pan11"; 
    if (sonido.isLoaded()) {
      sonido.play(); // Reproducir sonido al avanzar a la siguiente pantalla
    }
  } else if (estado === "pan11") {
    estado = "pan12";  
    if (sonido.isLoaded()) {
      sonido.play(); // Reproducir sonido al avanzar a la siguiente pantalla
    }
  } else if (estado === "pan12") {
    estado = "ini";  
  }
}
