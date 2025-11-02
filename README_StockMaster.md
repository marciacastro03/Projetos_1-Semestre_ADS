# 🧠 StockMaster: Gerenciador de Estoque de E-commerce 
Projeto do 1ª semestre de ADS - 2025.2 (Unifor) do professor Daniel Jaguaribe

## 📦 Sobre o Projeto
**StockMaster** é um sistema de **gerenciamento de estoque (Inventory Management System)** desenvolvido para o **backend** de uma loja de e-commerce.  
O objetivo é **controlar o catálogo de produtos e suas quantidades**, permitindo ao administrador realizar operações como cadastro, listagem e movimentação de estoque.

> ⚠️ Este sistema **não é uma vitrine (storefront)** voltada ao cliente final.  
> Ele é uma **ferramenta interna** usada pelo administrador para manter o estoque atualizado e organizado.

---

## 👥 Autores
- **Paulo**  
- **Marcia**  
- **Miguel**

---

## 🧩 Estrutura de Dados
O núcleo do sistema é construído sobre **quatro arrays paralelos**.  
O produto no índice `i` do array `produtos` tem seus dados correspondentes nos mesmos índices dos arrays `codigos`, `precos` e `estoque`.

| Array | Tipo de Dados | Descrição |
|:------|:---------------|:-----------|
| `produtos` | `Array<String>` | Armazena os **nomes dos produtos**. |
| `codigos` | `Array<String>` | Armazena o **SKU ou código de barras** (identificador único). |
| `precos` | `Array<Number>` | Armazena o **preço** de cada produto. |
| `estoque` | `Array<Number>` | Armazena a **quantidade disponível** em estoque. |

Exemplo simplificado em JavaScript:

```js
const produtos = ["Camiseta", "Tênis", "Relógio"];
const codigos = ["SKU001", "SKU002", "SKU003"];
const precos = [59.90, 199.00, 349.99];
const estoque = [20, 15, 8];
