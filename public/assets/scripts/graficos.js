const API_URL = "http://localhost:3000/receitas";

async function carregarDadosGrafico() {
    const res = await fetch(API_URL);
    const receitas = await res.json();

    // Agrupar categorias
    const categorias = {};

    receitas.forEach(r => {
        const cat = r.categoria || "Sem categoria";
        categorias[cat] = (categorias[cat] || 0) + 1;
    });

    // Preparar dados do Chart.js
   const ctx = document.getElementById('grafico');


    new Chart(ctx, {
    type: 'pie',
    data: {
        labels: Object.keys(categorias),
        datasets: [{
            data: Object.values(categorias),
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
}

carregarDadosGrafico();
