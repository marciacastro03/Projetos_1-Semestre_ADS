/* ====== DADOS ====== */
let produtos = ["Notebook Dell", "Mouse Logitech", "Teclado Mecânico"];
let codigos  = ["NB001", "MS002", "KB003"];
let precos   = [3500.00, 150.00, 450.00];
let estoque  = [10, 25, 15];
let ultimaAtualizacao = ["02/11/2025 10:00", "02/11/2025 10:05", "02/11/2025 10:10"];

let LIMITE_BAIXO = 5;

/* histórico para o mini-gráfico (sparkline) do KPI 2) */
let historicoValor = [12000, 16000, 14500, 21000, 18000, 26000];

/* ====== AUXILIARES ====== */
function mostrar(id, botao){
  let views = document.getElementsByClassName("view");
  for(let i=0;i<views.length;i++) views[i].classList.remove("show");
  document.getElementById(id).classList.add("show");

  let tabs = document.getElementsByClassName("tab");
  for(let i=0;i<tabs.length;i++) tabs[i].classList.remove("active");
  botao.classList.add("active");
}
function dataAgora(){ return "02/11/2025 10:00"; } // simulação simples
function formatarPreco(v){ let t=""+v; if(t.indexOf(".")!=-1) t=t.replace(".",","); return "R$ "+t; }
function procurarIndice(cod){ for(let i=0;i<codigos.length;i++) if(codigos[i]==cod) return i; return -1; }

/* animação “pop” nos KPIs quando mudam */
function kpiFlash(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.remove('flash');
  void el.offsetWidth; // força reflow
  el.classList.add('flash');
}

/* ====== SPARKLINE (mini-gráfico) ====== */
function desenharSparkline(){
  // limita histórico a no máximo 12 pontos
  if(historicoValor.length>12) historicoValor = historicoValor.slice(historicoValor.length-12);

  // evita divisão por zero
  let min = historicoValor[0], max = historicoValor[0];
  for(let i=1;i<historicoValor.length;i++){
    if(historicoValor[i]<min) min=historicoValor[i];
    if(historicoValor[i]>max) max=historicoValor[i];
  }
  if(max===min){ max = min + 1; }

  let w = 100, h = 28;
  let passoX = historicoValor.length>1 ? (w/(historicoValor.length-1)) : 0;

  let pontos = "";
  for(let i=0;i<historicoValor.length;i++){
    let x = Math.round(i*passoX);
    let yNorm = (historicoValor[i]-min)/(max-min); // 0..1
    let y = Math.round(h - yNorm*h); // invertido (0 em baixo)
    pontos += (i? " ":"") + x + "," + y;
  }

  let poly = document.getElementById("sparkline");
  let dot  = document.getElementById("sparkDot");
  if(poly){ poly.setAttribute("points", pontos); }
  if(dot && historicoValor.length){
    let lastX = Math.round((historicoValor.length-1)*passoX);
    let lastYNorm = (historicoValor[historicoValor.length-1]-min)/(max-min);
    let lastY = Math.round(h - lastYNorm*h);
    dot.setAttribute("cx", lastX);
    dot.setAttribute("cy", lastY);
  }
}

/* ====== LISTAR + KPIs ====== */
function listarProdutos(){
  let corpo = document.getElementById("tbodyProdutos");
  corpo.innerHTML = "";
  for(let i=0;i<produtos.length;i++){
    let status = estoque[i] < LIMITE_BAIXO ? "Estoque baixo" : "Em estoque";
    corpo.innerHTML +=
      "<tr>"+
      "<td>"+codigos[i]+"</td>"+
      "<td>"+produtos[i]+"</td>"+
      "<td>"+formatarPreco(precos[i])+"</td>"+
      "<td>"+estoque[i]+"</td>"+
      "<td>"+status+"</td>"+
      "<td>"+(ultimaAtualizacao[i]||"-")+"</td>"+
      "</tr>";
  }

  // KPIs
  document.getElementById("kpiTotalProdutos").innerHTML = produtos.length;
  kpiFlash("kpiTotalProdutos");

  let total=0;
  for(let i=0;i<produtos.length;i++) total += precos[i]*estoque[i];
  document.getElementById("kpiValorTotal").innerHTML = formatarPreco(total);
  kpiFlash("kpiValorTotal");

  let baixos=0;
  for(let i=0;i<estoque.length;i++) if(estoque[i]<LIMITE_BAIXO) baixos++;
  document.getElementById("kpiEstoqueBaixo").innerHTML = baixos+" produtos";
  kpiFlash("kpiEstoqueBaixo");

  // atualiza sparkline com o novo total
  historicoValor.push(Math.round(total));
  desenharSparkline();
}

/* ====== CADASTRAR ====== */
function cadastrarProduto(){
  let nome = document.getElementById("inNome").value;
  let codigo = document.getElementById("inCodigo").value;
  let preco = document.getElementById("inPreco").value;
  let qtd   = document.getElementById("inQtd").value;
  let msg   = document.getElementById("msgCadastro");

  if(nome==="" || codigo==="" || preco==="" || qtd===""){
    msg.textContent="Preencha todos os campos!"; msg.className="msg err"; return;
  }
  if(procurarIndice(codigo)!==-1){
    msg.textContent="Código já cadastrado!"; msg.className="msg err"; return;
  }

  produtos.push(nome);
  codigos.push(codigo);
  precos.push(parseFloat(preco));
  estoque.push(parseInt(qtd));
  ultimaAtualizacao.push(dataAgora());

  msg.textContent="Produto cadastrado com sucesso!"; msg.className="msg ok";
  listarProdutos();
}

/* ====== BUSCAR ====== */
function buscarProduto(){
  let codigo = document.getElementById("inBuscaCodigo").value;
  let out = document.getElementById("resultadoBusca");
  let i = procurarIndice(codigo);
  if(i===-1){ out.textContent="Produto não encontrado."; return; }
  out.innerHTML =
    "<b>"+produtos[i]+"</b> ("+codigos[i]+")<br>"+
    "Preço: "+formatarPreco(precos[i])+" • Quantidade: "+estoque[i]+
    "<br><small>Atualizado: "+(ultimaAtualizacao[i]||"-")+"</small>";
}

/* ====== ENTRADA ====== */
function registrarEntrada(){
  let codigo = document.getElementById("inEntCodigo").value;
  let qtd = parseInt(document.getElementById("inEntQtd").value);
  let msg = document.getElementById("msgEntrada");

  let i = procurarIndice(codigo);
  if(i===-1){ msg.textContent="Produto não encontrado."; msg.className="msg err"; return; }
  if(!qtd || qtd<=0){ msg.textContent="Quantidade inválida."; msg.className="msg err"; return; }

  estoque[i] += qtd;
  ultimaAtualizacao[i] = dataAgora();
  msg.textContent="Entrada registrada!"; msg.className="msg ok";
  listarProdutos();
}

/* ====== BAIXA ====== */
function registrarBaixa(){
  let codigo = document.getElementById("inBaiCodigo").value;
  let qtd = parseInt(document.getElementById("inBaiQtd").value);
  let msg = document.getElementById("msgBaixa");

  let i = procurarIndice(codigo);
  if(i===-1){ msg.textContent="Produto não encontrado."; msg.className="msg err"; return; }
  if(!qtd || qtd<=0){ msg.textContent="Quantidade inválida."; msg.className="msg err"; return; }
  if(qtd>estoque[i]){ msg.textContent="Estoque insuficiente."; msg.className="msg err"; return; }

  estoque[i] -= qtd;
  ultimaAtualizacao[i] = dataAgora();
  msg.textContent="Baixa registrada!"; msg.className="msg ok";
  listarProdutos();
}

/* ====== SAIR ====== */
function sair(){
  alert("Sessão encerrada!");
  let botoes = document.getElementsByTagName("button");
  for(let i=0;i<botoes.length;i++) botoes[i].disabled = true;
}

/* boot */
listarProdutos();
desenharSparkline();
