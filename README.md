# 📊 Detector de Similaridade (Índice de Jaccard)

Este é um projeto acadêmico que implementa uma ferramenta web para calcular a **Similaridade de Jaccard** e a **Distância de Jaccard** entre dois documentos de texto.

A aplicação foi desenvolvida para a disciplina de Matemática para Computação e demonstra conceitos de Processamento de Linguagem Natural (PLN), normalização de conteúdo e desenvolvimento web com HTML, CSS e JavaScript (Módulos e API FileReader).

---

## 🚀 Aplicação

Acesse a ferramenta funcional diretamente no seu navegador através do link abaixo:

> **Link da Aplicação:** **[https://SEU-USUARIO.github.io/SEU-REPOSITORIO/front/](https://nickdsm24.github.io/Similaridade-de-Jaccard/)**

---

## ✨ Funcionalidades

* **Entrada Dupla:** Compare documentos de duas formas:
    * Colando o texto diretamente.
    * Fazendo o upload de arquivos `.txt`.
* **Cálculo Detalhado:** Exibe o percentual de Similaridade (J) e Distância (1 - J).
* **Análise da Fórmula:** Mostra os valores brutos de Intersecção (A ∩ B) e União (A ∪ B).
* **Limpar Formulário:** Um botão de "Limpar" para resetar toda a interface.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica.
* **CSS3:** Design responsivo em *dark mode* (utilizando Flexbox e Variáveis CSS).
* **JavaScript (ES6+):**
    * Manipulação do DOM.
    * Módulos JavaScript (`import`/`export`).
    * API `FileReader` para leitura de arquivos `.txt` no lado do cliente.

## 🏃‍♂️ Como Executar Localmente

Este projeto **não funciona** ao abrir o `index.html` diretamente (via `file:///`) devido ao uso de Módulos JavaScript.

Para executar localmente, você **precisa** de um servidor. A forma mais simples é:

1.  Ter o [VSCode](https://code.visualstudio.com/) com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2.  Abrir a pasta **raiz** do projeto no VSCode.
3.  Clicar com o botão direito no arquivo `front/index.html`.
4.  Selecionar **"Open with Live Server"** ou **Show Preview**.