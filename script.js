/* =====================================================
   EDITE SÓ ESTA PARTE para personalizar a proposta
   ===================================================== */
const CONFIG = {
  cliente:  "NOME DA CLIENTE",        // nome da cliente ou da empresa
  autor:    "SEU NOME",               // seu nome ou da sua marca
  whatsapp: "5511999999999",          // DDI + DDD + número, só dígitos
  validade: "7 dias a partir do envio", // ou uma data, ex: "30/11/2026"
  mensagemWhats: "Olá! Quero aceitar a proposta.",

  // Valores em reais
  precos: {
    setupDe: 5000,  setupPor: 2000,   // Etapa 1
    siteDe:  6000,  sitePor:  2000,   // Etapa 2
    mensal1: 1000,                    // mensalidade com o sistema
    mensal2De: 1800, mensal2Por: 1300, // mensalidade com o site

    // Composição da mensalidade de R$ 1.000
    servidor: 50,        // Hostinger
    bling: 200,          // Titânio Faixa 2 (360 MB)
    modulo: 187.5,       // preço de cada um dos 4 sistemas para a cliente
    moduloTabela: 350    // valor de tabela de cada sistema
  },

  // Planos do Bling (referência nov/2026). aPartir: true mostra "a partir de"
  blingPlanos: [
    { nome: "Titânio Faixa 2", espaco: "360 MB", preco: 200,  atual: true },
    { nome: "Titânio Faixa 3", espaco: "1,2 GB", preco: 450 },
    { nome: "Diamante",        espaco: "1,8 GB", preco: 650 },
    { nome: "Elite",           espaco: "5 GB",   preco: 1250, aPartir: true }
  ]
};
/* ===================================================== */

const brl = n => n.toLocaleString("pt-BR", {
  style: "currency", currency: "BRL",
  minimumFractionDigits: Number.isInteger(n) ? 0 : 2
});
const p = CONFIG.precos;

// Valores calculados
p.totalTabela = p.servidor + p.bling + 4 * p.moduloTabela;
p.siteExtra = p.mensal2Por - p.mensal1;
if (p.servidor + p.bling + 4 * p.modulo !== p.mensal1) {
  console.warn("A soma de servidor + Bling + 4 sistemas não fecha com a mensalidade.");
}

document.querySelectorAll("[data-price]").forEach(el => {
  el.textContent = brl(p[el.dataset.price]);
});

const saves = { setup: p.setupDe - p.setupPor, site: p.siteDe - p.sitePor };
document.querySelectorAll("[data-save]").forEach(el => {
  el.textContent = brl(saves[el.dataset.save]);
});

const totals = {
  de: p.setupDe + p.siteDe,
  por: p.setupPor + p.sitePor,
  save: saves.setup + saves.site
};
document.querySelectorAll("[data-total]").forEach(el => {
  el.textContent = brl(totals[el.dataset.total]);
});

const hoje = new Date().toLocaleDateString("pt-BR");
const fills = { cliente: CONFIG.cliente, autor: CONFIG.autor, validade: CONFIG.validade, data: hoje };
document.querySelectorAll("[data-fill]").forEach(el => {
  el.textContent = fills[el.dataset.fill];
});

document.title = "Proposta para " + CONFIG.cliente;

const link = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.mensagemWhats);
document.getElementById("cta-whats").href = link;

// Tabela de planos do Bling
const tbody = document.getElementById("bling-plans");
CONFIG.blingPlanos.forEach(pl => {
  const mensal = p.mensal1 - p.bling + pl.preco;
  const prefixo = pl.aPartir ? "a partir de " : "";
  const tr = document.createElement("tr");
  if (pl.atual) tr.className = "atual";
  tr.innerHTML =
    "<td><strong></strong>" + (pl.atual ? "<span>plano contratado</span>" : "") + "</td>" +
    "<td></td><td class=\"num\"></td><td class=\"num\"></td>";
  tr.children[0].firstChild.textContent = pl.nome;
  tr.children[1].textContent = pl.espaco;
  tr.children[2].textContent = prefixo + brl(pl.preco);
  tr.children[3].textContent = prefixo + brl(mensal);
  tbody.appendChild(tr);
});