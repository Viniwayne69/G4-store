# G4 Store

Interface de e-commerce da G4 Store, construída a partir do mockup de referência:
azul-marinho, branco e dourado, com header e hero em navy e vitrine em fundo claro.

## Como abrir

Site estático, sem build e sem dependências. Basta abrir `index.html` no navegador.

Para servir localmente (recomendado):

```bash
python -m http.server 5173
# depois acesse http://localhost:5173
```

## Estrutura

```
.
├── index.html          Home: topbar, header, hero, vitrine, vantagens, categorias, manifesto, newsletter
├── produtos.html       Coleção com filtros (Vestuário / Acessórios) e busca
├── produto.html        Página de produto com seleção de tamanho (lê ?slug= da URL)
├── carrinho.html       Sacola com quantidades, frete grátis acima de R$ 299 e total
├── sobre.html          Institucional, Para times, FAQ e contato
└── assets
    ├── css/style.css   Design system completo (tokens, componentes, responsivo)
    ├── js/products.js  Catálogo de produtos
    ├── js/app.js       Carrinho, filtros, busca, tamanhos, menu mobile, animações
    └── img/            Hero e fotos de produto
```

## Design system

| Token | Hex | Uso |
|---|---|---|
| Navy 900 | `#071527` | Topbar e footer |
| Navy 800 | `#0B2137` | Header, hero e blocos escuros |
| Dourado | `#C2A15F` | Acentos, eyebrows, botões e badge da sacola |
| Branco | `#FFFFFF` | Fundo do site e dos cards |
| Cinza-claro | `#F2F2F3` | Fundo das fotos de produto |
| Ink | `#0E2136` | Texto e preços sobre fundo claro |

- **Serif:** Playfair Display — títulos (`Para quem quer mais.`).
- **Sans:** Inter — corpo, navegação e rótulos em caixa alta com tracking.
- **Botões:** dourado sólido, caixa alta, tracking largo (`VER COLEÇÃO`).

## Catálogo

| Produto | Categoria | Preço | Parcelamento |
|---|---|---|---|
| Camiseta G4 Classic | Vestuário | R$ 159,90 | 3x de R$ 53,30 sem juros |
| Moletom G4 Essential | Vestuário | R$ 289,90 | 6x de R$ 48,32 sem juros |
| Boné G4 Signature | Acessórios | R$ 129,90 | 2x de R$ 64,95 sem juros |
| Garrafa Térmica G4 | Acessórios | R$ 189,90 | 3x de R$ 63,30 sem juros |

## Funcionalidades

- Carrinho persistente em `localStorage`, com badge no header e página de sacola.
- Frete grátis aplicado automaticamente acima de R$ 299.
- Catálogo renderizado por JS, com filtro por categoria e busca textual.
- Página de produto dinâmica via querystring e seleção de tamanho.
- Busca do header redireciona para a coleção já filtrada.
- Menu mobile, animações de entrada e toast de feedback.
- Layout responsivo em quatro breakpoints (1240px, 1040px, 900px, 600px).

## Observações

- Conteúdo, preços e produtos são de demonstração para validação de interface.
- As imagens foram geradas para este projeto e não representam produtos reais.
- O checkout é apenas indicativo: não há integração de pagamento.
