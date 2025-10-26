
// Normalização
export function createSetWord(text){
    // Converte para minúsculo
    const textNormalized = text.toLowerCase();
    // Retira pontuações;caracteres especiais, colocando espaço no lugar
    const textCleam = textNormalized.replace(/[^\w\s]/g, ' ');
    // Divide por espaçõs e remove palavras vazias
    const words = textCleam.split(/\s+/).filter(word => word.length > 0);
    return new Set(words);
}

// Cálculo
export function calculateIntersectionUnion(setA, setB){
    let intersection = 0;

    // Otimização: itera sobre o menor Set
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
    // Otimização: iterar sobre o menor
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
    // Começamos com todas as palavras de A
    const union = new Set(setA);
    
    for(const word of setB){
        // Coloca todas as palavras de B, duplicatas não entram
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
        // Caso ambos estejam vazios, se tornam idênticos (similaridade máxima)
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

    // Protege contra divisões por 0
    if(unionCount === 0){
        // Novamente, se ambos são vazios, são idênticos desta maneira
        return 1.0;
    }
    return intersectionCount / unionCount;
}