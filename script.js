/* ==========================================================
   1. DADOS DO SITE - edite somente esta parte (até a linha "2.")
   Os textos abaixo são EXEMPLOS: troque pelos dados reais da escola.
   Para adicionar um item, copie um bloco { ... } e separe com vírgula.
   Para remover, apague o bloco inteiro.
   ========================================================== */
const SITE = {
  escola: {
    nome: "CETEP Raso da Catarina",
    sigla: "CETEP",
    logo: "imagens/logo.jpeg",
    local: "Jeremoabo, Bahia",
    governo: "Governo do Estado da Bahia – Secretaria da Educação",
    sobre: "O Centro Territorial de Educação Profissional (CETEP) Raso da Catarina oferece cursos técnicos de nível médio para a juventude e os adultos de Jeremoabo e região, unindo formação profissional, cidadania e preparação para o mercado de trabalho."
  },

  contato: {
    endereco: "Rua/Avenida, nº – Centro, Jeremoabo – BA",
    telefone: "(75) 0000-0000",
    whatsapp: "(75) 90000-0000",
    email: "contato@exemplo.com.br",
    redes: [
      { nome: "Instagram", url: "#" },
      { nome: "Facebook", url: "#" },
      { nome: "YouTube", url: "#" }
    ]
  },

  /* Banners do topo. "cor" é o fundo; "imagem" é opcional (ex.: "img/banner1.jpg") */
  tempoBanner: 6000, // tempo de troca automática, em milissegundos
  banners: [
    { titulo: "Matrículas abertas para os cursos técnicos", texto: "Faça sua formação profissional gratuita e de qualidade, perto de casa.", cor: "#1351B4", imagem: "imagens/banner1.jpeg", botao: { texto: "Conheça os cursos", link: "#cursos" } },
    { titulo: "Feira de Ciências e Tecnologia", texto: "Projetos dos nossos estudantes em exposição para toda a comunidade.", cor: "#0C326F", imagem: "imagens/banner2.jpeg", botao: { texto: "Veja as notícias", link: "#noticias" } },
    { titulo: "Seu futuro começa aqui", texto: "Cursos que abrem portas no mercado de trabalho e no ensino superior.", cor: "#168821", imagem: "imagens/banner3.jpeg", botao: { texto: "Fale com a escola", link: "#contato" } }
  ],

  /* Atalhos da seção "Acesso rápido" */
  acesso: [
    { titulo: "Matrícula", texto: "Veja como e quando se matricular.", url: "#contato" },
    { titulo: "Sistema acadêmico (SIGEDUC)", texto: "Notas, frequência e documentos.", url: "https://sigeduc.educacao.ba.gov.br/sigeduc/verTelaLogin.do" },
    { titulo: "Secretaria da Educação", texto: "Portal da Educação da Bahia.", url: "https://www.educacao.ba.gov.br/" },
    { titulo: "Fale conosco", texto: "Telefone, e-mail e endereço.", url: "#contato" }
  ],

  /* Cursos: "eixo" cria os botões de filtro automaticamente */
  cursos: [
    { nome: "Técnico em Informática", eixo: "Informação e Comunicação", duracao: "4 semestres", turno: "Matutino, Vespertino e Noturno", modalidade: "Integrado ao Ensino Médio e Subsequente",
      resumo: "Programação, redes, manutenção de computadores e criação de sites.",
      atuacao: ["Suporte técnico e help desk", "Desenvolvimento de sistemas e sites", "Redes e infraestrutura de T.I."] },
    { nome: "Técnico em Administração", eixo: "Gestão e Negócios", duracao: "3 semestres", turno: "Matutino, Vespertino e Noturno", modalidade: "Integrado ao Ensino Médio e Subsequente",
      resumo: "Rotinas administrativas, finanças, pessoas e empreendedorismo.",
      atuacao: ["Empresas públicas e privadas", "Comércio e serviços", "Negócio próprio"] },
    { nome: "Técnico em Agropecuária", eixo: "Recursos Naturais", duracao: "3 semestres", turno: "Matutino, Vespertino e Noturno", modalidade: "Integrado ao Ensino Médio e Subsequente",
      resumo: "Produção vegetal e animal, manejo do solo e convivência com o semiárido.",
      atuacao: ["Propriedades rurais", "Cooperativas e associações", "Assistência técnica"] },
    { nome: "Técnico em Enfermagem", eixo: "Saúde", duracao: "3 semestres", turno: "Matutino, Vespertino e Noturno", modalidade: "Subsequente",
      resumo: "Cuidados em saúde, primeiros socorros e atendimento ao paciente.",
      atuacao: ["Hospitais e postos de saúde", "Clínicas", "Atendimento domiciliar"] }
  ],

  /* Notícias: data no formato AAAA-MM-DD */
  noticias: [
    { data: "2026-10-10", titulo: "Inscrições abertas para a Feira de Ciências", texto: "Estudantes já podem inscrever seus projetos na feira da escola." },
    { data: "2026-09-18", titulo: "Reunião de pais e responsáveis", texto: "Encontro para apresentar o calendário do próximo bimestre." },
    { data: "2026-08-28", titulo: "Aulas de laboratório de informática", texto: "Novo horário de uso do laboratório para as turmas técnicas." }
  ]
};

/* ==========================================================
   2. CÓDIGO - não precisa mexer daqui para baixo
   ========================================================== */
const $ = (s) => document.querySelector(s);
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function montarBasico() {
  const e = SITE.escola;
  document.title = e.nome + " – " + e.local;
  $("#govTexto").textContent = e.governo;
  if (e.logo) {
  $("#sigla").innerHTML = `<img src="${esc(e.logo)}" alt="">`;
  $("#sigla").classList.add("com-logo");
} else {
  $("#sigla").textContent = e.sigla;
}
  $("#nomeEscola").textContent = e.nome;
  $("#local").textContent = e.local;
  $("#sobreTexto").textContent = e.sobre;
  $("#acesso").innerHTML = SITE.acesso.map((a) =>
    `<a class="card" href="${esc(a.url)}"><h3>${esc(a.titulo)}</h3><p>${esc(a.texto)}</p></a>`).join("");
}

function montarBanner() {
  const bs = SITE.banners;
  let n = 0, timer;
  $("#slides").innerHTML = bs.map((b) =>
    `<article class="slide" style="--cor:${esc(b.cor || "#1351B4")}${b.imagem ? `;background-image:url('${esc(b.imagem)}')` : ""}">
      <div class="wrap"><h2 class="slide-t">${esc(b.titulo)}</h2><p>${esc(b.texto)}</p>
      ${b.botao ? `<a class="btn" href="${esc(b.botao.link)}">${esc(b.botao.texto)}</a>` : ""}</div></article>`).join("");
  $("#pontos").innerHTML = bs.map((_, i) => `<button aria-label="Ir para o slide ${i + 1}"></button>`).join("");

  const slides = [...document.querySelectorAll(".slide")];
  const pontos = [...document.querySelectorAll("#pontos button")];
  const ir = (i) => {
    n = (i + bs.length) % bs.length;
    slides.forEach((s, k) => { s.classList.toggle("ativo", k === n); s.inert = k !== n; pontos[k].setAttribute("aria-current", k === n); });
  };
  const auto = () => {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => ir(n + 1), SITE.tempoBanner);
  };

  $("#ant").onclick = () => { ir(n - 1); auto(); };
  $("#prox").onclick = () => { ir(n + 1); auto(); };
  pontos.forEach((p, i) => (p.onclick = () => { ir(i); auto(); }));
  const area = $("#inicio");
  area.addEventListener("mouseenter", () => clearInterval(timer));
  area.addEventListener("mouseleave", auto);
  area.addEventListener("focusin", () => clearInterval(timer));
  area.addEventListener("focusout", auto);
  area.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") ir(n - 1);
    if (e.key === "ArrowRight") ir(n + 1);
  });
  ir(0);
  auto();
}

function montarCursos() {
  const cs = SITE.cursos, grade = $("#cursosGrid"), dlg = $("#dlg");
  const eixos = ["Todos", ...new Set(cs.map((c) => c.eixo))];
  $("#filtros").innerHTML = eixos.map((e, i) => `<button class="chip" aria-pressed="${i === 0}">${esc(e)}</button>`).join("");

  const listar = (eixo) => {
    grade.innerHTML = cs.map((c, i) => (eixo === "Todos" || c.eixo === eixo)
      ? `<button class="card" data-i="${i}"><span class="tag">${esc(c.eixo)}</span><h3>${esc(c.nome)}</h3><p>${esc(c.resumo)}</p><span class="mais">Ver detalhes</span></button>` : "").join("");
  };
  listar("Todos");

  $("#filtros").onclick = (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    document.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
    listar(b.textContent);
  };
  grade.onclick = (e) => {
    const b = e.target.closest(".card");
    if (!b) return;
    const c = cs[b.dataset.i];
    $("#dlgConteudo").innerHTML = `<span class="tag">${esc(c.eixo)}</span><h3 id="dlgTitulo">${esc(c.nome)}</h3><p>${esc(c.resumo)}</p>
      <dl><dt>Duração</dt><dd>${esc(c.duracao)}</dd><dt>Turno</dt><dd>${esc(c.turno)}</dd><dt>Modalidade</dt><dd>${esc(c.modalidade)}</dd></dl>
      <h4>Onde o profissional atua</h4><ul>${c.atuacao.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`;
    dlg.showModal();
  };
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest(".fechar")) dlg.close(); });
}

function montarNoticias() {
  const fmt = (d) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR");
  $("#noticiasLista").innerHTML = [...SITE.noticias].sort((a, b) => b.data.localeCompare(a.data)).map((n) =>
    `<li><time datetime="${esc(n.data)}">${fmt(n.data)}</time><div><h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p></div></li>`).join("");
}

function montarRodape() {
  const c = SITE.contato, e = SITE.escola;
  $("#rodape").innerHTML = `
    <div><h2>Contato</h2><ul>
      <li>${esc(c.endereco)}</li>
      <li>Telefone: <a href="tel:${c.telefone.replace(/\D/g, "")}">${esc(c.telefone)}</a></li>
      <li>WhatsApp: <a href="https://wa.me/55${c.whatsapp.replace(/\D/g, "")}">${esc(c.whatsapp)}</a></li>
      <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li></ul></div>
    <div><h2>Links</h2><ul>${SITE.acesso.map((a) => `<li><a href="${esc(a.url)}">${esc(a.titulo)}</a></li>`).join("")}</ul></div>
    <div><h2>Redes sociais</h2><ul>${c.redes.map((r) => `<li><a href="${esc(r.url)}">${esc(r.nome)}</a></li>`).join("")}</ul></div>
    <p class="copy">© ${new Date().getFullYear()} ${esc(e.nome)}. Todos os direitos reservados.</p>`;
}

/* Menu no celular */
$("#menuBtn").onclick = () => {
  const aberto = $("#menu").classList.toggle("aberto");
  $("#menuBtn").setAttribute("aria-expanded", aberto);
};
$("#menu").onclick = (e) => {
  if (e.target.matches("a")) { $("#menu").classList.remove("aberto"); $("#menuBtn").setAttribute("aria-expanded", false); }
};

montarBasico();
montarBanner();
montarCursos();
montarNoticias();
montarRodape();
