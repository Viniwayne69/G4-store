# G4 Store

Interface de e-commerce da G4 Store, construída a partir do mockup de direção visual
aprovado: estética de luxo executivo — navy profundo, dourado como assinatura de
autoridade, títulos serif editoriais e UI sans em caixa alta.

## Como abrir

Site estático, sem build e sem dependências. Basta abrir `index.html` no navegador.

Para servir localmente (recomendado, evita restrições de `file://`):

```bash
python -m http.server 5173
# depois acesse http://localhost:5173
```

## Estrutura

```
.
├── index.html          Home: hero, categorias, vitrine, manifesto, newsletter
├── produtos.html       Catálogo com filtros por categoria e busca
├── produto.html        Página de produto (lê ?slug= da URL)
├── carrinho.html       Sacola com quantidades e subtotal
├── sobre.html          Institucional, para empresas, FAQ e contato
└── assets
    ├── css/style.css   Design system completo (tokens, componentes, responsivo)
    ├── js/products.js  Catálogo de produtos
    ├── js/app.js       Carrinho, filtros, busca, menu mobile, animações
    └── img/            Hero e imagens de produto
```

## Design system

| Token | Hex | Uso |
|---|---|---|
| Navy 900 | `#050C17` | Fundo primário, header, hero |
| Navy 800 | `#081221` | Fundo de seção |
| Navy 700 | `#0B1729` | Superfície de cards |
| Gold | `#C09658` | Acentos, eyebrows, preços, ícones |
| Bronze | `#A67C4E` | Botões sólidos |
| Ivory | `#F5F2EC` | Texto claro alternativo |

- **Serif:** Playfair Display — títulos e números de destaque.
- **Sans:** Inter — corpo, navegação e rótulos em caixa alta com tracking.
- **Botões:** bronze sólido, caixa alta, seta `→`; variação ghost com borda.

## Funcionalidades

- Carrinho persistente em `localStorage`, com contador no header e página de sacola.
- Catálogo renderizado por JS, com filtro por categoria e busca textual.
- Página de produto dinâmica via querystring (`produto.html?slug=caderno-do-lider`).
- Busca do header redireciona para o catálogo já filtrado.
- Menu mobile, animações de entrada e toast de feedback.
- Layout responsivo em três breakpoints (1180px, 900px, 620px).

## Observações

- Conteúdo, preços e produtos são de demonstração para validação de interface.
- As imagens foram geradas para este projeto e não representam produtos reais.
- O checkout é apenas indicativo: não há integração de pagamento.
