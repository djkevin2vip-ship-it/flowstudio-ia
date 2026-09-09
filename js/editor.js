let inicio = 0;
let fim = null;

const player = document.getElementById("player");

function marcarInicio() {
  inicio = player.currentTime;
  document.getElementById("inicio").textContent = inicio.toFixed(2);
}

function marcarFim() {
  fim = player.currentTime;

  if (fim <= inicio) {
    alert("O fim precisa ser depois do início.");
    fim = null;
    return;
  }

  document.getElementById("fim").textContent = fim.toFixed(2);
}

function reproduzirTrecho() {
  if (fim === null) {
    alert("Marque o início e o fim primeiro.");
    return;
  }

  player.currentTime = inicio;
  player.play();

  function parar() {
    if (player.currentTime >= fim) {
      player.pause();
      player.removeEventListener("timeupdate", parar);
    }
  }

  player.addEventListener("timeupdate", parar);
}

function limparCorte() {
  inicio = 0;
  fim = null;
  document.getElementById("inicio").textContent = "0.00";
  document.getElementById("fim").textContent = "-";
}