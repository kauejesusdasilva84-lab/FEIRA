/* =========================================================
   CETEP Raso da Catarina | comportamento do site
   Para mudar cursos e etapas, edite as listas "cursos" e
   "etapas" logo abaixo. O resto do site se atualiza sozinho.
   ========================================================= */

/* ---------- DADOS (edite aqui) ----------
   Os cursos abaixo são EXEMPLOS. Troque pelos cursos reais. */
const cursos = [
  {
    nome: "Técnico em Administração", eixo: "Gestão e Negócios", icone: "fa-briefcase", cor: "#1351b4",
    resumo: "Aprenda a organizar, planejar e cuidar da rotina de empresas e comércios.",
    aprende: ["Rotinas administrativas e financeiras", "Atendimento e vendas", "Controle de estoque", "Ferramentas de escritório"],
    atua: ["Comércio e serviços", "Empresas públicas e privadas", "Negócio próprio"]
  },
  {
    nome: "Técnico em Informática", eixo: "Informação e Comunicação", icone: "fa-laptop-code", cor: "#0c7a8a",
    resumo: "Entre no mundo da tecnologia: computadores, redes e programação.",
    aprende: ["Montagem e manutenção de computadores", "Redes de computadores", "Lógica e programação", "Criação de sites"],
    atua: ["Suporte técnico", "Empresas de tecnologia", "Serviços autônomos"]
  },
  {
    nome: "Técnico em Agropecuária", eixo: "Recursos Naturais", icone: "fa-tractor", cor: "#7a6a12",
    resumo: "Formação para produzir com técnica e sustentabilidade na realidade do semiárido.",
    aprende: ["Criação de animais", "Cultivo e manejo do solo", "Convivência com o semiárido", "Gestão da propriedade rural"],
    atua: ["Propriedades rurais", "Cooperativas e associações", "Assistência técnica"]
  },
  {
    nome: "Técnico em Agroecologia", eixo: "Recursos Naturais", icone: "fa-seedling", cor: "#168821",
    resumo: "Produção de alimentos saudáveis que respeita o meio ambiente e a cultura local.",
    aprende: ["Agricultura sustentável", "Manejo ecológico de pragas", "Sistemas agroflorestais", "Aproveitamento da água"],
    atua: ["Agricultura familiar", "Projetos socioambientais", "Órgãos de extensão rural"]
  },
  {
    nome: "Técnico em Enfermagem", eixo: "Saúde", icone: "fa-heart-pulse", cor: "#a8324a",
    resumo: "Cuide de pessoas com conhecimento, ética e responsabilidade.",
    aprende: ["Cuidados básicos de saúde", "Primeiros socorros", "Biossegurança", "Atendimento humanizado"],
    atua: ["Hospitais e postos de saúde", "Clínicas", "Atendimento domiciliar"]
  },
  {
    nome: "Técnico em Segurança do Trabalho", eixo: "Segurança", icone: "fa-helmet-safety", cor: "#b8560f",
    resumo: "Proteja trabalhadores e ajude empresas a evitar acidentes.",
    aprende: ["Prevenção de acidentes", "Normas de segurança", "Equipamentos de proteção", "Inspeção de ambientes de trabalho"],
    atua: ["Indústrias e construção", "Empresas em geral", "Consultoria em segurança"]
  }
];

const etapas = [
  { titulo: "1. Acompanhe o edital", texto: "Veja o período de inscrição, o número de vagas e os cursos disponíveis. O edital é divulgado pela escola a cada processo seletivo." },
  { titulo: "2. Faça a inscrição", texto: "Reúna os documentos pedidos no edital e preencha a inscrição dentro do prazo. Em caso de dúvida, fale com a secretaria." },
  { titulo: "3. Confirme a matrícula", texto: "Se for selecionado, compareça à escola no período indicado para efetivar a sua vaga." },
  { titulo: "4. Comece o curso", texto: "Receba a turma, o horário e as orientações do primeiro dia. Bons estudos!" }
];

/* ---------- ATALHOS ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// guardar preferências no navegador (com proteção, caso o navegador bloqueie)
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const ler     = (k)    => { try { return localStorage.getItem(k); } catch (e) { return null; } };

// remove acentos e deixa minúsculo (para a busca achar "tecnico" ou "técnico")
const normalizar = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// aviso rápido na parte de baixo da tela
const toast = $("#toast");
let toastTimer;
function avisar(texto) {
  toast.textContent = texto;
  toast.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-show"), 3200);
}

function irPara(seletor) {
  const el = $(seletor);
  if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

/* =========================================================
   1. ACESSIBILIDADE: tamanho da fonte e alto contraste
   ========================================================= */
let passoFonte = parseInt(ler("cetep-fonte") || "0", 10);
function aplicarFonte() {
  passoFonte = Math.max(-2, Math.min(3, passoFonte));
  document.documentElement.style.fontSize = (100 + passoFonte * 12.5) + "%";
  guardar("cetep-fonte", passoFonte);
}
$("#fontUp").addEventListener("click",   () => { passoFonte++; aplicarFonte(); });
$("#fontDown").addEventListener("click", () => { passoFonte--; aplicarFonte(); });
aplicarFonte();

const botaoContraste = $("#contrastBtn");
function aplicarContraste(ligado) {
  document.body.classList.toggle("hc", ligado);
  botaoContraste.setAttribute("aria-pressed", ligado);
  guardar("cetep-contraste", ligado ? "1" : "0");
}
botaoContraste.addEventListener("click", () => aplicarContraste(!document.body.classList.contains("hc")));
aplicarContraste(ler("cetep-contraste") === "1");

/* =========================================================
   2. MENU LATERAL
   ========================================================= */
const drawer = $("#drawer");
const scrim = $("#scrim");
const menuBtn = $("#menuBtn");

function abrirMenu() {
  drawer.inert = false;
  drawer.classList.add("is-open");
  scrim.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  $("#drawerClose").focus();
}
function fecharMenu(devolverFoco = true) {
  drawer.classList.remove("is-open");
  drawer.inert = true;
  scrim.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  if (devolverFoco) menuBtn.focus();
}
menuBtn.addEventListener("click", abrirMenu);
$("#drawerClose").addEventListener("click", () => fecharMenu());
scrim.addEventListener("click", () => fecharMenu());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) fecharMenu(); });

// links do menu: fecha e rola até a seção
$$(".drawer__list a").forEach(a => a.addEventListener("click", () => fecharMenu(false)));

// submenu de cursos
const subToggle = $(".sub-toggle");
const subLista = $("#courseSub");
subToggle.addEventListener("click", () => {
  const aberto = subToggle.getAttribute("aria-expanded") === "true";
  subToggle.setAttribute("aria-expanded", !aberto);
  subLista.hidden = aberto;
});

/* =========================================================
   3. BANNER INTERATIVO (carrossel)
   ========================================================= */
const hero = $("#inicio");
const slides = $$(".slide");
const dotsBox = $("#dots");
const barra = $("#progressBar");
const pauseBtn = $("#pause");
const TEMPO = 6500;

let atual = 0;
let timer = null;
let pausado = reduceMotion;
let mouseEmCima = false;

slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "dot";
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
  b.addEventListener("click", () => mostrarSlide(i, true));
  dotsBox.appendChild(b);
});
const dots = $$(".dot");

function mostrarSlide(i, manual = false) {
  atual = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("is-active", n === atual));
  dots.forEach((d, n) => {
    d.classList.toggle("is-active", n === atual);
    d.setAttribute("aria-selected", n === atual);
  });
  reiniciarBarra();
  if (manual) agendar();
}

function reiniciarBarra() {
  barra.style.transition = "none";
  barra.style.width = "0";
  if (pausado || mouseEmCima) return;
  void barra.offsetWidth;                 // força o navegador a "zerar" a barra antes de animar
  barra.style.transition = `width ${TEMPO}ms linear`;
  barra.style.width = "100%";
}
function agendar() {
  clearTimeout(timer);
  if (pausado || mouseEmCima) return;
  timer = setTimeout(() => mostrarSlide(atual + 1), TEMPO);
}
function atualizarPausa() {
  const icone = $("i", pauseBtn);
  icone.className = pausado ? "fa-solid fa-play" : "fa-solid fa-pause";
  $("span", pauseBtn).textContent = pausado ? "Continuar" : "Pausar";
  pauseBtn.setAttribute("aria-pressed", pausado);
  pauseBtn.setAttribute("aria-label", pausado ? "Continuar apresentação" : "Pausar apresentação");
  reiniciarBarra();
  agendar();
}

$("#prev").addEventListener("click", () => mostrarSlide(atual - 1, true));
$("#next").addEventListener("click", () => mostrarSlide(atual + 1, true));
pauseBtn.addEventListener("click", () => { pausado = !pausado; atualizarPausa(); });
hero.addEventListener("mouseenter", () => { mouseEmCima = true;  reiniciarBarra(); agendar(); });
hero.addEventListener("mouseleave", () => { mouseEmCima = false; reiniciarBarra(); agendar(); });
hero.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  mostrarSlide(atual - 1, true);
  if (e.key === "ArrowRight") mostrarSlide(atual + 1, true);
});

// arrastar o dedo no celular
let toqueX = null;
hero.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50) mostrarSlide(atual + (dx < 0 ? 1 : -1), true);
  toqueX = null;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearTimeout(timer);
  else { reiniciarBarra(); agendar(); }
});

mostrarSlide(0);
atualizarPausa();

/* =========================================================
   4. ABAS (Missão, Visão e Valores)
   ========================================================= */
function iniciarAbas(caixa) {
  const abas = $$('[role="tab"]', caixa);
  const paineis = $$('[role="tabpanel"]', caixa);

  function ativar(aba, focar = false) {
    abas.forEach((a, i) => {
      const ativa = a === aba;
      a.setAttribute("aria-selected", ativa);
      a.tabIndex = ativa ? 0 : -1;
      paineis[i].hidden = !ativa;
    });
    if (focar) aba.focus();
  }
  abas.forEach((aba, i) => {
    aba.addEventListener("click", () => ativar(aba));
    aba.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") ativar(abas[(i + 1) % abas.length], true);
      if (e.key === "ArrowLeft")  ativar(abas[(i - 1 + abas.length) % abas.length], true);
    });
  });
}
iniciarAbas($("#aboutTabs"));

/* =========================================================
   5. CURSOS: filtros, cartões e janela de detalhes
   ========================================================= */
const filtros = $("#filters");
const grade = $("#cards");
const select = $("#cursoSelect");
const modal = $("#modal");
const contador = $("#courseCount");
let cursoAberto = null;

const eixos = ["Todos", ...new Set(cursos.map(c => c.eixo))];

eixos.forEach((eixo, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = eixo;
  b.setAttribute("aria-pressed", i === 0);
  b.addEventListener("click", () => filtrar(eixo, b));
  filtros.appendChild(b);
});

cursos.forEach((c) => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.eixo = c.eixo;
  card.style.setProperty("--accent", c.cor);
  card.innerHTML = `
    <span class="card__icon" aria-hidden="true"><i class="fa-solid ${c.icone}"></i></span>
    <p class="card__axis">${c.eixo}</p>
    <h3>${c.nome}</h3>
    <p>${c.resumo}</p>
    <button type="button" class="btn btn--secondary btn--sm">Ver detalhes</button>`;
  $("button", card).addEventListener("click", () => abrirModal(c));
  grade.appendChild(card);

  select.add(new Option(c.nome, c.nome));

  // também entra no submenu lateral
  const li = document.createElement("li");
  li.innerHTML = `<button type="button">${c.nome}</button>`;
  $("button", li).addEventListener("click", () => { fecharMenu(false); irPara("#cursos"); abrirModal(c); });
  subLista.appendChild(li);
});

function filtrar(eixo, botao) {
  $$(".chip", filtros).forEach(b => b.setAttribute("aria-pressed", b === botao));
  let visiveis = 0;
  $$(".card", grade).forEach(card => {
    const mostrar = eixo === "Todos" || card.dataset.eixo === eixo;
    card.classList.toggle("is-hidden", !mostrar);
    if (mostrar) visiveis++;
  });
  atualizarContador(visiveis);
}
function atualizarContador(n) {
  contador.textContent = `${n} ${n === 1 ? "curso encontrado" : "cursos encontrados"}`;
}
atualizarContador(cursos.length);

function abrirModal(c) {
  cursoAberto = c;
  $("#modalAxis").textContent = c.eixo;
  $("#modalTitle").textContent = c.nome;
  $("#modalDesc").textContent = c.resumo;
  $("#modalLearn").innerHTML = c.aprende.map(t => `<li>${t}</li>`).join("");
  $("#modalWork").innerHTML = c.atua.map(t => `<li>${t}</li>`).join("");
  modal.showModal();
}
$("#modalClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
$("#modalCta").addEventListener("click", () => {
  if (cursoAberto) select.value = cursoAberto.nome;
  modal.close();
  irPara("#contato");
  setTimeout(() => $("#f-nome").focus({ preventScroll: true }), 600);
});

/* =========================================================
   6. COMO INGRESSAR (passo a passo)
   ========================================================= */
const passos = $$(".step");
let etapaAtual = 0;

function mostrarEtapa(i) {
  etapaAtual = Math.max(0, Math.min(etapas.length - 1, i));
  passos.forEach((p, n) => {
    p.classList.toggle("is-active", n === etapaAtual);
    p.classList.toggle("is-done", n < etapaAtual);
    if (n === etapaAtual) p.setAttribute("aria-current", "step"); else p.removeAttribute("aria-current");
  });
  $("#stepTitle").textContent = etapas[etapaAtual].titulo;
  $("#stepText").textContent = etapas[etapaAtual].texto;
  $("#stepPrev").disabled = etapaAtual === 0;
  $("#stepNext").textContent = etapaAtual === etapas.length - 1 ? "Falar com a secretaria" : "Próxima etapa";
}
passos.forEach((p, i) => p.addEventListener("click", () => mostrarEtapa(i)));
$("#stepPrev").addEventListener("click", () => mostrarEtapa(etapaAtual - 1));
$("#stepNext").addEventListener("click", () => {
  if (etapaAtual === etapas.length - 1) irPara("#contato");
  else mostrarEtapa(etapaAtual + 1);
});
mostrarEtapa(0);

/* =========================================================
   7. PERGUNTAS FREQUENTES (acordeão)
   ========================================================= */
$$(".accordion__btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".accordion__item");
    const vaiAbrir = !item.classList.contains("is-open");
    $$(".accordion__item").forEach(i => {
      i.classList.remove("is-open");
      $(".accordion__btn", i).setAttribute("aria-expanded", "false");
    });
    if (vaiAbrir) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// avaliação da página
$$("[data-fb]").forEach(b => b.addEventListener("click", () => {
  const msg = $("#fbMsg");
  msg.textContent = b.dataset.fb === "sim"
    ? "Obrigado pela sua avaliação!"
    : "Obrigado! Use o formulário de contato para nos dizer o que melhorar.";
  msg.hidden = false;
  avisar("Avaliação registrada (demonstração)");
}));

/* =========================================================
   8. BUSCA NO SITE
   ========================================================= */
const campo = $("#q");
const resultados = $("#results");

// monta o "índice" do que pode ser encontrado
const indice = [
  { titulo: "Cursos técnicos", tipo: "Seção", alvo: "#cursos", chaves: "cursos tecnicos profissionalizantes eixos" },
  { titulo: "Como ingressar", tipo: "Seção", alvo: "#ingresso", chaves: "matricula inscricao edital vagas documentos ingresso" },
  { titulo: "Institucional", tipo: "Seção", alvo: "#sobre", chaves: "sobre escola missao visao valores" },
  { titulo: "Notícias e avisos", tipo: "Seção", alvo: "#noticias", chaves: "noticias avisos novidades" },
  { titulo: "Perguntas frequentes", tipo: "Seção", alvo: "#duvidas", chaves: "duvidas faq perguntas" },
  { titulo: "Fale conosco", tipo: "Seção", alvo: "#contato", chaves: "contato telefone endereco email whatsapp secretaria" },
  ...cursos.map(c => ({ titulo: c.nome, tipo: "Curso · " + c.eixo, curso: c, chaves: c.resumo + " " + c.aprende.join(" ") + " " + c.atua.join(" ") })),
  ...$$(".accordion__btn").map(b => ({ titulo: b.textContent.trim(), tipo: "Pergunta frequente", alvo: "#duvidas", chaves: "" }))
];

function buscar(texto) {
  const termo = normalizar(texto.trim());
  if (termo.length < 2) return fecharBusca();

  const achados = indice.filter(item => normalizar(item.titulo + " " + item.chaves).includes(termo)).slice(0, 8);
  resultados.innerHTML = "";

  if (!achados.length) {
    resultados.innerHTML = `<li><span class="empty">Nenhum resultado para "${texto.replace(/</g, "&lt;")}".</span></li>`;
  } else {
    achados.forEach(item => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.innerHTML = `<button type="button">${item.titulo}<small>${item.tipo}</small></button>`;
      $("button", li).addEventListener("click", () => {
        fecharBusca();
        campo.value = "";
        if (item.curso) { irPara("#cursos"); abrirModal(item.curso); }
        else irPara(item.alvo);
      });
      resultados.appendChild(li);
    });
  }
  resultados.hidden = false;
  campo.setAttribute("aria-expanded", "true");
}
function fecharBusca() {
  resultados.hidden = true;
  campo.setAttribute("aria-expanded", "false");
}

campo.addEventListener("input", () => buscar(campo.value));
campo.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharBusca();
  if (e.key === "ArrowDown") { const b = $("button", resultados); if (b) { e.preventDefault(); b.focus(); } }
});
resultados.addEventListener("keydown", (e) => {
  const botoes = $$("button", resultados);
  const i = botoes.indexOf(document.activeElement);
  if (e.key === "ArrowDown") { e.preventDefault(); botoes[Math.min(i + 1, botoes.length - 1)].focus(); }
  if (e.key === "ArrowUp")   { e.preventDefault(); (i <= 0 ? campo : botoes[i - 1]).focus(); }
  if (e.key === "Escape")    { fecharBusca(); campo.focus(); }
});
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  buscar(campo.value);
  const primeiro = $("button", resultados);
  if (primeiro) primeiro.click();
});
document.addEventListener("click", (e) => { if (!e.target.closest(".search")) fecharBusca(); });

/* =========================================================
   9. BREADCRUMB (mostra em qual seção você está)
   ========================================================= */
const migalha = $("#crumbCurrent");
const vigia = new IntersectionObserver((entradas) => {
  entradas.forEach(en => { if (en.isIntersecting) migalha.textContent = en.target.dataset.crumb; });
}, { rootMargin: "-40% 0px -55% 0px" });
$$("section[data-crumb]").forEach(s => vigia.observe(s));

/* =========================================================
   10. FORMULÁRIO DE CONTATO
   Obs.: sem servidor, a mensagem não é enviada a lugar nenhum.
   ========================================================= */
const form = $("#contactForm");
const ok = $("#formOk");

function erro(nomeCampo, texto) {
  $(`[data-err="${nomeCampo}"]`).textContent = texto;
  const el = form.elements[nomeCampo];
  el.classList.toggle("is-invalid", Boolean(texto));
  el.setAttribute("aria-invalid", Boolean(texto));
  return !texto;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ok.hidden = true;

  const nome = form.nome.value.trim();
  const whats = form.whats.value.replace(/\D/g, "");
  const curso = form.curso.value;

  const resultado = [
    erro("nome", nome.length < 3 ? "Informe seu nome completo." : ""),
    erro("whats", whats.length < 10 || whats.length > 11 ? "Informe o WhatsApp com DDD. Exemplo: (75) 90000-0000." : ""),
    erro("curso", !curso ? "Selecione um curso." : "")
  ];
  if (!resultado.every(Boolean)) {
    const primeiroErro = $(".is-invalid", form);
    if (primeiroErro) primeiroErro.focus();
    return;
  }

  ok.textContent = `Obrigado, ${nome.split(" ")[0]}! Recebemos seu interesse em ${curso}. A secretaria entrará em contato.`;
  ok.hidden = false;
  avisar("Mensagem enviada (demonstração)");
  form.reset();
});

// máscara de telefone: (75) 90000-0000
form.whats.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 6)      v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
  else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  e.target.value = v;
});

/* =========================================================
   11. EXTRAS: voltar ao topo, aviso de cookies, ano do rodapé
   ========================================================= */
const topo = $("#toTop");
window.addEventListener("scroll", () => { topo.hidden = window.scrollY < 600; }, { passive: true });
topo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

const cookiebar = $("#cookiebar");
if (ler("cetep-aviso") !== "ok") cookiebar.hidden = false;
$("#cookieOk").addEventListener("click", () => { cookiebar.hidden = true; guardar("cetep-aviso", "ok"); });

$("#year").textContent = new Date().getFullYear();
