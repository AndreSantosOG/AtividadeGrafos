const prompt = require("prompt-sync")();

function criar_grafo() {
  return { matriz: [], vertices: [] };
}

function inserir_vertice(grafo, vertice) {
  const { matriz, vertices } = grafo;
  if (vertices.includes(vertice)) {
    console.log(`Vértice ${vertice} já existe.`);
    return;
  }

  vertices.push(vertice);
  const n = vertices.length;

  for (let i = 0; i < matriz.length; i++) {
    matriz[i].push(0);
  }

  matriz.push(new Array(n).fill(0));
}

function inserir_aresta(grafo, origem, destino, nao_direcionado = false) {
  const { matriz, vertices } = grafo;

  if (!vertices.includes(origem)) inserir_vertice(grafo, origem);
  if (!vertices.includes(destino)) inserir_vertice(grafo, destino);

  const i = vertices.indexOf(origem);
  const j = vertices.indexOf(destino);

  matriz[i][j] = 1;

  if (nao_direcionado) matriz[j][i] = 1;
}

function remover_vertice(grafo, vertice) {
  const { matriz, vertices } = grafo;

  if (!vertices.includes(vertice)) {
    console.log(`Vértice ${vertice} não encontrado.`);
    return;
  }

  const index = vertices.indexOf(vertice);

  matriz.splice(index, 1);

  for (let i = 0; i < matriz.length; i++) {
    matriz[i].splice(index, 1);
  }

  vertices.splice(index, 1);
}

function remover_aresta(grafo, origem, destino, nao_direcionado = false) {
  const { matriz, vertices } = grafo;
  if (!vertices.includes(origem) || !vertices.includes(destino)) return;

  const i = vertices.indexOf(origem);
  const j = vertices.indexOf(destino);

  matriz[i][j] = 0;
  if (nao_direcionado) matriz[j][i] = 0;
}

function existe_aresta(grafo, origem, destino) {
  const { matriz, vertices } = grafo;
  if (!vertices.includes(origem) || !vertices.includes(destino)) return false;

  const i = vertices.indexOf(origem);
  const j = vertices.indexOf(destino);
  return matriz[i][j] === 1;
}

function vizinhos(grafo, vertice) {
  const { matriz, vertices } = grafo;
  if (!vertices.includes(vertice)) return [];

  const i = vertices.indexOf(vertice);
  const lista = [];

  for (let j = 0; j < matriz[i].length; j++) {
    if (matriz[i][j] === 1) lista.push(vertices[j]);
  }

  return lista;
}

function listar_vizinhos(grafo, vertice) {
  const lista = vizinhos(grafo, vertice);
  if (lista.length === 0) {
    console.log(`Vértice ${vertice} não tem vizinhos.`);
  } else {
    console.log(`Vizinhos de ${vertice}: ${lista.join(", ")}`);
  }
}

function grau_vertices(grafo, nao_direcionado = false) {
  const { matriz, vertices } = grafo;
  const graus = {};

  for (let i = 0; i < vertices.length; i++) {
    const saida = matriz[i].reduce((a, b) => a + b, 0);
    const entrada = matriz.map((linha) => linha[i]).reduce((a, b) => a + b, 0);
    const total = entrada + saida;

    graus[vertices[i]] = { entrada, saida, total };
  }

  console.log("\n=== Graus dos vértices ===");
  for (const v of vertices) {
    if (nao_direcionado) {
      console.log(`${v}: total= ${graus[v].saida}`);
    } else {
      console.log(
        `${v}: entrada=${graus[v].entrada}, saída=${graus[v].saida}, total=${graus[v].total}`
      );
    }
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

function exibir_grafo(grafo) {
  const { matriz, vertices } = grafo;

  if (vertices.length === 0) {
    console.log("Grafo vazio.");
    return;
  }

  console.log("\n=== Matriz de Adjacência ===");
  console.log("    " + vertices.join(" "));
  for (let i = 0; i < matriz.length; i++) {
    console.log(`${vertices[i]} | ${matriz[i].join(" ")}`);
  }
}

function main() {
  const grafo = criar_grafo();
  const direcionado =
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
      case "0":
        console.log("Saindo...");
        return;
      default:
        console.log("Opção inválida!");
    }
  }
}

main();
