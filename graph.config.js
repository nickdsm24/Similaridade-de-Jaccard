import { calculateJaccardFromSet } from "./similarityJaccard.config.js";

// Estrutura para representar Grafo PONDERADO (com pesos)
export class Graph {
    constructor() {
        // Agora armazena o vizinho E o peso da aresta
        // Estrutura: Map< string, Map<string, number> >
        // Nó -> (Nó Vizinho -> Peso)
        this.neighbors = new Map();
    }

    // Adiciona um nó (vértice) ao grafo 
    addNode(node) {
        if (!this.neighbors.has(node)) {
            // Inicia o valor com um Map() vazio para guardar os vizinhos e seus pesos
            this.neighbors.set(node, new Map());
        }
    }

    // Adiciona uma aresta (conexão) entre dois nós com um peso
    addEdge(u, v, weight) {
        // Garante que nós existam no Map
        this.addNode(u);
        this.addNode(v);

        // Adiciona a conexão ponderada
        this.neighbors.get(u).set(v, weight);
        // Faz o mesmo para o sentido oposto (Grafo não-direcionado)
        this.neighbors.get(v).set(u, weight);
    }

    // Obtém Map de vizinhos de UM nó
    getNeighbors(node) {
        // Devolve o Map de vizinhos/pesos ou um Map nulo
        return this.neighbors.get(node) || new Map();
    }
}

/**
 * Constrói um grafo de similaridade a partir de um mapa de documentos.
 * @param {Map<string, Set<string>>} documentsMap - Um mapa onde a chave é o nome do documento (ex: "Set A") e o valor é o Set de palavras.
 * @param {number} threshold - O "limite" de similaridade. Arestas só são criadas se a similaridade for MAIOR que este valor.
 * @returns {Graph} - A instância do grafo preenchido.
 */
export function buildSimilarityGraph(documentsMap, threshold) {
    const graph = new Graph();
    const docNames = Array.from(documentsMap.keys()); 

    // Adiciona todos os documentos como nós no grafo
    for (const name of docNames) {
        graph.addNode(name);
    }

    // Compara cada par de documentos (sem repetir)
    for (let i = 0; i < docNames.length; i++) {
        for (let j = i + 1; j < docNames.length; j++) {
            
            const nameA = docNames[i];
            const nameB = docNames[j];

            const setA = documentsMap.get(nameA);
            const setB = documentsMap.get(nameB);

            // Calcula a similaridade usando nossa função centralizada
            const similarity = calculateJaccardFromSet(setA, setB);

            // Se a similaridade for maior que o limite, cria a conexão (aresta)
            if (similarity > threshold) {
                // Passa a similaridade como o "peso"
                graph.addEdge(nameA, nameB, similarity);
            }
        }
    }
    
    return graph;
}