import { createSetWord, calculateIntersectionUnion } from "../similarityJaccard.config.js";

// import readline from 'readline';

// // Configurar a interface de leitura  e escrita do terminal
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// // Jaccard -> Similaridade
// export function calculateSimilarityJaccard(documentX, documentY){
//     const setX = createSetWord(documentX);
//     const setY = createSetWord(documentY);

//     const {intersection, union} = calculateIntersectionUnion(setX, setY);

//     if(union === 0){
//         return 1.0;
//     }

//     const similarity = intersection / union;
//     return similarity;
// }

// // Jaccard -> Distância
// export function calculateDistanceJaccard(documentX, documentY){
    
//     const similarity = calculateSimilarityJaccard(documentX, documentY);
//     const distance = 1.0 - similarity;

//     return distance;
// }

// // Leitura
// function startCalculate(){
//     let docA = '';
//     let docB = '';

//     // Pede o documento/texto 1
//     rl.question("\nEntre com o documento/texto A:", (answerA) => {
//         docA = answerA;

//         // Pede documento/texto 2
//         rl.question("Entre com o documento/texto B:", (answerB) => {
//             docB = answerB;

//             // Encerra a leitura
//             rl.close();

//             // Valida os documentos
//             if(!docA || !docB){
//                 console.log("\n[ERRO] Ambos os campos devem ser preeenchidos.");
//                 return;
//             }

//             console.log("\n=== Resultados ===");

//             // Similaridade
//             const similarityFloat = calculateSimilarityJaccard(docA, docB);
//             const simarityPercentage = (similarityFloat * 100).toFixed(2);

//             // Distância
//             const distanceFloat = calculateDistanceJaccard(docA, docB);
//             const distantePercentage = (distanceFloat * 100).toFixed(2);

//             console.log(`\nSimilaridade: ${simarityPercentage}%`);
//             console.log(`Distância: ${distantePercentage}%`);
//         });
//     });
// }

// // Roda o sistema
// startCalculate();
