// Importa as funções que vamos usar
import { 
    createSetWord,
    getIntersectionSet,
    getUnionSet,
    calculateJaccardFromSet // Mantido o nome "Sets" (plural)
} from "../similarityJaccard.config.js";

import {
    Graph,
    buildSimilarityGraph
} from "../graph.config.js";

// Lógica para as abas
function setupTabs(){ // CORRIGIDO (nome da função)
    const tabContainer = document.querySelector('.tab-nav');

    tabContainer.addEventListener('click', (e) => {
        if(!e.target.classList.contains('tab-button')){
            return;
        }

        const clickedTab = e.target;
        // Pega o data-tab
        const targetContentId = clickedTab.dataset.tab;

        // Desliga todas as abas e seus conteúdos
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active')); // CORRIGIDO (remove)

        // Liga a aba e os conteúdos certos
        clickedTab.classList.add('active');
        document.getElementById(targetContentId).classList.add('active');
    });
}

// --- CONSTANTE SIMILARITY_THRESHOLD REMOVIDA ---


function calculateFront() {
    // --- 1. Pegar Elementos de ENTRADA ---
    const docAElement = document.getElementById('docA');
    const docBElement = document.getElementById('docB');

    // --- 2. Pegar Elementos de SAÍDA (Simplificado) ---
    const resultDisplay = document.getElementById('result-display');
    const jaccardSimilarityEl = document.getElementById('jaccard-similarity'); 
    const jaccardDistanceEl = document.getElementById('jaccard-distance'); 
    
    const statusMessageEl = document.getElementById('status-message');
    
    const intersectionCountEl = document.getElementById('intersection-count');
    const unionCountEl = document.getElementById('union-count');
    const jaccardFormulaEl = document.getElementById('jaccard-formula');

    // --- Variáveis graphEdge e graphEdgeLabel REMOVIDAS ---
    
    // --- 3. Pegar Valores de ENTRADA ---
    const docA = docAElement.value;
    const docB = docBElement.value;

    // Mostra o card de resultado
    resultDisplay.style.display = 'block'; 

    // --- 4. Validação (Simplificado) ---
    if (!docA || !docB) {
        statusMessageEl.textContent = 'Por favor, preencha ambos os campos.';
        statusMessageEl.style.color = 'red';

        // Reseta os valores para o padrão
        jaccardSimilarityEl.textContent = '0.00%';
        jaccardDistanceEl.textContent = '0.00%'; 
        intersectionCountEl.textContent = 'Intersecção |A ∩ B|: 0';
        unionCountEl.textContent = 'União |A ∪ B|: 0';
        jaccardFormulaEl.textContent = 'Fórmula (J): 0 / 0';
        
        // --- Reset do Grafo REMOVIDO ---
        return;
    }

    // --- 5. Processar os Dados (Sem alteração) ---
    const setA = createSetWord(docA);
    const setB = createSetWord(docB);

    const intersectionSet = getIntersectionSet(setA, setB);
    const unionSet = getUnionSet(setA, setB);

    const intersectionCount = intersectionSet.size;
    const unionCount = unionSet.size;

    // Calcular Similaridade
    const similarityFloat = (unionCount === 0) ? 1.0 : intersectionCount / unionCount;
    const similarityPercentage = (similarityFloat * 100).toFixed(2);

    // Calcular Distância (Novo)
    const distanceFloat = 1.0 - similarityFloat;
    const distancePercentage = (distanceFloat * 100).toFixed(2);


    // --- 6. Atualizar a Interface (DOM) (Simplificado) ---
    
    // Card Principal
    jaccardSimilarityEl.textContent = `${similarityPercentage}%`; // Preenche Similaridade
    jaccardDistanceEl.textContent = `${distancePercentage}%`; // Preenche Distância
    
    statusMessageEl.textContent = 'Cálculo concluído.';
    statusMessageEl.style.color = '#b0b0b0'; // Reseta a cor

    // Detalhamento
    intersectionCountEl.textContent = `Intersecção |A ∩ B|: ${intersectionCount}`;
    unionCountEl.textContent = `União |A ∪ B|: ${unionCount}`;
    jaccardFormulaEl.textContent = `Fórmula (J): ${intersectionCount} / ${unionCount}`;

    // --- Lógica do Grafo (if/else) REMOVIDA ---
}

function parseInputToMap(text){
    const documentsMap = new Map();
    const lines = text.split('\n');

    for(const line of lines){
        if(!line.includes(':')) continue; // Ignora linhas nulas e/ou mal formatadas

        // Divide linhas em "Nome" e "Itens"
        const parts = line.split(':');
        const name = parts[0].trim();
        const itemsString = parts.slice(1).join(':'); // Pega o resto no caso de haver ':' nos itens (valores)

        if(!name || !itemsString) continue;

        // Reutiliza a fonção de Jaccard
        const wordset = createSetWord(itemsString);
        documentsMap.set(name, wordset);
    }
    return documentsMap;
    
}

function renderGraphWithCytoscape(graph, containerId){
    const elements = [];

    // Coloca os nós (vértices)
    for(const [nodeName] of graph.neighbors.entries()){ // CORRIGIDO (const)
        elements.push({
            data: {id:nodeName, label: nodeName}
        });
    }

    // --- INÍCIO DO BLOCO MOVIDO ---

    // Adiciona as Arestas (Conexões)
    const addedEdges = new Set(); // Evita colocar A -> B, B-> A
    for(const [u, neighbors] of graph.neighbors.entries()){ // CORRIGIDO (of)
        for(const [v, weight] of neighbors.entries()) {

            // Cria IDs único
            const edgeId1 = `${u}-${v}`;
            const edgeId2 = `${v}-${u}`;

            if(!addedEdges.has(edgeId1) && !addedEdges.has(edgeId2)) {
                elements.push({
                    data: {
                        id: edgeId1,
                        source: u,
                        target: v,
                        label: weight.toFixed(2) // Vai colocar o peso como rótulo
                    }
                });
                addedEdges.add(edgeId1);
            }
        }
    }

    // Renderiza o Cytoscape
    window.cytoscape({
        container: document.getElementById(containerId),
        elements: elements,

        layout: {
            name: 'cose',
            animate: true, // CORRIGIDO (nome da propriedade 'animate')
            padding: 10
        },

        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'var(--cor-principal)',
                    'label': 'data(label)',
                    'color': 'var(--cor-texto)',
                    'text-valign': 'center',
                    'font-size': '10px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': 'var(--cor-interseccao)',
                    'target-arrow-shape': 'none',
                    'curve-style': 'bezier',
                    'label': 'data(label)', // Mostra o peso
                    'font-size': '8px',
                    'color': 'var(--cor-texto)',
                    'text-background-opacity': 1,
                    'text-background-color': 'var(--cor-fundo)'
                }
            }
        ]
    });
    // --- FIM DO BLOCO MOVIDO ---
}


function buildGraphFront(){
    // Pegar entradas
    const inputText = document.getElementById('graph-input').value;
    const threshold = parseFloat(document.getElementById('graph-threshold').value);

    if(!inputText){
        alert("Por favor, alimente os campos de documentos.");
        return;
    }

    const documentsMap = parseInputToMap(inputText);
    if(documentsMap.size < 2){
        alert("Por favor, preencha, ao menos, dois docoumentos válidos no formato 'Nome: itens...'.");
        return;
    }

    const graph = buildSimilarityGraph(documentsMap, threshold);

    renderGraphWithCytoscape(graph, 'graph-visualization-container');
}


// O seu listener de evento (Sem alteração)
document.addEventListener('DOMContentLoaded', () => {

    setupTabs(); // CORRIGIDO (nome da função)

    const btnCalculate = document.getElementById('btnCalculate');
    if (btnCalculate) {
        btnCalculate.addEventListener('click', calculateFront);
    } else {
        console.error('ERRO CrÍTICO: Botão "btnCalculate" não localizado.');
    }

    const btnBuildGraph = document.getElementById('btnBuildGraph');
    if(btnBuildGraph){
        btnBuildGraph.addEventListener('click', buildGraphFront);
    } else{
        console.error('ERRO CRÍTICO: Botão "btnBuildGraph" não localizado.')
    }

    const thresholdSlider = document.getElementById('graph-threshold');
    const thresholdValue = document.getElementById('threshold-value');
    if(thresholdSlider && thresholdValue){
        thresholdSlider.addEventListener('input', (e) => {
            thresholdValue.textContent = parseFloat(e.target.value).toFixed(2);
        });
    }
});