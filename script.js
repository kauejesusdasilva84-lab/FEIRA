/* =========================================================
   CETEP Raso da Catarina - comportamento do site
   Para mudar os cursos, edite apenas a lista "cursos" abaixo.
   Os cards, filtros, janela e o select do formulário são
   criados automaticamente a partir dela.
   ========================================================= */

/* ---------- DADOS (edite aqui) ----------
   Estes cursos são EXEMPLOS de cursos técnicos comuns nos CETEPs.
   Troque pelos cursos reais oferecidos em Jeremoabo. */
const cursos = [
  {
    id: "administracao",
    nome: "Técnico em Administração",
    eixo: "Gestão e Negócios",
    cor: "#1b5a4e",
    resumo: "Aprenda a organizar, planejar e cuidar da rotina de empresas e comércios.",
    aprende: ["Rotinas administrativas e financeiras", "Atendimento e vendas", "Planejamento e controle de estoque", "Ferramentas de escritório"],
    atua: ["Comércio e serviços", "Empresas públicas e privadas", "Negócio próprio"]
  },
  {
    id: "informatica",
    nome: "Técnico em Informática",
    eixo: "Informação e Comunicação",
    cor: "#0d5c8a",
    resumo: "Entre no mundo da tecnologia: computadores, redes e programação.",
    aprende: ["Montagem e manutenção de computadores", "Redes de computadores", "Lógica e programação", "Criação de sites"],
    atua: ["Suporte técnico", "Empresas de tecnologia", "Serviços autônomos"]
  },
  {
    id: "agropecuaria",
    nome: "Técnico em Agropecuária",
    eixo: "Recursos Naturais",
    cor: "#7a6a12",
    resumo: "Formação para produzir com técnica e sustentabilidade na realidade do semiárido.",
    aprende: ["Criação de animais", "Cultivo e manejo do solo", "Convivência com o semiárido", "Gestão da propriedade rural"],
    atua: ["Propriedades rurais", "Cooperativas e associações", "Assistência técnica"]
  },
  {
    id: "agroecologia",
    nome: "Técnico em Agroecologia",
    eixo: "Recursos Naturais",
    cor: "#3d7a2a",
    resumo: "Produção de alimentos saudáveis que respeita o meio ambiente e a cultura local.",
    aprende: ["Agricultura sustentável", "Manejo ecológico de pragas", "Sistemas agroflorestais", "Aproveitamento da água"],
    atua: ["Agricultura familiar", "Projetos socioambientais", "Órgãos de extensão rural"]
  },
  {
    id: "enfermagem",
    nome: "Técnico em Enfermagem",
    eixo: "Saúde",
    cor: "#a8324a",
    resumo: "Cuide de pessoas com conhecimento, ética e responsabilidade.",
    aprende: ["Cuidados básicos de saúde", "Primeiros socorros", "Biossegurança", "Atendimento humanizado"],
    atua: ["Hospitais e postos de saúde", "Clínicas", "Atendimento domiciliar"]
  },
  {
    id: "seguranca",
    nome: "Técnico em Segurança do Trabalho",
    eixo: "Segurança",
    cor: "#b8560f",
    resumo: "Proteja trabalhadores e ajude empresas a evitar acidentes.",
    aprende: ["Prevenção de acidentes", "Normas de segurança", "Equipamentos de proteção", "Inspeção de ambientes de trabalho"],
    atua: ["Indústrias e construção", "Empresas em geral", "Consultoria em segurança"]
  }
];

/* ---------- ATALHOS ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   1. BANNER INTERATIVO (carrossel)
   ========================================================= */
const hero      = $("#inicio");
const slides    = $$(".slide");
const skies     = $$(".sky");
const dotsBox   = $("#dots");
const bar       = $("#progressBar");
const pauseBtn  = $("#pause");
const DURATION  = 6500;            // tempo de cada slide (ms)

let atual = 0;
let timer = null;
let pausado = reduceMotion;        // respeita quem prefere menos movimento
let hoverPause = false;

// cria as bolinhas
slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.className = "dot";
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
  b.addEventListener("click", () => irPara(i, true));
  dotsBox.appendChild(b);
});
const dots = $$(".dot");

function irPara(indice, manual = false) {
  atual = (indice + slides.length) % slides.length;

  slides.forEach((s, i) => s.classList.toggle("is-active", i === atual));
  skies.forEach((s, i)  => s.classList.toggle("is-on", i === atual));
  dots.forEach((d, i)   => {
    d.classList.toggle("is-active", i === atual);
    d.setAttribute("aria-selected", i === atual);
  });
  hero.dataset.scene = atual;      // o CSS move o sol conforme este valor

  reiniciarProgresso();
  if (manual) agendar();
}

function reiniciarProgresso() {
  bar.style.transition = "none";
  bar.style.width = "0";
  if (pausado || hoverPause) return;
  void bar.offsetWidth;            // força o navegador a "resetar" a barra
  bar.style.transition = `width ${DURATION}ms linear`;
  bar.style.width = "100%";
}

function agendar() {
  clearTimeout(timer);
  if (pausado || hoverPause) return;
  timer = setTimeout(() => irPara(atual + 1), DURATION);
}

function atualizarPausa() {
  pauseBtn.textContent = pausado ? "Continuar" : "Pausar";
  pauseBtn.setAttribute("aria-pressed", pausado);
  pauseBtn.setAttribute("aria-label", pausado ? "Continuar apresentação" : "Pausar apresentação");
  reiniciarProgresso();
  agendar();
}

$("#prev").addEventListener("click", () => irPara(atual - 1, true));
$("#next").addEventListener("click", () => irPara(atual + 1, true));
pauseBtn.addEventListener("click", () => { pausado = !pausado; atualizarPausa(); });

// pausa ao passar o mouse
hero.addEventListener("mouseenter", () => { hoverPause = true;  reiniciarProgresso(); agendar(); });
hero.addEventListener("mouseleave", () => { hoverPause = false; reiniciarProgresso(); agendar(); });

// teclado (setas) quando o foco está no banner
hero.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  irPara(atual - 1, true);
  if (e.key === "ArrowRight") irPara(atual + 1, true);
});

// arrastar com o dedo no celular
let toqueX = null;
hero.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50) irPara(atual + (dx < 0 ? 1 : -1), true);
  toqueX = null;
});

// pausa quando a aba não está visível
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearTimeout(timer);
  else { reiniciarProgresso(); agendar(); }
});

irPara(0);
atualizarPausa();

/* =========================================================
   2. MENU MOBILE + LINK ATIVO
   ========================================================= */
const menuBtn = $("#menuBtn");
const nav = $("#nav");

menuBtn.addEventListener("click", () => {
  const aberto = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", aberto);
});
$$("a", nav).forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

// destaca no menu a seção que está na tela
const linksMenu = $$('.nav a[href^="#"]:not(.btn)');
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(en => {
    if (!en.isIntersecting) return;
    linksMenu.forEach(l => l.classList.toggle("is-current", l.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => observador.observe(s));

/* =========================================================
   3. NÚMEROS (calculados a partir da lista de cursos)
   ========================================================= */
$("[data-count-courses]").textContent = cursos.length;
$("[data-count-axes]").textContent = new Set(cursos.map(c => c.eixo)).size;

/* =========================================================
   4. CARTÕES "VIRAR" (Missão, Visão, Valores)
   ========================================================= */
$$(".flip").forEach(card => {
  card.addEventListener("click", () => {
    const virado = card.getAttribute("aria-pressed") === "true";
    card.setAttribute("aria-pressed", !virado);
  });
});

/* =========================================================
   5. CURSOS: filtros, cartões e janela de detalhes
   ========================================================= */
const filtros = $("#filters");
const grade   = $("#cards");
const select  = $("#cursoSelect");
const modal   = $("#modal");
let cursoAberto = null;

const eixos = ["Todos", ...new Set(cursos.map(c => c.eixo))];

// botões de filtro
eixos.forEach((eixo, i) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = eixo;
  b.setAttribute("aria-pressed", i === 0);
  b.addEventListener("click", () => filtrar(eixo, b));
  filtros.appendChild(b);
});

// cartões + opções do formulário
cursos.forEach(c => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.eixo = c.eixo;
  card.style.setProperty("--accent", c.cor);
  card.innerHTML = `
    <p class="card__axis">${c.eixo}</p>
    <h3>${c.nome}</h3>
    <p>${c.resumo}</p>
    <button class="card__btn" type="button">Ver detalhes</button>`;
  $(".card__btn", card).addEventListener("click", () => abrirModal(c));
  grade.appendChild(card);

  select.add(new Option(c.nome, c.nome));
});

function filtrar(eixo, botao) {
  $$(".chip", filtros).forEach(b => b.setAttribute("aria-pressed", b === botao));
  $$(".card", grade).forEach(card => {
    card.classList.toggle("is-hidden", eixo !== "Todos" && card.dataset.eixo !== eixo);
  });
}

function abrirModal(c) {
  cursoAberto = c;
  $("#modalAxis").textContent = c.eixo;
  $("#modalTitle").textContent = c.nome;
  $("#modalDesc").textContent = c.resumo;
  $("#modalLearn").innerHTML = c.aprende.map(t => `<li>${t}</li>`).join("");
  $("#modalWork").innerHTML  = c.atua.map(t => `<li>${t}</li>`).join("");
  modal.showModal();
}

$("#modalClose").addEventListener("click", () => modal.close());
// fecha ao clicar fora da janela
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// botão "Quero este curso": fecha, leva ao formulário e já escolhe o curso
$("#modalCta").addEventListener("click", () => {
  if (cursoAberto) select.value = cursoAberto.nome;
  modal.close();
  $("#contato").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  setTimeout(() => $("input[name='nome']").focus({ preventScroll: true }), 500);
});

/* =========================================================
   6. PERGUNTAS FREQUENTES (abre um por vez)
   ========================================================= */
$$(".faq__q").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq__item");
    const vaiAbrir = !item.classList.contains("is-open");

    $$(".faq__item").forEach(i => {
      i.classList.remove("is-open");
      $(".faq__q", i).setAttribute("aria-expanded", "false");
    });
    if (vaiAbrir) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* =========================================================
   7. FORMULÁRIO DE CONTATO (validação no navegador)
   Obs.: sem servidor, a mensagem não é enviada a lugar nenhum.
   Para enviar de verdade, você precisará de um backend
   (ou serviço como Formspree) ou trocar por link de WhatsApp.
   ========================================================= */
const form = $("#contactForm");
const ok   = $("#formOk");

function erro(campo, texto) {
  const span = $(`[data-err="${campo}"]`);
  const input = form.elements[campo];
  span.textContent = texto;
  input.classList.toggle("is-invalid", Boolean(texto));
  return !texto;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ok.hidden = true;

  const nome  = form.nome.value.trim();
  const whats = form.whats.value.replace(/\D/g, "");
  const curso = form.curso.value;

  const valido = [
    erro("nome",  nome.length < 3 ? "Digite seu nome completo." : ""),
    erro("whats", whats.length < 10 || whats.length > 11 ? "Digite o WhatsApp com DDD. Exemplo: (75) 90000-0000." : ""),
    erro("curso", !curso ? "Escolha um curso." : "")
  ].every(Boolean);

  if (!valido) return;

  ok.textContent = `Obrigado, ${nome.split(" ")[0]}! Recebemos seu interesse em ${curso}. A secretaria entrará em contato.`;
  ok.hidden = false;
  form.reset();
});

// máscara simples de telefone: (75) 90000-0000
form.whats.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 6)      v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
  else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  e.target.value = v;
});

/* =========================================================
   8. RODAPÉ
   ========================================================= */
$("#year").textContent = new Date().getFullYear();
