
import { Graph, calculateIntersectionUnionSet } from "../graph.config.js";

// Função principal da Similaridade entre dois NÓS
function calculateJaccardGraph(graph, u, v){ 
    // Obtem conjuntos de vizinhança
    const neighborsU = graph.getNeighbors(u);
    const neighborsV = graph.getNeighbors(v);

    // lança execução/retorno caso os nós não existam
    if(neighborsU.size === 0 && neighborsV.size === 0){
        // Pro caso de ambos não existirem (ou não haver vizinhos), retorna 1 (ambos são idênticos em serem nulos (vazios))
        return 1.0;
    }

    // Calcula Intersecção e União dos conjuntos de vizinhanças
    const {intersection, union} = calculateIntersectionUnionSet(neighborsU, neighborsV);

        // Ttratamento de erro
        if(union === 0){
            // Evita erro por dividir por zero se ambos existirem, mas não possuírem vizinhos (CASOS EXTREMOS -> J(A, B) = 0) 
            return 1.0;
        }
        // J(u, v) = |N(u) <intersecção> N(v)| / |N(u) <união> N(v)|
        return intersection / union;
}

// TESTES!!!

const myNet = new Graph();
myNet.addNode('Nicolas');
myNet.addNode('Bruna');
myNet.addEdge('Nicolas', 'Pedro');
myNet.addEdge('Nicolas', 'Bruno');
myNet.addEdge('Nicolas', 'Ryan');
myNet.addEdge('Bruna', 'Alicia');
myNet.addEdge('Bruna', 'Suelen');
myNet.addEdge('Bruna', 'Pedro');

const result = calculateJaccardGraph(myNet, 'Nicolas', 'Bruna');
console.log(`Similaridade: ${result.toFixed(2)}`);