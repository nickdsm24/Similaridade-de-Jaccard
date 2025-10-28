
import { 
    createSetWord,
    getIntersectionSet,
    getUnionSet
} from "./src/similarityJaccard.config.js";

// Objeto para armazenar o conteúdo dos arquivos lidos (ponte entre o 'change' e o 'click')
const uploadedFileContent = {
    docA: null,
    docB: null
};


// Lógica para "colar text0"/"upload"
// (Sem alteração)
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
    // Referências para os inputs e spans de nome
    const fileInputA = document.getElementById('fileA');
    const fileNameA = document.getElementById('fileA-name');
    const fileInputB = document.getElementById('fileB');
    const fileNameB = document.getElementById('fileB-name');

    /**
     * Função auxiliar para ler um arquivo de texto e armazenar seu conteúdo
     * @param {File} file - O arquivo do input
     * @param {'docA' | 'docB'} docKey - A chave para salvar o conteúdo em 'uploadedFileContent'
     * @param {HTMLElement} nameDisplay - O <span> para mostrar o nome do arquivo
     */
    const readFile = (file, docKey, nameDisplay) => {
        // 1. Validar tipo
        if (!file || file.type !== 'text/plain') {
            alert('Por favor, selecione um arquivo .txt válido.');
            nameDisplay.textContent = 'Nenhum arquivo selecionado.';
            uploadedFileContent[docKey] = null;
            return;
        }

        // Atualiza UI com o nome
        nameDisplay.textContent = `Arquivo: ${file.name}`;

        // lê e armazena conteúdo
        const reader = new FileReader();
        
        // Quando a leitura for concluída
        reader.onload = (e) => {
            uploadedFileContent[docKey] = e.target.result;
            console.log(`Conteúdo do ${docKey} carregado com sucesso.`);
        };
        
        // Em caso de erro
        reader.onerror = () => {
            alert('Erro ao ler o arquivo.');
            nameDisplay.textContent = 'Erro ao ler o arquivo.';
            uploadedFileContent[docKey] = null;
        };
        
        // Inicia a leitura
        reader.readAsText(file);
    };

    // Anexa os listeners de evento 'change'
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
    // Pega os elementos da saída (resultado)
    const resultDisplay = document.getElementById('result-display');
    const jaccardSimilarityEl = document.getElementById('jaccard-similarity'); 
    const jaccardDistanceEl = document.getElementById('jaccard-distance'); 
    const statusMessageEl = document.getElementById('status-message');
    const intersectionCountEl = document.getElementById('intersection-count');
    const unionCountEl = document.getElementById('union-count');
    const jaccardFormulaEl = document.getElementById('jaccard-formula');
    
    // Determina fonte de texto para A e B
    let docAText = "";
    let docBText = "";

    // Fonte do DocA
    if (document.querySelector('[data-tab="doc1-text"]').classList.contains('active')) {
        docAText = document.getElementById('docA').value; // Pega do textarea
    } else {
        docAText = uploadedFileContent.docA; // Pega do arquivo carregado
    }

    // Fonte do DocB
    if (document.querySelector('[data-tab="doc2-text"]').classList.contains('active')) {
        docBText = document.getElementById('docB').value; // Pega do textarea
    } else {
        docBText = uploadedFileContent.docB; // Pega do arquivo carregado
    }

    // Mostra o card de resultado
    resultDisplay.style.display = 'block'; 

    // Validação
    if (!docAText || !docBText) {
        statusMessageEl.textContent = 'Por favor, preencha ambos os documentos (via texto ou upload).';
        statusMessageEl.style.color = 'red';
        // Reseta valores
        jaccardSimilarityEl.textContent = '0.00%';
        jaccardDistanceEl.textContent = '0.00%'; 
        intersectionCountEl.textContent = 'Intersecção |A ∩ B|: 0';
        unionCountEl.textContent = 'União |A ∪ B|: 0';
        jaccardFormulaEl.textContent = 'Fórmula (J): 0 / 0';
        return;
    }

    // Processa os dados
    const setA = createSetWord(docAText);
    const setB = createSetWord(docBText);
    const intersectionSet = getIntersectionSet(setA, setB);
    const unionSet = getUnionSet(setA, setB);
    const intersectionCount = intersectionSet.size;
    const unionCount = unionSet.size;

    const similarityFloat = (unionCount === 0) ? 1.0 : intersectionCount / unionCount;
    const similarityPercentage = (similarityFloat * 100).toFixed(2);
    const distanceFloat = 1.0 - similarityFloat;
    const distancePercentage = (distanceFloat * 100).toFixed(2);

    // Atualiza a interface DOM
    jaccardSimilarityEl.textContent = `${similarityPercentage}%`;
    jaccardDistanceEl.textContent = `${distancePercentage}%`;
    statusMessageEl.textContent = 'Cálculo concluído.';
    statusMessageEl.style.color = '#b0b0b0'; 
    intersectionCountEl.textContent = `Intersecção |A ∩ B|: ${intersectionCount}`;
    unionCountEl.textContent = `União |A ∪ B|: ${unionCount}`;
    jaccardFormulaEl.textContent = `Fórmula (J): ${intersectionCount} / ${unionCount}`;
}

// Função de limpar
function clearForm() {
    // Limpa textareas
    document.getElementById('docA').value = '';
    document.getElementById('docB').value = '';

    // Limpa conteúdo de arquivos na memória
    uploadedFileContent.docA = null;
    uploadedFileContent.docB = null;

    // Reseta nomes de arquivos exibidos
    document.getElementById('fileA-name').textContent = 'Nenhum arquivo selecionado.';
    document.getElementById('fileB-name').textContent = 'Nenhum arquivo selecionado.';

    // Reseta os inputs de arquivo (para permitir re-upload do mesmo arquivo)
    document.getElementById('fileA').value = null;
    document.getElementById('fileB').value = null;

    // Esconde o card de resultado
    document.getElementById('result-display').style.display = 'none';

    // Reseta abas para "Colar Texto"
    // Doc1
    document.querySelector('[data-tab="doc1-text"]').classList.add('active');
    document.querySelector('[data-tab="doc1-upload"]').classList.remove('active');
    document.getElementById('doc1-text').classList.add('active');
    document.getElementById('doc1-upload').classList.remove('active');
    
    // Doc2
    document.querySelector('[data-tab="doc2-text"]').classList.add('active');
    document.querySelector('[data-tab="doc2-upload"]').classList.remove('active');
    document.getElementById('doc2-text').classList.add('active');
    document.getElementById('doc2-upload').classList.remove('active');
    
    console.log('Formulário limpo.');
}

// Escuta os eventos (cliques de btn)
document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica de clicar nas abas
    setupInputTabs();
    
    // Lógica de UPLOAD
    setupFileUploadListeners();
    
    // Listener para o btn "Analisar Documentos"
    const btnAnalisar = document.getElementById('btnAnalisar');
    if (btnAnalisar) {
        btnAnalisar.addEventListener('click', calculateFront);
    } else {
        console.error('ERRO CRITICO: Botão "btnAnalisar" não encontrado.');
    }
    
    // Listener para o btn "Limpar"
    const btnClear = document.getElementById('btnClear');
    if (btnClear) {
        btnClear.addEventListener('click', clearForm);
    } else {
        console.error('ERRO CRITICO: Botão "btnClear" não encontrado.');
    }
}); 