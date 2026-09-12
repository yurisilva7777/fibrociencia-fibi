const FIBI_LANGUAGE =
  document.documentElement.lang
    .toLowerCase()
    .startsWith("en")
      ? "en-US"
      : "pt-BR";

const FIBI_STORAGE_KEY =
  FIBI_LANGUAGE === "en-US"
    ? "fibi_conversation_id_en"
    : "fibi_conversation_id_pt";

let conversationId =
  localStorage.getItem(FIBI_STORAGE_KEY) || null;

const FIBI_HISTORY_KEY =
  FIBI_LANGUAGE === "en-US"
    ? "fibi_history_en"
    : "fibi_history_pt";

let fibiHistory = [];

try {
  const savedHistory =
    JSON.parse(
      localStorage.getItem(FIBI_HISTORY_KEY) || "[]"
    );

  if (Array.isArray(savedHistory)) {
    fibiHistory =
      savedHistory
        .filter((item) => {
          return (
            item &&
            (item.role === "user" ||
              item.role === "assistant") &&
            typeof item.content === "string"
          );
        })
        .slice(-10);
  }
} catch (error) {
  console.warn(
    "Nao foi possivel carregar o historico da Fibi.",
    error
  );

  fibiHistory = [];
}

function saveFibiHistory() {
  try {
    localStorage.setItem(
      FIBI_HISTORY_KEY,
      JSON.stringify(fibiHistory.slice(-10))
    );
  } catch (error) {
    console.warn(
      "Nao foi possivel salvar o historico da Fibi.",
      error
    );
  }
}

function addFibiHistory(userMessage, assistantMessage) {
  fibiHistory.push(
    {
      role: "user",
      content: String(userMessage || "")
    },
    {
      role: "assistant",
      content: String(assistantMessage || "")
    }
  );

  fibiHistory = fibiHistory.slice(-10);

  saveFibiHistory();
}

let busy = false;

// ========================================
// ENDEREÇO DO BACKEND DA FIBI
// Em desenvolvimento/local, deixe o meta fibi-api-base vazio.
// Quando o frontend estiver no GitHub Pages, informe no HTML
// a URL HTTPS do backend público.
// ========================================
const FIBI_API_BASE =
  (document
    .querySelector('meta[name="fibi-api-base"]')
    ?.getAttribute("content") || "")
    .trim()
    .replace(/\/+$/, "");

function fibiApiUrl(path) {
  const normalizedPath =
    String(path || "").startsWith("/")
      ? String(path || "")
      : `/${String(path || "")}`;

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return normalizedPath;
  }

  return FIBI_API_BASE
    ? `${FIBI_API_BASE}${normalizedPath}`
    : normalizedPath;
}


function getFibiLanguage() {
  return FIBI_LANGUAGE;
}

function fibiIsEnglish() {
  return FIBI_LANGUAGE === "en-US";
}


const FIBI_TEXT = {

  "pt-BR": {
    launcherTitle: "Conversar com a Fibi",
    launcherAria: "Abrir Fibi",
    panelAria: "Chat da Fibi",
    badge: "IA + RAG",
    subtitle: "Assistente do FibroCiência",
    clearTitle: "Limpar conversa",
    expandTitle: "Expandir conversa",
    reduceTitle: "Reduzir conversa",
    closeTitle: "Fechar",
    greeting: "Oi! Eu sou a Fibi 💜 Como posso te ajudar hoje?",
    suggestions: [
      "O que é fibromialgia?",
      "Quais são os sintomas?",
      "Como é feito o diagnóstico?",
      "Exercício ajuda?"
    ],
    status: "Consultando a base científica...",
    placeholder: "Pergunte para a Fibi...",
    send: "Enviar",
    footer: "Conteúdo educativo. Não substitui avaliação médica.",
    sources: "Fontes consultadas",
    scientificSource: "Fonte científica",
    copy: "Copiar",
    copied: "Copiado",
    copyTitle: "Copiar resposta",
    copyAria: "Copiar resposta da Fibi",
    typing: "Fibi está digitando",
    followups: "Você também pode perguntar:",
    cleared: "Conversa limpa 💜 Pode começar de novo.",
    error: "A Fibi está temporariamente indisponível. Tente novamente em instantes."
  },

  "en-US": {
    launcherTitle: "Chat with Fibi",
    launcherAria: "Open Fibi",
    panelAria: "Fibi chat",
    badge: "AI + RAG",
    subtitle: "FibroCiência Assistant",
    clearTitle: "Clear conversation",
    expandTitle: "Expand conversation",
    reduceTitle: "Collapse conversation",
    closeTitle: "Close",
    greeting: "Hi! I'm Fibi 💜 How can I help you today?",
    suggestions: [
      "What is fibromyalgia?",
      "What are the symptoms?",
      "How is fibromyalgia diagnosed?",
      "Does exercise help?"
    ],
    status: "Searching the scientific knowledge base...",
    placeholder: "Ask Fibi a question...",
    send: "Send",
    footer: "Educational content. This does not replace professional medical evaluation.",
    sources: "Sources consulted",
    scientificSource: "Scientific source",
    copy: "Copy",
    copied: "Copied",
    copyTitle: "Copy answer",
    copyAria: "Copy Fibi's answer",
    typing: "Fibi is typing",
    followups: "You can also ask:",
    cleared: "Conversation cleared 💜 You can start again.",
    error: "Fibi is temporarily unavailable. Please try again in a moment."
  }

};


function fibiText(key) {

  const language =
    getFibiLanguage();


  return FIBI_TEXT[language]?.[key] ??
    FIBI_TEXT["pt-BR"]?.[key] ??
    key;

}


function applyFibiLanguage() {

  const panel =
    document.querySelector(
      "#fibi-panel"
    );


  const launcher =
    document.querySelector(
      "#fibi-launcher"
    );


  if (!panel || !launcher) {
    return;
  }


  launcher.title =
    fibiText("launcherTitle");

  launcher.setAttribute(
    "aria-label",
    fibiText("launcherAria")
  );


  panel.setAttribute(
    "aria-label",
    fibiText("panelAria")
  );


  const badge =
    panel.querySelector(
      ".fibi-ai-badge"
    );

  if (badge) {
    badge.textContent =
      fibiText("badge");
  }


  const subtitle =
    panel.querySelector(
      ".fibi-head-copy > small"
    );

  if (subtitle) {
    subtitle.textContent =
      fibiText("subtitle");
  }


  const clear =
    panel.querySelector(
      "#fibi-clear"
    );

  if (clear) {
    clear.title =
      fibiText("clearTitle");

    clear.setAttribute(
      "aria-label",
      fibiText("clearTitle")
    );
  }


  const expand =
    panel.querySelector(
      "#fibi-expand"
    );

  if (expand) {

    const expanded =
      panel.classList.contains(
        "fibi-expanded"
      );

    const key =
      expanded
        ? "reduceTitle"
        : "expandTitle";

    expand.title =
      fibiText(key);

    expand.setAttribute(
      "aria-label",
      fibiText(key)
    );

  }


  const close =
    panel.querySelector(
      "#fibi-close"
    );

  if (close) {
    close.title =
      fibiText("closeTitle");

    close.setAttribute(
      "aria-label",
      fibiText("closeTitle")
    );
  }


  const greeting =
    panel.querySelector(
      "[data-fibi-static='greeting']"
    );

  if (greeting) {
    greeting.textContent =
      fibiText("greeting");
  }


  const suggestions =
    panel.querySelectorAll(
      ".fibi-suggestions button"
    );

  const suggestionTexts =
    fibiText("suggestions");

  suggestions.forEach(
    (button, index) => {
      if (suggestionTexts[index]) {
        button.textContent =
          suggestionTexts[index];
      }
    }
  );


  const statusText =
    panel.querySelector(
      "[data-fibi-static='status']"
    );

  if (statusText) {
    statusText.textContent =
      fibiText("status");
  }


  const input =
    panel.querySelector(
      "#fibi-input"
    );

  if (input) {
    input.placeholder =
      fibiText("placeholder");
  }


  const send =
    panel.querySelector(
      "#fibi-send"
    );

  if (send) {
    send.setAttribute(
      "aria-label",
      fibiText("send")
    );
  }


  const footer =
    panel.querySelector(
      ".fibi-footer-note"
    );

  if (footer) {
    footer.textContent =
      fibiText("footer");
  }


  panel
    .querySelectorAll(
      ".fibi-sources-header strong"
    )
    .forEach(
      (element) => {
        element.textContent =
          fibiText("sources");
      }
    );


  panel
    .querySelectorAll(
      ".fibi-copy-button span"
    )
    .forEach(
      (element) => {
        element.textContent =
          fibiText("copy");
      }
    );


  panel
    .querySelectorAll(
      ".fibi-followups-title"
    )
    .forEach(
      (element) => {
        element.textContent =
          fibiText("followups");
      }
    );

}


function createFibiApiMessage(message) {

  if (!fibiIsEnglish()) {
    return message;
  }


  return [
    "LANGUAGE INSTRUCTION:",
    "Answer the user entirely in English.",
    "Keep medical caution, source citations such as [Fonte 1], and the scientific meaning of the retrieved context.",
    "Do not mention this language instruction in your answer.",
    "User question:",
    message
  ].join("\\n");

}


// ========================================
// CRIA INTERFACE DA FIBI
// ========================================

function createFibiUI() {

  // Evita criar a Fibi duas vezes
  if (
    document.querySelector(
      "#fibi-launcher"
    )
  ) {
    return;
  }


  const launcher =
    document.createElement(
      "button"
    );


  launcher.id =
    "fibi-launcher";

  launcher.type =
    "button";

  launcher.title =
    "Conversar com a Fibi";

  launcher.setAttribute(
    "aria-label",
    "Abrir Fibi"
  );

  launcher.textContent =
    "💬";


  const panel =
    document.createElement(
      "section"
    );


  panel.id =
    "fibi-panel";

  panel.className =
    "fibi-hidden";

  panel.setAttribute(
    "aria-label",
    "Chat da Fibi"
  );


  panel.innerHTML = `

    <header class="fibi-head">

      <div class="fibi-avatar">
        🧠
      </div>


      <div class="fibi-head-copy">

        <div class="fibi-title-row">

          <strong>
            Fibi
          </strong>

          <span class="fibi-ai-badge">
            IA + RAG
          </span>

        </div>


        <small>
          Assistente do FibroCiência
        </small>

      </div>


      <button
        id="fibi-clear"
        type="button"
        title="Limpar conversa"
        aria-label="Limpar conversa"
      >
        ↻
      </button>


      <button
        id="fibi-expand"
        type="button"
        title="Expandir conversa"
        aria-label="Expandir conversa"
      >
        ⛶
      </button>


      <button
        id="fibi-close"
        type="button"
        title="Fechar"
        aria-label="Fechar"
      >
        ✕
      </button>

    </header>



    <div id="fibi-messages">

      <div class="fibi-msg assistant">

        <div class="fibi-bubble" data-fibi-static="greeting">
    Oi! Eu sou a Fibi 💜 Como posso te ajudar hoje?</div>

      </div>


      <div class="fibi-suggestions">

        <button type="button">
          O que é fibromialgia?
        </button>

        <button type="button">
          Quais são os sintomas?
        </button>

        <button type="button">
          Como é feito o diagnóstico?
        </button>

        <button type="button">
          Exercício ajuda?
        </button>

      </div>

    </div>



    <div
      id="fibi-status"
      hidden
    >

      <span class="fibi-dot"></span>

      <span data-fibi-static="status">
        Consultando a base científica...
      </span>

    </div>



    <form
      class="fibi-composer"
      id="fibi-form"
    >

      <textarea
        id="fibi-input"
        rows="1"
        maxlength="5000"
        placeholder="Pergunte para a Fibi..."
      ></textarea>


      <button
        id="fibi-send"
        type="submit"
        aria-label="Enviar"
      >
        ➜
      </button>

    </form>



    <div class="fibi-footer-note">
      Conteúdo educativo. Não substitui avaliação médica.
    </div>

  `;


  document.body.append(
    launcher,
    panel
  );


  applyFibiLanguage();


  const input =
    panel.querySelector(
      "#fibi-input"
    );


  const expandButton =
    panel.querySelector(
      "#fibi-expand"
    );


  const messages =
    panel.querySelector(
      "#fibi-messages"
    );



  // ========================================
  // ABRIR CHAT
  // ========================================

  launcher.addEventListener(
    "click",
    () => {

      panel.classList.toggle(
        "fibi-hidden"
      );


      if (
        !panel.classList.contains(
          "fibi-hidden"
        )
      ) {

        input?.focus();

      }

    }
  );



  // ========================================
  // FECHAR CHAT
  // ========================================

  panel
    .querySelector(
      "#fibi-close"
    )
    ?.addEventListener(
      "click",
      () => {

        panel.classList.add(
          "fibi-hidden"
        );

      }
    );



  // ========================================
  // LIMPAR CONVERSA
  // ========================================

  panel
    .querySelector(
      "#fibi-clear"
    )
    ?.addEventListener(
      "click",
      clearFibiConversation
    );



  // ========================================
  // EXPANDIR / REDUZIR
  // ========================================

  expandButton
    ?.addEventListener(
      "click",
      () => {

        panel.classList.toggle(
          "fibi-expanded"
        );


        const expanded =
          panel.classList.contains(
            "fibi-expanded"
          );


        expandButton.textContent =
          expanded
            ? "↙"
            : "⛶";


        const expandLanguageKey =
          expanded
            ? "reduceTitle"
            : "expandTitle";


        expandButton.title =
          fibiText(
            expandLanguageKey
          );


        expandButton.setAttribute(
          "aria-label",
          fibiText(
            expandLanguageKey
          )
        );

// ========================================
// NOVAS SUGESTÕES INTELIGENTES
// ========================================

const followups =
  criarSugestoesInteligentesFibi(
    conteudo
  );

messages.appendChild(
  followups
);
        if (messages) {

          messages.scrollTop =
            messages.scrollHeight;

        }

      }
    );



  // ========================================
  // ENVIAR FORMULÁRIO
  // ========================================

  panel
    .querySelector(
      "#fibi-form"
    )
    ?.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        sendFibiMessage(
          input?.value || ""
        );

      }
    );



  // ========================================
  // ENTER ENVIA
  // SHIFT + ENTER QUEBRA LINHA
  // ========================================

  input
    ?.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {

          event.preventDefault();


          panel
            .querySelector(
              "#fibi-form"
            )
            ?.requestSubmit();

        }

      }
    );



  // ========================================
  // TEXTAREA AUTOMÁTICA
  // ========================================

  input
    ?.addEventListener(
      "input",
      () => {

        input.style.height =
          "auto";


        input.style.height =
          `${Math.min(
            input.scrollHeight,
            110
          )}px`;

      }
    );



  // ========================================
  // SUGESTÕES
  // ========================================

  panel
    .querySelectorAll(
      ".fibi-suggestions button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            sendFibiMessage(
              button.textContent.trim()
            );

          }
        );

      }
    );

}



// ========================================
// NORMALIZA FONTES
// ========================================

function normalizeFibiSources(
  sources
) {

  if (
    !Array.isArray(
      sources
    )
  ) {

    return [];

  }


  const unique = [];
  const seen = new Set();


  for (
    const source
    of sources
  ) {

    if (!source) {
      continue;
    }


    const name =
      source.source ||
      source.title ||
      fibiText("scientificSource");


    const key =
      `${name}|${source.url || ""}`
        .toLowerCase()
        .trim();


    if (
      seen.has(
        key
      )
    ) {

      continue;

    }


    seen.add(
      key
    );


    unique.push(
      source
    );

  }


  return unique.slice(
    0,
    4
  );

}



// ========================================
// CRIA FONTES
// ========================================

function createFibiSources(
  sourcesList
) {

  const normalized =
    normalizeFibiSources(
      sourcesList
    );


  if (
    !normalized.length
  ) {

    return null;

  }


  const container =
    document.createElement(
      "div"
    );


  container.className =
    "fibi-sources";


  const header =
    document.createElement(
      "div"
    );


  header.className =
    "fibi-sources-header";


  const icon =
    document.createElement(
      "span"
    );


  icon.className =
    "fibi-sources-icon";


  icon.textContent =
    "📚";


  const title =
    document.createElement(
      "strong"
    );


  title.textContent =
    fibiText("sources");


  header.append(
    icon,
    title
  );


  container.appendChild(
    header
  );


  const list =
    document.createElement(
      "div"
    );


  list.className =
    "fibi-sources-list";


  normalized.forEach(
    (source, index) => {

      const element =
        document.createElement(
          source.url
            ? "a"
            : "div"
        );


      element.className =
        "fibi-source-card";


      const number =
        document.createElement(
          "span"
        );


      number.className =
        "fibi-source-number";


      number.textContent =
        String(
          index + 1
        );


      const content =
        document.createElement(
          "div"
        );


      content.className =
        "fibi-source-content";


      const sourceName =
        document.createElement(
          "strong"
        );


      sourceName.textContent =
        source.source ||
        source.title ||
        fibiText("scientificSource");


      content.appendChild(
        sourceName
      );


      if (
        source.title &&
        source.title !==
        source.source
      ) {

        const sourceTitle =
          document.createElement(
            "small"
          );


        sourceTitle.textContent =
          source.title;


        content.appendChild(
          sourceTitle
        );

      }


      if (
        source.url
      ) {

        element.href =
          source.url;


        element.target =
          "_blank";


        element.rel =
          "noopener noreferrer";


        const arrow =
          document.createElement(
            "span"
          );


        arrow.className =
          "fibi-source-arrow";


        arrow.textContent =
          "↗";


        element.append(
          number,
          content,
          arrow
        );

      }

      else {

        element.append(
          number,
          content
        );

      }


      list.appendChild(
        element
      );

    }
  );


  container.appendChild(
    list
  );


  return container;

}



// ========================================
// FORMATAÇÃO INLINE
// ========================================

function adicionarFormatacaoInline(
  elemento,
  texto
) {

  const regex =
    /(\*\*[^*]+\*\*|`[^`]+`)/g;


  let ultimoIndice =
    0;


  let resultado;


  while (
    (
      resultado =
        regex.exec(
          texto
        )
    ) !== null
  ) {

    if (
      resultado.index >
      ultimoIndice
    ) {

      elemento.appendChild(
        document.createTextNode(
          texto.slice(
            ultimoIndice,
            resultado.index
          )
        )
      );

    }


    const trecho =
      resultado[0];


    if (
      trecho.startsWith(
        "**"
      )
    ) {

      const strong =
        document.createElement(
          "strong"
        );


      strong.textContent =
        trecho.slice(
          2,
          -2
        );


      elemento.appendChild(
        strong
      );

    }

    else if (
      trecho.startsWith(
        "`"
      )
    ) {

      const code =
        document.createElement(
          "code"
        );


      code.className =
        "fibi-inline-code";


      code.textContent =
        trecho.slice(
          1,
          -1
        );


      elemento.appendChild(
        code
      );

    }


    ultimoIndice =
      regex.lastIndex;

  }


  if (
    ultimoIndice <
    texto.length
  ) {

    elemento.appendChild(
      document.createTextNode(
        texto.slice(
          ultimoIndice
        )
      )
    );

  }

}



// ========================================
// FORMATA RESPOSTA DA FIBI
// ========================================

function renderizarRespostaFibi(
  container,
  texto
) {

  container.innerHTML =
    "";


  const linhas =
    String(
      texto || ""
    )
      .replace(
        /\r/g,
        ""
      )
      .split(
        "\n"
      );


  let listaAtual =
    null;


  let tipoLista =
    null;



  function fecharLista() {

    listaAtual =
      null;


    tipoLista =
      null;

  }



  linhas.forEach(
    (linhaOriginal) => {

      const linha =
        linhaOriginal.trim();



      // LINHA VAZIA

      if (
        !linha
      ) {

        fecharLista();


        const espaco =
          document.createElement(
            "div"
          );


        espaco.className =
          "fibi-answer-space";


        container.appendChild(
          espaco
        );


        return;

      }



      // ========================================
      // TÍTULOS
      // ========================================

      const titulo =
        linha.match(
          /^(#{1,3})\s+(.+)$/
        );


      if (
        titulo
      ) {

        fecharLista();


        const heading =
          document.createElement(
            titulo[1].length === 1
              ? "h3"
              : "h4"
          );


        heading.className =
          "fibi-answer-heading";


        adicionarFormatacaoInline(
          heading,
          titulo[2]
        );


        container.appendChild(
          heading
        );


        return;

      }



      // ========================================
      // LISTA COM BOLINHAS
      // ========================================

      const itemLista =
        linha.match(
          /^[-*•]\s+(.+)$/
        );


      if (
        itemLista
      ) {

        if (
          tipoLista !==
          "ul"
        ) {

          fecharLista();


          listaAtual =
            document.createElement(
              "ul"
            );


          listaAtual.className =
            "fibi-answer-list";


          container.appendChild(
            listaAtual
          );


          tipoLista =
            "ul";

        }


        const item =
          document.createElement(
            "li"
          );


        adicionarFormatacaoInline(
          item,
          itemLista[1]
        );


        listaAtual.appendChild(
          item
        );


        return;

      }



      // ========================================
      // LISTA NUMERADA
      // ========================================

      const itemNumerado =
        linha.match(
          /^\d+[.)]\s+(.+)$/
        );


      if (
        itemNumerado
      ) {

        if (
          tipoLista !==
          "ol"
        ) {

          fecharLista();


          listaAtual =
            document.createElement(
              "ol"
            );


          listaAtual.className =
            "fibi-answer-list";


          container.appendChild(
            listaAtual
          );


          tipoLista =
            "ol";

        }


        const item =
          document.createElement(
            "li"
          );


        adicionarFormatacaoInline(
          item,
          itemNumerado[1]
        );


        listaAtual.appendChild(
          item
        );


        return;

      }



      fecharLista();



      // ========================================
      // AVISOS
      // ========================================

      const aviso =
        linha.match(
          /^(⚠️\s*)?(Atenção|Importante|Observação|Attention|Important|Warning|Note)\s*:\s*(.*)$/i
        );


      if (
        aviso
      ) {

        const caixa =
          document.createElement(
            "div"
          );


        caixa.className =
          "fibi-answer-alert";


        const tituloAviso =
          document.createElement(
            "strong"
          );


        tituloAviso.textContent =
          `${aviso[2]}: `;


        caixa.appendChild(
          tituloAviso
        );


        adicionarFormatacaoInline(
          caixa,
          aviso[3]
        );


        container.appendChild(
          caixa
        );


        return;

      }



      // ========================================
      // PARÁGRAFO NORMAL
      // ========================================

      const paragrafo =
        document.createElement(
          "p"
        );


      paragrafo.className =
        "fibi-answer-paragraph";


      adicionarFormatacaoInline(
        paragrafo,
        linha
      );


      container.appendChild(
        paragrafo
      );

    }
  );

}


// ========================================
// HORÁRIO + AÇÕES DAS MENSAGENS
// ========================================

function criarAcoesMensagemFibi(
  texto,
  role
) {

  const area =
    document.createElement(
      "div"
    );

  area.className =
    "fibi-message-actions";


  // ========================================
  // BOTÃO COPIAR
  // ========================================

  if (
    role === "assistant" &&
    String(texto || "").trim()
  ) {

    const copiar =
      document.createElement(
        "button"
      );


    copiar.type =
      "button";


    copiar.className =
      "fibi-copy-button";


    copiar.title =
      fibiText("copyTitle");


    copiar.setAttribute(
      "aria-label",
      fibiText("copyAria")
    );


    copiar.innerHTML =
      `⧉ <span>${fibiText("copy")}</span>`;


    copiar.addEventListener(
      "click",
      async () => {

        const conteudo =
          String(texto || "")
            .trim();


        try {

          await navigator.clipboard
            .writeText(
              conteudo
            );


          copiar.innerHTML =
            `✓ <span>${fibiText("copied")}</span>`;


          copiar.classList.add(
            "copiado"
          );


          setTimeout(
            () => {

              copiar.innerHTML =
                `⧉ <span>${fibiText("copy")}</span>`;


              copiar.classList.remove(
                "copiado"
              );

            },
            1800
          );


        } catch (error) {

          // Plano B caso o navegador
          // bloqueie navigator.clipboard

          const textarea =
            document.createElement(
              "textarea"
            );


          textarea.value =
            conteudo;


          textarea.style.position =
            "fixed";


          textarea.style.opacity =
            "0";


          document.body.appendChild(
            textarea
          );


          textarea.select();


          document.execCommand(
            "copy"
          );


          textarea.remove();


          copiar.innerHTML =
            `✓ <span>${fibiText("copied")}</span>`;


          setTimeout(
            () => {

              copiar.innerHTML =
                `⧉ <span>${fibiText("copy")}</span>`;

            },
            1800
          );

        }

      }
    );


    area.appendChild(
      copiar
    );

  }


  // ========================================
  // HORÁRIO
  // ========================================

  const horario =
    document.createElement(
      "span"
    );


  horario.className =
    "fibi-message-time";


  horario.textContent =
    new Date()
      .toLocaleTimeString(
        getFibiLanguage(),
        {
          hour:
            "2-digit",

          minute:
            "2-digit"
        }
      );


  area.appendChild(
    horario
  );


  return area;

}
// ========================================
// SUGESTÕES INTELIGENTES DA FIBI
// ========================================

function obterSugestoesFibi(texto) {

  const conteudo =
    String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  if (fibiIsEnglish()) {

    if (
      conteudo.includes("symptom") ||
      conteudo.includes("widespread pain") ||
      conteudo.includes("fatigue")
    ) {
      return [
        "How is fibromyalgia diagnosed?",
        "Which treatments can help with symptoms?",
        "How can fibromyalgia be distinguished from other conditions?"
      ];
    }


    if (
      conteudo.includes("diagnos") ||
      conteudo.includes("rheumatologist")
    ) {
      return [
        "Which tests may be requested?",
        "Which conditions can resemble fibromyalgia?",
        "When should I see a rheumatologist?"
      ];
    }


    if (
      conteudo.includes("treatment") ||
      conteudo.includes("medication") ||
      conteudo.includes("therapy")
    ) {
      return [
        "Does physical exercise help with fibromyalgia?",
        "How can sleep be improved in people with fibromyalgia?",
        "Is there a cure for fibromyalgia?"
      ];
    }


    if (
      conteudo.includes("exercise") ||
      conteudo.includes("physical activity") ||
      conteudo.includes("stretch")
    ) {
      return [
        "Which exercises are most recommended?",
        "How can I start exercising when I am in pain?",
        "Can exercise temporarily worsen symptoms?"
      ];
    }


    if (
      conteudo.includes("sleep") ||
      conteudo.includes("insomnia")
    ) {
      return [
        "Why can fibromyalgia cause fatigue?",
        "How does sleep affect pain?",
        "What can help improve sleep quality?"
      ];
    }


    if (
      conteudo.includes("pain")
    ) {
      return [
        "Why does fibromyalgia cause widespread pain?",
        "What can help manage fibromyalgia pain?",
        "Can headaches occur with fibromyalgia?"
      ];
    }


    if (
      conteudo.includes("anabolic") ||
      conteudo.includes("steroid")
    ) {
      return [
        "Is there a relationship between anabolic steroids and fibromyalgia?",
        "What effects can anabolic steroids cause?",
        "How can hormones influence pain perception?"
      ];
    }


    return [
      "What are the main symptoms of fibromyalgia?",
      "How is fibromyalgia diagnosed?",
      "Which treatments can help?"
    ];

  }


  if (
    conteudo.includes("sintoma") ||
    conteudo.includes("dor generalizada") ||
    conteudo.includes("fadiga")
  ) {
    return [
      "Como é feito o diagnóstico da fibromialgia?",
      "Quais tratamentos podem ajudar nos sintomas?",
      "Como diferenciar fibromialgia de outras doenças?"
    ];
  }


  if (
    conteudo.includes("diagnostico") ||
    conteudo.includes("reumatologista")
  ) {
    return [
      "Quais exames podem ser solicitados?",
      "Quais doenças podem parecer fibromialgia?",
      "Quando devo procurar um reumatologista?"
    ];
  }


  if (
    conteudo.includes("tratamento") ||
    conteudo.includes("medicamento") ||
    conteudo.includes("terapia")
  ) {
    return [
      "Exercício físico ajuda na fibromialgia?",
      "Como melhorar o sono em pessoas com fibromialgia?",
      "Existe cura para fibromialgia?"
    ];
  }


  if (
    conteudo.includes("exercicio") ||
    conteudo.includes("atividade fisica") ||
    conteudo.includes("alongamento")
  ) {
    return [
      "Quais exercícios são mais recomendados?",
      "Como começar a fazer exercícios com dor?",
      "Exercício pode piorar os sintomas?"
    ];
  }


  if (
    conteudo.includes("sono") ||
    conteudo.includes("dormir") ||
    conteudo.includes("insonia")
  ) {
    return [
      "Por que a fibromialgia causa fadiga?",
      "Como o sono interfere na dor?",
      "O que pode ajudar a melhorar a qualidade do sono?"
    ];
  }


  if (
    conteudo.includes("dor")
  ) {
    return [
      "Por que a fibromialgia causa dor generalizada?",
      "Como aliviar a dor da fibromialgia?",
      "Dor de cabeça pode ocorrer na fibromialgia?"
    ];
  }


  if (
    conteudo.includes("anabolizante") ||
    conteudo.includes("esteroide")
  ) {
    return [
      "Existe relação entre anabolizantes e fibromialgia?",
      "Quais efeitos os esteroides anabolizantes podem causar?",
      "Como os hormônios podem influenciar a percepção da dor?"
    ];
  }


  return [
    "Quais são os principais sintomas da fibromialgia?",
    "Como é feito o diagnóstico?",
    "Quais tratamentos podem ajudar?"
  ];

}



// ========================================
// CRIA BOTÕES DE SUGESTÃO
// ========================================

function criarSugestoesInteligentesFibi(
  texto
) {

  const sugestoes =
    obterSugestoesFibi(
      texto
    );


  const area =
    document.createElement(
      "div"
    );


  area.className =
    "fibi-followups";


  const titulo =
    document.createElement(
      "span"
    );


  titulo.className =
    "fibi-followups-title";


  titulo.textContent =
    fibiText("followups");


  area.appendChild(
    titulo
  );


  sugestoes.forEach(
    (sugestao) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "fibi-followup-button";


      button.textContent =
        sugestao;


      button.addEventListener(
        "click",
        () => {

          sendFibiMessage(
            sugestao
          );

        }
      );


      area.appendChild(
        button
      );

    }
  );


  return area;

}
// ========================================
// ADICIONA MENSAGEM
// ========================================

function addFibiMessage(
  role,
  text,
  options = {}
) {

  const messages =
    document.querySelector(
      "#fibi-messages"
    );


  if (
    !messages
  ) {

    return;

  }


  const row =
    document.createElement(
      "div"
    );


  row.className =
    `fibi-msg ${role}${
      options.emergency
        ? " emergency"
        : ""
    }`;


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    "fibi-bubble";


  const conteudo =
    String(
      text || ""
    ).trim();


  if (
    role ===
    "assistant"
  ) {

    renderizarRespostaFibi(
      bubble,
      conteudo
    );
    row.appendChild(
  criarAcoesMensagemFibi(
    conteudo,
    "assistant"
  )
);
row.appendChild(
  criarAcoesMensagemFibi(
    conteudo,
    "assistant"
  )
);

  }

  else {

    bubble.textContent =
      conteudo;

  }


  row.appendChild(
    bubble
  );
  row.appendChild(
  criarAcoesMensagemFibi(
    conteudo,
    role
  )
);


  if (
    role === "assistant" &&
    Array.isArray(
      options.sources
    ) &&
    options.sources.length
  ) {

    const sources =
      createFibiSources(
        options.sources
      );


    if (
      sources
    ) {

      row.appendChild(
        sources
      );

    }

  }


  messages.appendChild(
    row
  );


  messages.scrollTop =
    messages.scrollHeight;

}



// ========================================
// RESPOSTA COM EFEITO DE DIGITAÇÃO
// ========================================

async function addFibiTypingMessage(
  text,
  options = {}
) {

  const messages =
    document.querySelector(
      "#fibi-messages"
    );


  if (
    !messages
  ) {

    return;

  }


  const row =
    document.createElement(
      "div"
    );


  row.className =
    `fibi-msg assistant${
      options.emergency
        ? " emergency"
        : ""
    }`;


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    "fibi-bubble fibi-escrevendo-texto";


  row.appendChild(
    bubble
  );


  messages.appendChild(
    row
  );


  const conteudo =
    String(
      text || ""
    ).trim();



  // ========================================
  // VELOCIDADE AUTOMÁTICA
  // ========================================

  let caracteresPorVez =
    2;


  let velocidade =
    10;


  if (
    conteudo.length >
    500
  ) {

    caracteresPorVez =
      4;


    velocidade =
      7;

  }


  if (
    conteudo.length >
    1000
  ) {

    caracteresPorVez =
      7;


    velocidade =
      5;

  }


  if (
    conteudo.length >
    2000
  ) {

    caracteresPorVez =
      12;


    velocidade =
      3;

  }



  // ========================================
  // EFEITO DE DIGITAÇÃO
  // ========================================

  for (
    let i = 0;
    i < conteudo.length;
    i += caracteresPorVez
  ) {

    bubble.textContent =
      conteudo.slice(
        0,
        i + caracteresPorVez
      );


    const distanciaDoFim =
      messages.scrollHeight -
      messages.scrollTop -
      messages.clientHeight;


    if (
      distanciaDoFim <
      250
    ) {

      messages.scrollTop =
        messages.scrollHeight;

    }


    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          velocidade
        )
    );

  }



  // ========================================
  // FORMATA DEPOIS DE DIGITAR
  // ========================================

  bubble.classList.remove(
    "fibi-escrevendo-texto"
  );


  renderizarRespostaFibi(
    bubble,
    conteudo
  );



  // ========================================
  // FONTES
  // ========================================

  if (
    Array.isArray(
      options.sources
    ) &&
    options.sources.length
  ) {

    const sources =
      createFibiSources(
        options.sources
      );


    if (
      sources
    ) {

      row.appendChild(
        sources
      );

    }

  }


  messages.scrollTop =
    messages.scrollHeight;

}



// ========================================
// ESTADO CARREGANDO
// ========================================

function setFibiBusy(
  value
) {

  busy =
    value;


  const input =
    document.querySelector(
      "#fibi-input"
    );


  const send =
    document.querySelector(
      "#fibi-send"
    );


  const status =
    document.querySelector(
      "#fibi-status"
    );


  if (
    input
  ) {

    input.disabled =
      value;

  }


  if (
    send
  ) {

    send.disabled =
      value;

  }


  if (
    status
  ) {

    status.hidden =
      !value;

  }


  if (
    !value &&
    input
  ) {

    input.focus();

  }

}



// ========================================
// ENVIA MENSAGEM
// ========================================

async function sendFibiMessage(
  raw
) {

  const message =
    String(
      raw || ""
    ).trim();


  if (
    !message ||
    busy
  ) {

    return;

  }



  // Remove sugestões

  document
    .querySelector(
      ".fibi-suggestions"
    )
    ?.remove();



  // Mostra mensagem do usuário

  addFibiMessage(
    "user",
    message
  );



  const input =
    document.querySelector(
      "#fibi-input"
    );


  if (
    input
  ) {

    input.value =
      "";


    input.style.height =
      "auto";

  }



  setFibiBusy(
    true
  );


  let indicadorDigitando =
    null;


  try {

    const messages =
      document.querySelector(
        "#fibi-messages"
      );



    // ========================================
    // BOLINHAS DE DIGITAÇÃO
    // ========================================

    if (
      messages
    ) {

      indicadorDigitando =
        document.createElement(
          "div"
        );


      indicadorDigitando.className =
        "fibi-msg assistant";


      indicadorDigitando.innerHTML = `

        <div
          class="fibi-digitando"
          aria-label="${fibiText("typing")}"
        >

          <span></span>
          <span></span>
          <span></span>

        </div>

      `;


      messages.appendChild(
        indicadorDigitando
      );


      messages.scrollTop =
        messages.scrollHeight;

    }



    // ========================================
    // CHAMA O BACKEND
    // ========================================

    const response =
      await fetch(
        fibiApiUrl("/api/chat"),
        {

          method:
            "POST",


          headers: {

            "Content-Type":
              "application/json"

          },


          body:
            JSON.stringify({
              conversationId,

              history:
                fibiHistory.slice(-10),

              message:
                createFibiApiMessage(
                  message
                )
            })

        }
      );


    const data =
      await response.json();



    if (
      !response.ok
    ) {

      throw new Error(

        data.error ||

        fibiIsEnglish()
          ? "Unable to chat with Fibi."
          : "Não foi possível conversar com a Fibi."

      );

    }



    // ========================================
    // SALVA CONVERSA
    // ========================================

    conversationId =
      data.conversationId;


    localStorage.setItem(
      FIBI_STORAGE_KEY,
      conversationId
    );

    addFibiHistory(
      message,
      data.answer
    );



    // ========================================
    // REMOVE BOLINHAS
    // ========================================

    if (
      indicadorDigitando
    ) {

      indicadorDigitando.remove();


      indicadorDigitando =
        null;

    }



    const status =
      document.querySelector(
        "#fibi-status"
      );


    if (
      status
    ) {

      status.hidden =
        true;

    }



    // ========================================
    // MOSTRA RESPOSTA
    // ========================================

    await addFibiTypingMessage(

      data.answer,

      {

        emergency:
          data.emergency,


        sources:
          data.sources

      }

    );



  }

  catch (
    error
  ) {

    if (
      indicadorDigitando
    ) {

      indicadorDigitando.remove();


      indicadorDigitando =
        null;

    }


    console.error(
      "Erro da Fibi:",
      error
    );


    addFibiMessage(

      "assistant",

      fibiText("error")

    );

  }

  finally {

    if (
      indicadorDigitando
    ) {

      indicadorDigitando.remove();

    }


    setFibiBusy(
      false
    );

  }

}



// ========================================
// LIMPA CONVERSA
// ========================================

async function clearFibiConversation() {

  if (
    conversationId
  ) {

    try {

      await fetch(

        fibiApiUrl(`/api/chat/${conversationId}`),

        {

          method:
            "DELETE"

        }

      );

    }

    catch (
      error
    ) {

      console.warn(

        "Não foi possível limpar a conversa no servidor.",

        error

      );

    }

  }



  conversationId =
    null;



  localStorage.removeItem(
    FIBI_STORAGE_KEY
  );

  fibiHistory = [];

  localStorage.removeItem(
    FIBI_HISTORY_KEY
  );



  const messages =
    document.querySelector(
      "#fibi-messages"
    );



  if (
    messages
  ) {

    messages.innerHTML = `

      <div class="fibi-msg assistant">

        <div class="fibi-bubble">

          ${fibiText("cleared")}

        </div>

      </div>

    `;

  }



  document
    .querySelector(
      "#fibi-input"
    )
    ?.focus();

}



// ========================================
// INICIALIZA A FIBI
// ========================================

function iniciarFibi() {

  createFibiUI();
  applyFibiLanguage();

}


// Idioma definido pela página estática (index.html / index-en.html).

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    iniciarFibi,

    {
      once: true
    }

  );

}

else {

  iniciarFibi();

}