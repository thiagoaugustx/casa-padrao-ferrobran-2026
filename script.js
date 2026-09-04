function initializeConstructionInteraction() {
  const stage = document.querySelector("#constructionStage");

  const interactiveArea =
    document.querySelector("#interactiveArea") ||
    document.querySelector(".interactive-area");

  const layers = [...document.querySelectorAll(".construction-layer")];
  const cards = [...document.querySelectorAll(".component-card")];

  if (!stage || !interactiveArea || layers.length === 0) {
    console.error(
      "Não foi possível encontrar a estrutura da construção no HTML."
    );

    return;
  }

  const componentOrder = [
    "architecture",
    "deck",
    "beams",
    "columns",
    "foundation",
  ];

  const CLOSE_DELAY = 450;

  let closeTimer = null;
  let animationFrame = null;
  let lastPointerY = 0;
  let lastPointerType = "mouse";

  function clearActive() {
    stage.classList.remove("has-active");

    layers.forEach((layer) => {
      layer.classList.remove("is-active");
    });

    cards.forEach((card) => {
      card.classList.remove("is-active");
      card.setAttribute("aria-pressed", "false");
    });
  }

  function setExpanded(expanded) {
    stage.classList.toggle("is-expanded", expanded);
    stage.setAttribute("aria-expanded", String(expanded));

    if (!expanded) {
      clearActive();
    }
  }

  function setActive(component) {
    if (!componentOrder.includes(component)) return;

    stage.classList.add("has-active");

    layers.forEach((layer) => {
      const isActive = layer.dataset.component === component;

      layer.classList.toggle("is-active", isActive);
    });

    cards.forEach((card) => {
      const isActive = card.dataset.component === component;

      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });
  }

  function getComponentByPointer(clientY) {
    const rect = stage.getBoundingClientRect();
    const pointerPosition = (clientY - rect.top) / rect.height;

    if (pointerPosition < 0.36) {
      return "architecture";
    }

    if (pointerPosition < 0.53) {
      return "deck";
    }

    if (pointerPosition < 0.68) {
      return "beams";
    }

    if (pointerPosition < 0.84) {
      return "columns";
    }

    return "foundation";
  }

  function cancelClose() {
    if (closeTimer === null) return;

    clearTimeout(closeTimer);
    closeTimer = null;
  }

  function scheduleClose() {
    cancelClose();

    closeTimer = setTimeout(() => {
      setExpanded(false);
      closeTimer = null;
    }, CLOSE_DELAY);
  }

  interactiveArea.addEventListener("pointerdown", (event) => {
    lastPointerType = event.pointerType;
  });

  stage.addEventListener("pointerenter", (event) => {
    lastPointerType = event.pointerType;

    if (event.pointerType !== "mouse") return;

    cancelClose();
    setExpanded(true);
  });

  stage.addEventListener("pointermove", (event) => {
    if (
      event.pointerType !== "mouse" ||
      !stage.classList.contains("is-expanded")
    ) {
      return;
    }

    lastPointerY = event.clientY;

    if (animationFrame !== null) return;

    animationFrame = requestAnimationFrame(() => {
      const component = getComponentByPointer(lastPointerY);

      setActive(component);
      animationFrame = null;
    });
  });

  interactiveArea.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      cancelClose();
    }
  });

  interactiveArea.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    scheduleClose();
  });

  stage.addEventListener("click", () => {
    if (lastPointerType === "mouse") return;

    cancelClose();

    const isExpanded =
      stage.classList.contains("is-expanded");

    setExpanded(!isExpanded);
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cancelClose();
      setExpanded(false);
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    cancelClose();

    const isExpanded =
      stage.classList.contains("is-expanded");

    setExpanded(!isExpanded);
  });

  cards.forEach((card) => {
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("pointerenter", (event) => {
      lastPointerType = event.pointerType;

      if (event.pointerType !== "mouse") return;

      cancelClose();
      setExpanded(true);
      setActive(card.dataset.component);
    });

    card.addEventListener("pointerdown", (event) => {
      lastPointerType = event.pointerType;
    });

    card.addEventListener("focus", () => {
      cancelClose();
      setExpanded(true);
      setActive(card.dataset.component);
    });

    card.addEventListener("click", () => {
      const component = card.dataset.component;
      const alreadyActive =
        card.classList.contains("is-active");

      cancelClose();
      setExpanded(true);

      if (
        lastPointerType !== "mouse" &&
        alreadyActive
      ) {
        clearActive();
        return;
      }

      setActive(component);
    });
  });

  stage.setAttribute("aria-expanded", "false");
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeConstructionInteraction,
    { once: true }
  );
} else {
  initializeConstructionInteraction();
}

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const proposalForm =
        document.getElementById("proposalForm");

    const proposalSubmit =
        document.getElementById("proposalSubmit");

    const proposalMessage =
        document.getElementById("proposalMessage");

    const whatsappInput =
        document.getElementById("whatsapp");


    /* =====================================================
       VERIFICA SE O FORMULÁRIO EXISTE
    ===================================================== */

    if (!proposalForm) {

        console.error(
            "ERRO: formulário #proposalForm não encontrado."
        );

        return;

    }


    console.log(
        "Formulário Ferrobran carregado com sucesso."
    );


    /* =====================================================
       URL DO APPS SCRIPT
    ===================================================== */

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwik2rsyHaJxP1eONXrDoVZ_VP7ktPUVRxvSc6aUdUrfjk8_iEGJjuiSt71s0bylXGx/exec";
      
    console.log(
    "APPS SCRIPT UTILIZADO:",
    SCRIPT_URL
    );

    /* =====================================================
       MÁSCARA WHATSAPP
    ===================================================== */

    if (whatsappInput) {

        whatsappInput.addEventListener(
            "input",
            function (event) {

                let value =
                    event.target.value
                        .replace(/\D/g, "")
                        .substring(0, 11);


                if (value.length > 10) {

                    value = value.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

                } else if (value.length > 6) {

                    value = value.replace(
                        /^(\d{2})(\d{4})(\d+)/,
                        "($1) $2-$3"
                    );

                } else if (value.length > 2) {

                    value = value.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

                } else if (value.length > 0) {

                    value = value.replace(
                        /^(\d*)/,
                        "($1"
                    );

                }


                event.target.value = value;

            }
        );

    }


    /* =====================================================
       ENVIO DO FORMULÁRIO
    ===================================================== */

    proposalForm.addEventListener(
        "submit",
        async function (event) {

            /*
             * Impede a página de atualizar
             */
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "Botão enviar acionado."
            );


            /* =================================================
               LIMPA MENSAGEM ANTERIOR
            ================================================= */

            if (proposalMessage) {

                proposalMessage.className =
                    "proposal-message";

                proposalMessage.textContent =
                    "";

            }


            /* =================================================
               BOTÃO CARREGANDO
            ================================================= */

            if (proposalSubmit) {

                proposalSubmit.classList.add(
                    "loading"
                );

                proposalSubmit.disabled =
                    true;

            }


            try {

                /* =============================================
                   CAPTURA OS DADOS
                ============================================= */

                const formData =
                    new FormData(proposalForm);


                console.log(
                    "Dados que serão enviados:"
                );


                for (
                    const [campo, valor]
                    of formData.entries()
                ) {

                    console.log(
                        campo,
                        ":",
                        valor
                    );

                }


                /* =============================================
                   ENVIA PARA O GOOGLE APPS SCRIPT
                ============================================= */

                console.log(
                    "Enviando para Apps Script..."
                );


                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",

                        body: formData,

                        mode: "no-cors"
                    }
                );


                console.log(
                    "Requisição enviada."
                );


                /* =============================================
                   MENSAGEM DE SUCESSO
                ============================================= */

                if (proposalMessage) {

                    proposalMessage.className =
                        "proposal-message success";


                    proposalMessage.innerHTML = `
                        <strong>Solicitação enviada!</strong><br>
                        Recebemos suas informações.
                        Nossa equipe entrará em contato em breve.
                    `;

                }


                /* =============================================
                   LIMPA FORMULÁRIO
                ============================================= */

                proposalForm.reset();


            } catch (error) {

                console.error(
                    "Erro ao enviar:",
                    error
                );


                if (proposalMessage) {

                    proposalMessage.className =
                        "proposal-message error";


                    proposalMessage.innerHTML = `
                        <strong>Não foi possível enviar.</strong><br>
                        Tente novamente em alguns instantes.
                    `;

                }

            } finally {

                /* =============================================
                   RESTAURA BOTÃO
                ============================================= */

                if (proposalSubmit) {

                    proposalSubmit.classList.remove(
                        "loading"
                    );


                    proposalSubmit.disabled =
                        false;

                }

            }

        }
    );

});