const prompt = require("prompt-sync")();

function criar_grafo() {
  return {};
}

function inserir_vertice(grafo, vertice) {
  if (!(vertice in grafo)) {
    grafo[vertice] = [];
  } else {
    console.log(`Vértice ${vertice} já existe.`);
  }
}
function inserir_aresta(grafo, origem, destino, nao_direcionado = false) {
  if (!(origem in grafo)) inserir_vertice(grafo, origem);
  if (!(destino in grafo)) inserir_vertice(grafo, destino);

  if (!grafo[origem].includes(destino)) {
    grafo[origem].push(destino);
  }

  if (nao_direcionado && !grafo[destino].includes(origem)) {
    grafo[destino].push(origem);
  }
}

function listar_vizinhos(grafo, vertice) {
  if (!(vertice in grafo)) {
    console.log(`Vértice ${vertice} não encontrado.`);
  } else {
    console.log(
      `Vizinhos de ${vertice}: ${grafo[vertice].join(", ") || "nenhum"}`
    );
  }
}

function exibir_grafo(grafo) {
  console.log("\n=== Lista de Adjacência ===");
  for (let vertice of Object.keys(grafo)) {
    console.log(`${vertice} -> ${grafo[vertice].join(", ")}`);
  }
}

function remover_aresta(grafo, origem, destino, nao_direcionado = false) {
  if (!(origem in grafo)) return;

  grafo[origem] = grafo[origem].filter((v) => v !== destino);

  if (nao_direcionado && destino in grafo) {
    grafo[destino] = grafo[destino].filter((v) => v !== origem);
  }
}

function remover_vertice(grafo, vertice) {
  if (!(vertice in grafo)) return;

  for (let v of Object.keys(grafo)) {
    grafo[v] = grafo[v].filter((x) => x !== vertice);
  }

  delete grafo[vertice];
}

function existe_aresta(grafo, origem, destino) {
  return origem in grafo && grafo[origem].includes(destino);
}

function grau_vertices(grafo, nao_direcionado = false) {
  const graus = {};

  for (let v of Object.keys(grafo)) {
    graus[v] = { entrada: 0, saida: grafo[v].length, total: 0 };
  }

  for (let u of Object.keys(grafo)) {
    for (let v of grafo[u]) {
      if (v in graus) graus[v].entrada++;
    }
  }

  for (let v of Object.keys(grafo)) {
    graus[v].total = graus[v].entrada + graus[v].saida;
  }
  if (nao_direcionado) {
    console.log("\n=== Graus dos vértices ===");
    for (let [v, g] of Object.entries(graus)) {
      console.log(
        `${v}: total=${g.entrada}`
      );
    }

    return graus;
  }
  console.log("\n=== Graus dos vértices ===");
  for (let [v, g] of Object.entries(graus)) {
    console.log(
      `${v}: entrada=${g.entrada}, saída=${g.saida}, total=${g.total}`
    );
  }

  return graus;
}

function percurso_valido(grafo, caminho) {
  if (caminho.length < 2) return true;

  for (let i = 0; i < caminho.length - 1; i++) {
    const origem = caminho[i];
    const destino = caminho[i + 1];
    if (!existe_aresta(grafo, origem, destino)) {
      return false;
    }
  }
  return true;
}
function bfs(grafo, inicio) {
  if (!(inicio in grafo)) {
    console.log("Vértice inicial não existe no grafo.");
    return;
  }

  let fila = [inicio];
  let visitados = [];

  while (fila.length > 0) {
    const atual = fila.shift();

    if (!visitados.includes(atual)) {
      visitados.push(atual);

      const vizinhos = grafo[atual];
      for (let v of vizinhos) {
        if (!visitados.includes(v) && !fila.includes(v)) {
          fila.push(v);
        }
      }
    }
  }

  console.log("BFS (ordem de visita): " + visitados.join(" -> "));
}
function menor_caminho_bfs(grafo, inicio, destino) {
  if (!(inicio in grafo) || !(destino in grafo)) {
    console.log("Vértice inicial ou destino não existe no grafo.");
    return;
  }

  let fila = [{ vertice: inicio, caminho: [inicio] }];
  let visitados = new Set();

  while (fila.length > 0) {
    const { vertice, caminho } = fila.shift();

    if (vertice === destino) {
      console.log("Menor caminho encontrado: " + caminho.join(" -> "));
      return caminho;
    }

    if (!visitados.has(vertice)) {
      visitados.add(vertice);

      for (let vizinho of grafo[vertice]) {
        if (!visitados.has(vizinho)) {
          fila.push({ vertice: vizinho, caminho: [...caminho, vizinho] });
        }
      }
    }
  }

  console.log("Não existe caminho entre " + inicio + " e " + destino);
  return [];
}

function main() {
  let grafo = criar_grafo();
  let direcionado =
    prompt("O grafo é direcionado? (s/n): ").toLowerCase() === "s";

  while (true) {
    console.log(`
    === MENU ===
    1 - Mostrar o Grafo
    2 - Inserir Vértice
    3 - Inserir Aresta
    4 - Remover Vértice
    5 - Remover Aresta
    6 - Listar Vizinhos
    7 - Verificar Aresta
    8 - Calcular Graus
    9 - Verificar Percurso
    10 - BFS (Busca em Largura)
    11 - BFS (Menor Caminho )
    0 - Sair
    `);

    const opcao = prompt("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        exibir_grafo(grafo);
        break;
      case "2":
        inserir_vertice(grafo, prompt("Nome do vértice: "));
        break;
      case "3":
        inserir_aresta(
          grafo,
          prompt("Origem: "),
          prompt("Destino: "),
          !direcionado
        );
        break;
      case "4":
        remover_vertice(grafo, prompt("Vértice: "));
        break;
      case "5":
        remover_aresta(
          grafo,
          prompt("Origem: "),
          prompt("Destino: "),
          !direcionado
        );
        break;
      case "6":
        listar_vizinhos(grafo, prompt("Vértice: "));
        break;
      case "7":
        const o = prompt("Origem: ");
        const d = prompt("Destino: ");
        console.log(
          existe_aresta(grafo, o, d) ? "Aresta existe!" : "Aresta NÃO existe."
        );
        break;
      case "8":
        grau_vertices(grafo, !direcionado);
        break;
      case "9":
        const caminho = prompt(
          "Digite o percurso separado por vírgula (ex: A,B,C): "
        )
          .split(",")
          .map((v) => v.trim());
        console.log(
          percurso_valido(grafo, caminho)
            ? "Percurso válido!"
            : "Percurso inválido!"
        );
        break;
      case "10":
        const inicio = prompt("Vértice inicial da BFS: ");
        bfs(grafo, inicio);
        break;
      case "11":
        const inicioC = prompt("Vértice inicial: ");
        const destinoC = prompt("Vértice destino: ");
        menor_caminho_bfs(grafo, inicioC, destinoC);
        break;
      case "0":
        console.log("Saindo...");
        return;
      default:
        console.log("Opção inválida!");
    }
  }
}

main();
