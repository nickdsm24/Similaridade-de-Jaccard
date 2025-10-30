import { 
    createSetWord,
    getIntersectionSet,
    getUnionSet
} from "./src/similarityJaccard.config.js";

// Objeto para armazenar o conteúdo dos arquivos lidos
const uploadedFileContent = {
    docA: null,
    docB: null
};


// Lógica para "colar text0"/"upload"
function setupInputTabs() {
    const tabNavs = document.querySelectorAll('.input-tab-nav');

    tabNavs.forEach(nav => {
        nav.addEventListener('click', (e) => {
            if (!e.target.classList.contains('input-tab-button')) {
                return;
            }
            
            const clickedTab = e.target;
            const targetTabId = clickedTab.dataset.tab; 
            const parentBoxId = clickedTab.parentElement.dataset.targetBox; 

            nav.querySelectorAll('.input-tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll(`[data-parent-box="${parentBoxId}"]`).forEach(content => content.classList.remove('active'));

            clickedTab.classList.add('active');
            document.getElementById(targetTabId).classList.add('active');
        });
    });
}


// Lógica de upload
function setupFileUploadListeners() {
    const fileInputA = document.getElementById('fileA');
    const fileNameA = document.getElementById('fileA-name');
    const fileInputB = document.getElementById('fileB');
    const fileNameB = document.getElementById('fileB-name');

    const readFile = (file, docKey, nameDisplay) => {
        if (!file || file.type !== 'text/plain') {
            alert('Por favor, selecione um arquivo .txt válido.');
            nameDisplay.textContent = 'Nenhum arquivo selecionado.';
            uploadedFileContent[docKey] = null;
            return;
        }

        nameDisplay.textContent = `Arquivo: ${file.name}`;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            uploadedFileContent[docKey] = e.target.result;
            console.log(`Conteúdo do ${docKey} carregado com sucesso.`);
        };
        
        reader.onerror = () => {
            alert('Erro ao ler o arquivo.');
            nameDisplay.textContent = 'Erro ao ler o arquivo.';
            uploadedFileContent[docKey] = null;
        };
        
        reader.readAsText(file);
    };

    fileInputA.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            readFile(e.target.files[0], 'docA', fileNameA);
        }
    });

    fileInputB.addEventListener('change', (e) => {
         if (e.target.files.length > 0) {
            readFile(e.target.files[0], 'docB', fileNameB);
         }
    });
}


// Lógica principal
function calculateFront() {
    const resultDisplay = document.getElementById('result-display');
    const jaccardSimilarityEl = document.getElementById('jaccard-similarity'); 
    const jaccardDistanceEl = document.getElementById('jaccard-distance'); 
    const statusMessageEl = document.getElementById('status-message');
    const intersectionCountEl = document.getElementById('intersection-count');
    const unionCountEl = document.getElementById('union-count');
    const jaccardFormulaEl = document.getElementById('jaccard-formula');
    
    let docAText = "";
    let docBText = "";

    if (document.querySelector('[data-tab="doc1-text"]').classList.contains('active')) {
        docAText = document.getElementById('docA').value;
    } else {
        docAText = uploadedFileContent.docA;
    }

    if (document.querySelector('[data-tab="doc2-text"]').classList.contains('active')) {
        docBText = document.getElementById('docB').value;
    } else {
        docBText = uploadedFileContent.docB;
    }

    resultDisplay.style.display = 'block'; 

    if (!docAText || !docBText) {
        statusMessageEl.textContent = 'Por favor, preencha ambos os documentos (via texto ou upload).';
        statusMessageEl.style.color = 'red';
        jaccardSimilarityEl.textContent = '0.00%';
        jaccardDistanceEl.textContent = '0.00%'; 
        intersectionCountEl.textContent = 'Intersecção |A ∩ B|: 0';
        unionCountEl.textContent = 'União |A ∪ B|: 0';
        jaccardFormulaEl.textContent = 'Fórmula (J): 0 / 0';
        return;
    }

    
   const removeStopwords = document.getElementById('checkStopwords').checked;
    const useStemming = document.getElementById('checkStemming').checked;
    
    // Lógica de n-gram
    const useBigrams = document.getElementById('checkBigrams').checked; // Lê o ID
    const ngramSize = useBigrams ? 2 : 1; // Se marcado, n=2. Senão, n=1.
    
    // Passa o valor (1 ou 2) para a função
    const setA = createSetWord(docAText, removeStopwords, useStemming, ngramSize);
    const setB = createSetWord(docBText, removeStopwords, useStemming, ngramSize);

    const intersectionSet = getIntersectionSet(setA, setB);
    const unionSet = getUnionSet(setA, setB);
    const intersectionCount = intersectionSet.size;
    const unionCount = unionSet.size;

    const similarityFloat = (unionCount === 0) ? 1.0 : intersectionCount / unionCount;
    const similarityPercentage = (similarityFloat * 100).toFixed(2);
    const distanceFloat = 1.0 - similarityFloat;
    const distancePercentage = (distanceFloat * 100).toFixed(2);

    jaccardSimilarityEl.textContent = `${similarityPercentage}%`;
    jaccardDistanceEl.textContent = `${distancePercentage}%`;
    statusMessageEl.textContent = 'Cálculo concluído.';
    statusMessageEl.style.color = '#555555';
    intersectionCountEl.textContent = `Intersecção |A ∩ B|: ${intersectionCount}`;
    unionCountEl.textContent = `União |A ∪ B|: ${unionCount}`;
    jaccardFormulaEl.textContent = `Fórmula (J): ${intersectionCount} / ${unionCount}`;
}

// Função de limpar
function clearForm() {
    document.getElementById('docA').value = '';
    document.getElementById('docB').value = '';
    uploadedFileContent.docA = null;
    uploadedFileContent.docB = null;
    document.getElementById('fileA-name').textContent = 'Nenhum arquivo selecionado.';
    document.getElementById('fileB-name').textContent = 'Nenhum arquivo selecionado.';
    document.getElementById('fileA').value = null;
    document.getElementById('fileB').value = null;
    document.getElementById('result-display').style.display = 'none';

    document.querySelector('[data-tab="doc1-text"]').classList.add('active');
    document.querySelector('[data-tab="doc1-upload"]').classList.remove('active');
    document.getElementById('doc1-text').classList.add('active');
    document.getElementById('doc1-upload').classList.remove('active');
    
    document.querySelector('[data-tab="doc2-text"]').classList.add('active');
    document.querySelector('[data-tab="doc2-upload"]').classList.remove('active');
    document.getElementById('doc2-text').classList.add('active');
    document.getElementById('doc2-upload').classList.remove('active');

    // Resets checkbox
    document.getElementById('checkStopwords').checked = false;
    document.getElementById('checkStemming').checked = false;
    document.getElementById('checkBigrams').checked = false;
    
    console.log('Formulário limpo.');
}

// Escuta os eventos (cliques de btn)
document.addEventListener('DOMContentLoaded', () => {
    
    setupInputTabs();
    setupFileUploadListeners();
    
    const btnAnalisar = document.getElementById('btnAnalisar');
    if (btnAnalisar) {
        btnAnalisar.addEventListener('click', calculateFront);
    } else {
        console.error('ERRO CRITICO: Botão "btnAnalisar" não encontrado.');
    }
    
    const btnClear = document.getElementById('btnClear');
    if (btnClear) {
        btnClear.addEventListener('click', clearForm);
    } else {
        console.error('ERRO CRITICO: Botão "btnClear" não encontrado.');
    }
});