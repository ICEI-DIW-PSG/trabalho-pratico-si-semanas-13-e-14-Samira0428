const API_URL = "http://localhost:3000/receitas";
let receitas = [];

// Carregar dados 
async function carregarDados() {
  try {
    const res = await fetch(API_URL);
    receitas = await res.json();
    iniciarPagina();
  } catch (erro) {
    console.error("Erro ao carregar receitas:", erro);
  }
}

// Iniciar página 
function iniciarPagina() {
  if (document.querySelector(".carousel-inner")) carregaCarrossel();
  if (document.querySelector(".receitas")) carregaReceitas();
  if (document.querySelector(".detalhes")) carregaDetalhes();
  if (document.getElementById("form-receita")) configurarForm();
}

function carregaCarrossel() {
  const container = document.querySelector(".carousel-inner");
  const indicadores = document.querySelector(".carousel-indicators");
  if (!container || !indicadores) return;

  container.innerHTML = "";
  indicadores.innerHTML = "";

  receitas.slice(0, 5).forEach((item, index) => {
    const ativo = index === 0 ? "active" : "";

    indicadores.innerHTML += `
      <button type="button" data-bs-target="#carouselExampleCaptions" 
        data-bs-slide-to="${index}" class="${ativo}" aria-current="${ativo ? 'true' : 'false'}"></button>
    `;

    container.innerHTML += `
      <div class="carousel-item ${ativo}">
        <a href="detalhes.html?id=${item.id}" style="text-decoration:none; color:inherit;">
          <img src="${item.imagem}" class="d-block w-100" style="max-height:400px; object-fit:cover;">
          <div class="carousel-caption d-none d-md-block">
            <h5>${item.titulo}</h5>
            <p>${item.descricao}</p>
          </div>
        </a>
      </div>
    `;
  });
}

// Carrega receitas
function carregaReceitas() {
  const container = document.querySelector(".receitas");
  if (!container) return;

  let strHTML = "";
  receitas.forEach(item => {
    strHTML += `
      <div class="col-12 col-md-6 col-lg-3 mb-3">
        <div class="card h-100 shadow-sm">
          <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.titulo}</h5>
            <p class="card-text flex-grow-1">${item.descricao}</p>
            <a href="detalhes.html?id=${item.id}" class="btn btn-outline-success mt-auto">Ver Receita</a>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <small class="text-muted">${item.data || ""} • ${item.categoria || ""}</small>
            <div>
              <button class="btn btn-sm btn-outline-danger" onclick="excluirReceita(${item.id})">Excluir</button>
              <a href="cadastro_receitas.html?id=${item.id}" class="btn btn-sm btn-outline-primary">Editar</a>

            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = strHTML;
}

// Carrega detalhes
async function carregaDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const res = await fetch(`${API_URL}/${id}`);
    const receita = await res.json();

    const container = document.querySelector(".detalhes");
    container.innerHTML = `
      <h2 class="fw-bold text-success mb-3">${receita.titulo}</h2>
      <img src="${receita.imagem}" class="img-fluid rounded mb-3" style="max-width:350px;">
      <p class="text-muted">${receita.data || ""} • Categoria: ${receita.categoria || ""}</p>
      <p class="lead">${receita.descricao}</p>
      <hr>
      <pre style="white-space: pre-wrap;">${receita.conteudo}</pre>
      <a href="index.html" class="btn btn-success mt-4">Voltar</a>
    `;
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
  }
}

// Formulário
function configurarForm() {
  const form = document.getElementById("form-receita");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      titulo: document.getElementById("titulo").value,
      descricao: document.getElementById("descricao").value,
      imagem: document.getElementById("imagem").value,
      categoria: document.getElementById("categoria").value
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (!res.ok) throw new Error("Erro ao salvar!");

      alert("Receita cadastrada com sucesso!");
      window.location.href = "index.html";
    } catch (erro) {
      alert("Erro ao salvar receita.");
      console.error(erro);
    }
  });
}

// Exclui receita
async function excluirReceita(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir");
    alert("Receita excluída com sucesso!");
    window.location.reload();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir receita.");
  }
}

window.onload = carregarDados;
