
// Acervo de stopwords
const stopwords = new Set([
    'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 
    'uma', 'os', 'no', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 
    'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 
    'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 
    'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 
    'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 
    'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 
    'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 
    'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'lhes', 'meus', 'minhas', 
    'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas'
])


// Normalização
export function createSetWord(text, removeStopwords = false, useStemming = false){
    // Normalização básica
    const textNormalized = text.toLowerCase();
    
    // Regex que PRESERVA acentos e 'ç' para o Stemmer
    const textCleam = textNormalized.replace(/[^a-z\sçáéíóúâêôãõü]/g, ' ');

    const allWords = textCleam.split(/\s+/).filter(word => word.length > 0);

    let filteredWords;

    // Filtro de Stopwords
    if (removeStopwords) {
        filteredWords = allWords.filter(word => !stopwords.has(word));
    } else {
        filteredWords = allWords;
    }
    
    let finalWords;

    // Filtro de Stemming
    if (useStemming) {
        finalWords = filteredWords.map(word => RSLP.stem(word));
    } else {
        finalWords = filteredWords;
    }
    
    // Limpeza final para garantir que o stemmer não criou strings vazias
    const finalSet = new Set(finalWords);
    finalSet.delete(""); // Remove ""
    
    return finalSet;
}

// Cálculo
export function calculateIntersectionUnion(setA, setB){
    let intersection = 0;
    const [smallerSet, biggestSet] = setA.size < setB.size ? [setA, setB] : [setB, setA];
    for(const word of smallerSet){
        if(biggestSet.has(word)){
            intersection++;
        }
    }
    const union = setA.size + setB.size - intersection;
    return {intersection, union};
}

// Devolve um conjunto com as palavras da Intersecção
export function getIntersectionSet(setA, setB){
    const intersection = new Set();
    const [smallerSet, biggestSet] = setA.size < setB.size ? [setA, setB] : [setB, setA];
    for(const word of smallerSet){
        if(biggestSet.has(word)){
            intersection.add(word);
        }
    }
    return intersection;
}

// Devolve um conjunto com as palavras da União
export function getUnionSet(setA, setB){
    const union = new Set(setA);
    for(const word of setB){
        union.add(word);
    }
    return union;
}

// Jaccard -> Similaridade
export function calculateSimilarityJaccard(docX, docY){
    const setX = createSetWord(docX);
    const setY = createSetWord(docY);
    const {intersection, union} = calculateIntersectionUnion(setX, setY);
    if(union === 0){
        return 1.0;
    }
    const similarity = intersection / union;
    return similarity;
}

// Jaccard -> Distância
export function calculateDistanceJaccard(docX, docY){
    const similarity = calculateSimilarityJaccard(docX, docY);
    const distance = 1.0 - similarity;
    return distance;
}

// Similariade de Jaccard diretamente de dois Set
export function calculateJaccardFromSet(setA, setB){
    const intersectionSet = getIntersectionSet(setA, setB);
    const unionSet = getUnionSet(setA, setB);
    const intersectionCount = intersectionSet.size;
    const unionCount = unionSet.size;
    if(unionCount === 0){
        return 1.0;
    }
    return intersectionCount / unionCount;
}

// Stemmer (ALGORITMO RSLP)
const RSLP = {
    step1_suffixes: {
        'eza': 2, 'ezas': 3, 'ico': 3, 'ica': 3, 'icos': 4, 'icas': 4, 'ismo': 4,
        'ismos': 5, 'ista': 4, 'istas': 5, 'logia': 5, 'logias': 6, 'dade': 4,
        'dades': 5, 'ante': 4, 'antes': 5, 'ância': 5, 'âncias': 6, 'al': 2,
        'ais': 3, 'ável': 4, 'áveis': 5, 'ível': 4, 'íveis': 5, 'or': 2, 'ora': 3,
        'ores': 4, 'oras': 5, 'ador': 3, 'adora': 4, 'adores': 5, 'adoras': 6,
        'sor': 3, 'sora': 4, 'sores': 5, 'soras': 6, 'tor': 3, 'tora': 4, 'tores': 5,
        'toras': 6, 'dor': 3, 'dora': 4, 'dores': 5, 'doras': 6, 'ante': 4, 'antes': 5
    },
    step2_suffixes: {
        'ar': 2, 'er': 2, 'ir': 2, 'as': 2, 'es': 2, 'is': 2, 'os': 2, 'us': 2,
        'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1
    },
    exceptions: {
        'exceções': 'excec', 'corrupção': 'corrupt', 'precaução': 'precauc',
        'solução': 'soluc', 'eleição': 'eleic', 'gás': 'gas'
    },
    
    stem: function(word) {
        if (word.length < 3) return word;
        if (this.exceptions[word]) return this.exceptions[word];
        let r1 = this.getR1(word);
        if (r1 === -1) return word;
        let r2 = this.getR2(word, r1);
        let stemmedWord = word;
        
        let suffix = this.endsWithAny(stemmedWord, Object.keys(this.step1_suffixes));
        if (suffix) {
            let suffixLen = this.step1_suffixes[suffix];
            if (stemmedWord.length - suffixLen >= r1) {
                stemmedWord = stemmedWord.substring(0, stemmedWord.length - suffixLen);
            }
        }
        
        suffix = this.endsWithAny(stemmedWord, Object.keys(this.step2_suffixes));
        if (suffix) {
            let suffixLen = this.step2_suffixes[suffix];
            if (stemmedWord.length - suffixLen >= r1) {
                stemmedWord = stemmedWord.substring(0, stemmedWord.length - suffixLen);
            }
        }
        
        stemmedWord = this.removeAccents(stemmedWord);
        return stemmedWord;
    },
    
    endsWithAny: function(word, suffixes) {
        for (let i = 0; i < suffixes.length; i++) {
            if (word.endsWith(suffixes[i])) return suffixes[i];
        }
        return null;
    },
    
    isVowel: function(char) {
        return ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'ô', 'ã', 'õ'].includes(char);
    },
    
    getR1: function(word) {
        for (let i = 1; i < word.length; i++) {
            if (this.isVowel(word[i-1]) && !this.isVowel(word[i])) {
                return i + 1;
            }
        }
        return -1;
    },
    
    getR2: function(word, r1) {
        if (r1 === -1) return -1;
        for (let i = r1 + 1; i < word.length; i++) {
            if (this.isVowel(word[i-1]) && !this.isVowel(word[i])) {
                return i + 1;
            }
        }
        return -1;
    },
    
    removeAccents: function(word) {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
};