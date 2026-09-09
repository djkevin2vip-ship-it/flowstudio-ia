/* =========================================================
   FLOW STUDIO IA
   SCRIPT.JS — PLAYER DE ÁUDIO
========================================================= */

let audioAtual = null;
let playerAtual = null;
let botaoAtual = null;


/* =========================================================
   TOCAR MÚSICA
========================================================= */

function tocarMusica(arquivo, botao) {

    const card = botao.closest(".project-card");

    /* Se clicou na mesma música */
    if (audioAtual && audioAtual.src.includes(arquivo)) {

        if (audioAtual.paused) {

            audioAtual.play();

            botao.innerHTML = "❚❚ Pausar";

            if (card) {
                card.classList.add("is-playing");
            }

        } else {

            audioAtual.pause();

            botao.innerHTML = "▶ Ouvir projeto";

            if (card) {
                card.classList.remove("is-playing");
            }
        }

        return;
    }


    /* Para música anterior */
    if (audioAtual) {
        audioAtual.pause();
        audioAtual.currentTime = 0;
    }


    /* Remove estados anteriores */
    document
        .querySelectorAll(".project-card")
        .forEach(item => {
            item.classList.remove("is-playing");
        });

    document
        .querySelectorAll(".project-link")
        .forEach(item => {
            item.classList.remove("playing");
            item.innerHTML = "▶ Ouvir projeto";
        });


    /* Cria novo áudio */
    audioAtual = new Audio(arquivo);

    audioAtual.preload = "metadata";

    botaoAtual = botao;


    /* Estado visual */
    botao.classList.add("playing");

    botao.innerHTML = "❚❚ Pausar";

    if (card) {
        card.classList.add("is-playing");
    }


    /* Cria player */
    criarPlayer(arquivo, botao, card);


    /* Começa reprodução */
    audioAtual.play().catch(() => {
        mostrarMensagem("Não foi possível reproduzir este áudio.");
    });


    /* Eventos */

    audioAtual.addEventListener("loadedmetadata", atualizarDuracao);

    audioAtual.addEventListener("timeupdate", atualizarProgresso);

    audioAtual.addEventListener("ended", () => {

        if (botaoAtual) {
            botaoAtual.innerHTML = "▶ Ouvir projeto";
            botaoAtual.classList.remove("playing");
        }

        if (card) {
            card.classList.remove("is-playing");
        }

        if (playerAtual) {
            const playButton =
                playerAtual.querySelector(".player-play");

            if (playButton) {
                playButton.innerHTML = "▶";
            }
        }

    });

}


/* =========================================================
   CRIAR PLAYER
========================================================= */

function criarPlayer(arquivo, botao, card) {

    /* Remove player anterior */
    if (playerAtual) {
        playerAtual.remove();
    }


    /* Nome da música */
    let nomeMusica = "Projeto Flow Studio IA";

    if (arquivo.includes("future-pulse")) {
        nomeMusica = "Future Pulse";
    }

    if (arquivo.includes("neon-dreams")) {
        nomeMusica = "Neon Dreams";
    }

    if (arquivo.includes("human-machine")) {
        nomeMusica = "Human × Machine";
    }
let capaMusica = "covers/future-pulse.jpg";

if (arquivo.includes("neon-dreams")) {
    capaMusica = "covers/neon-dreams.jpg";
}

if (arquivo.includes("human-machine")) {
    capaMusica = "covers/human-machine.jpg";
}


    /* Container */
    const player = document.createElement("div");

    player.className = "audio-player";


    player.innerHTML = `
        <div class="player-info">
<div class="player-cover">
    <img src="${capaMusica}" alt="Capa de ${nomeMusica}">
</div>
            <div class="player-icon">
                ♪
            </div>

            <div class="player-details">

                <strong class="player-title">
                    ${nomeMusica}
                </strong>

                <span class="player-status">
                    FLOW STUDIO IA • REPRODUZINDO
                </span>

            </div>

        </div>


        <div class="player-controls">

            <button
                class="player-play"
                type="button"
                aria-label="Pausar música"
            >
                ❚❚
            </button>

        </div>


        <div class="player-progress-area">

            <span class="player-current">
                0:00
            </span>

            <div
                class="player-progress"
                title="Clique para avançar"
            >
                <div class="player-progress-bar"></div>
            </div>

            <span class="player-duration">
                0:00
            </span>

        </div>


        <div class="player-volume">

            <span>
                🔊
            </span>

            <input
                class="player-volume-control"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value="1"
                aria-label="Volume"
            >

        </div>


        <button
            class="player-close"
            type="button"
            aria-label="Fechar player"
        >
            ×
        </button>
    `;


    document.body.appendChild(player);

    playerAtual = player;


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    const playButton =
        player.querySelector(".player-play");


    playButton.addEventListener("click", () => {

        if (!audioAtual) {
            return;
        }


        if (audioAtual.paused) {

            audioAtual.play();

            playButton.innerHTML = "❚❚";

            if (botaoAtual) {
                botaoAtual.innerHTML = "❚❚ Pausar";
                botaoAtual.classList.add("playing");
            }

            if (card) {
                card.classList.add("is-playing");
            }

        } else {

            audioAtual.pause();

            playButton.innerHTML = "▶";

            if (botaoAtual) {
                botaoAtual.innerHTML = "▶ Continuar";
            }

            if (card) {
                card.classList.remove("is-playing");
            }
        }

    });


    /* =====================================================
       BARRA DE PROGRESSO
    ===================================================== */

    const progressArea =
        player.querySelector(".player-progress");


    progressArea.addEventListener("click", (evento) => {

        if (!audioAtual || !audioAtual.duration) {
            return;
        }

        const rect =
            progressArea.getBoundingClientRect();

        const posicao =
            (evento.clientX - rect.left) / rect.width;

        audioAtual.currentTime =
            posicao * audioAtual.duration;

    });


    /* =====================================================
       VOLUME
    ===================================================== */

    const volume =
        player.querySelector(".player-volume-control");


    volume.addEventListener("input", () => {

        if (audioAtual) {
            audioAtual.volume = volume.value;
        }

    });


    /* =====================================================
       FECHAR
    ===================================================== */

    const closeButton =
        player.querySelector(".player-close");


    closeButton.addEventListener("click", () => {

        fecharPlayer();

    });

}


/* =========================================================
   ATUALIZAR PROGRESSO
========================================================= */

function atualizarProgresso() {

    if (!audioAtual || !playerAtual) {
        return;
    }


    const barra =
        playerAtual.querySelector(".player-progress-bar");

    const atual =
        playerAtual.querySelector(".player-current");


    if (audioAtual.duration) {

        const porcentagem =
            (audioAtual.currentTime /
            audioAtual.duration) * 100;

        barra.style.width =
            `${porcentagem}%`;

    }


    atual.textContent =
        formatarTempo(audioAtual.currentTime);

}


/* =========================================================
   ATUALIZAR DURAÇÃO
========================================================= */

function atualizarDuracao() {

    if (!audioAtual || !playerAtual) {
        return;
    }


    const duracao =
        playerAtual.querySelector(".player-duration");


    duracao.textContent =
        formatarTempo(audioAtual.duration);

}


/* =========================================================
   FORMATAR TEMPO
========================================================= */

function formatarTempo(segundos) {

    if (!Number.isFinite(segundos)) {
        return "0:00";
    }


    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        Math.floor(segundos % 60);


    return `${minutos}:${segundosRestantes
        .toString()
        .padStart(2, "0")}`;

}


/* =========================================================
   FECHAR PLAYER
========================================================= */

function fecharPlayer() {

    if (audioAtual) {

        audioAtual.pause();

        audioAtual.currentTime = 0;

    }


    document
        .querySelectorAll(".project-card")
        .forEach(card => {
            card.classList.remove("is-playing");
        });


    document
        .querySelectorAll(".project-link")
        .forEach(botao => {

            botao.classList.remove("playing");

            botao.innerHTML =
                "▶ Ouvir projeto";

        });


    if (playerAtual) {

        playerAtual.remove();

        playerAtual = null;

    }


    audioAtual = null;

    botaoAtual = null;

}


/* =========================================================
   LIMPAR PLAYER
========================================================= */

function limparPlayer() {

    fecharPlayer();

}


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(texto) {

    const mensagem =
        document.createElement("div");

    mensagem.className =
        "flow-message";

    mensagem.textContent =
        texto;


    document.body.appendChild(mensagem);


    setTimeout(() => {

        mensagem.classList.add("show");

    }, 20);


    setTimeout(() => {

        mensagem.classList.remove("show");

        setTimeout(() => {
            mensagem.remove();
        }, 300);

    }, 3000);

}


/* =========================================================
   ANIMAÇÃO DAS SEÇÕES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const secoes =
        document.querySelectorAll(".section");


    if (!("IntersectionObserver" in window)) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entradas) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "section-visible"
                        );

                        observer.unobserve(
                            entrada.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    secoes.forEach(secao => {
        observer.observe(secao);
    });

});