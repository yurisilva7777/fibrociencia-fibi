(() => {
  "use strict";

  function dataLocal(valor) {
    const [ano, mes, dia] = String(valor || "").split("-").map(Number);
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
  }

  function idiomaIngles() {
    return document.documentElement.lang.toLowerCase().startsWith("en");
  }

  function atualizarCronograma() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const en = idiomaIngles();

    document.querySelectorAll(".etapa-cronograma").forEach((linha) => {
      const inicio = dataLocal(linha.dataset.inicio);
      const fim = dataLocal(linha.dataset.fim);
      const status = linha.querySelector(".status");
      if (!status || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return;

      status.className = "status";

      if (hoje < inicio) {
        status.classList.add("planejado");
        status.textContent = en ? "Planned" : "Planejado";
      } else if (hoje > fim) {
        status.classList.add("concluido");
        status.textContent = en ? "Completed" : "Concluído";
      } else {
        status.classList.add("andamento");
        status.textContent = en ? "In progress" : "Em andamento";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", atualizarCronograma, { once: true });
  } else {
    atualizarCronograma();
  }
})();
