const prompt = require("prompt-sync")();

function criar_grafo() {
  return [];
}

function inserir_vertice(vertices, vertice) {
  if (!vertices.includes(vertice)) {
    vertices.push(vertice);
  } else {
    console.log(`Vértice ${vertice} já existe.`);
  }
}

function inserir_aresta(grafo, origem, destino, nao_direcionado = false) {
  if (!grafo.some(a => a.origem === origem && a.destino === destino)) {
    grafo.push({ origem, destino });
  }

  if (nao_direcionado && !grafo.some(a => a.origem === destino && a.destino === origem)) {
    grafo.push({ origem: destino, destino: origem });
  }
}

function exibir_grafo(grafo) {
  console.log("\n=== Lista de Arestas ===");
  if (grafo.length === 0) {
    console.log("Nenhuma aresta inserida ainda.");
    return;
  }
  grafo.forEach(({ origem, destino }) => {
    console.log(`${origem} -> ${destino}`);
  });
}

function listar_vizinhos(grafo, vertice) {
  const vizinhos = grafo
    .filter(a => a.origem === vertice)
    .map(a => a.destino);

  console.log(
    `Vizinhos de ${vertice}: ${vizinhos.join(", ") || "nenhum"}`
  );
}

function remover_aresta(grafo, origem, destino, nao_direcionado = false) {
  let removidas = 0;
  for (let i = grafo.length - 1; i >= 0; i--) {
    const a = grafo[i];
    if (
      (a.origem === origem && a.destino === destino) ||
      (nao_direcionado && a.origem === destino && a.destino === origem)
    ) {
      grafo.splice(i, 1);
      removidas++;
    }
  }
  if (removidas === 0) console.log("Aresta não encontrada.");
}

function remover_vertice(grafo, vertice) {
  for (let i = grafo.length - 1; i >= 0; i--) {
    const a = grafo[i];
    if (a.origem === vertice || a.destino === vertice) {
      grafo.splice(i, 1);
    }
  }
}

function existe_aresta(grafo, origem, destino) {
  return grafo.some(a => a.origem === origem && a.destino === destino);
}

function grau_vertices(grafo, vertices, nao_direcionado = false) {
  const graus = {};

  vertices.forEach(v => {
    graus[v] = { entrada: 0, saida: 0, total: 0 };
  });

  grafo.forEach(({ origem, destino }) => {
    if (graus[origem]) graus[origem].saida++;
    if (graus[destino]) graus[destino].entrada++;2
  });

  for (let v of Object.keys(graus)) {
    graus[v].total = graus[v].entrada + graus[v].saida;
  }

  console.log("\n=== Graus dos vértices ===");
  for (let [v, g] of Object.entries(graus)) {
    if (nao_direcionado) {
      console.log(`${v}: total=${g.entrada}`);
    } else {
      console.log(`${v}: entrada=${g.entrada}, saída=${g.saida}, total=${g.total}`);
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

function main() {
  let grafo = criar_grafo();
  let vertices = [];
  let direcionado = prompt("O grafo é direcionado? (s/n): ").toLowerCase() === "s";

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
        inserir_vertice(vertices, prompt("Nome do vértice: "));
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
        vertices = vertices.filter(v => v !== prompt);
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
        grau_vertices(grafo, vertices, !direcionado);
        break;
      case "9":
        const caminho = prompt(
          "Digite o percurso separado por vírgula (ex: A,B,C): "
        )
          .split(",")
          .map(v => v.trim());
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
