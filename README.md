# G4 Store

Interface de e-commerce do G4 Store, construída a partir do mockup de referência:
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
├── produtos.html       Coleção com filtros (Vestuário / Acessórios), busca e contador
├── produto.html        Página de produto com tamanhos e itens relacionados (lê ?slug=)
├── carrinho.html       Sacola com quantidades, frete grátis acima de R$ 299 e total
├── sobre.html          Institucional, Para times, FAQ e contato
├── 404.html            Página de erro
└── assets
    ├── css/style.css   Design system completo (tokens, componentes, animações, responsivo)
    ├── js/products.js  Catálogo de produtos
    ├── js/app.js       Carrinho, filtros, busca, tamanhos, menu acessível, animações
    └── img/            Hero (JPG + WebP) e produtos em PNG/WebP com fundo transparente
```

## Design system

| Token | Hex | Uso |
|---|---|---|
| Navy 900 | `#071527` | Topbar e footer |
| Navy 800 | `#0B2137` | Header, hero e blocos escuros |
| Dourado | `#C2A15F` | Acentos, eyebrows, botões e badge da sacola |
| Bronze | `#AC8B4C` | Hover de botões |
| Branco | `#FFFFFF` | Fundo do site e dos cards |
| Cinza-claro | `#F2F2F3` | Fundo das fotos de produto |
| Ink | `#0E2136` | Texto e preços sobre fundo claro |
| Muted | `#5C6875` | Texto secundário (contraste AA) |

- **Serif:** Playfair Display — títulos.
- **Sans:** Inter — corpo, navegação e rótulos em caixa alta com tracking.
- **Botões:** dourado sólido, caixa alta, tracking largo. **Inputs:** formato pill.

## Catálogo

| Produto | Categoria | Preço | Parcelamento |
|---|---|---|---|
| Camiseta G4 Classic | Vestuário | R$ 159,90 | 3x de R$ 53,30 |
| Moletom G4 Essential | Vestuário | R$ 289,90 | 6x de R$ 48,32 |
| Boné G4 Signature | Acessórios | R$ 129,90 | 2x de R$ 64,95 |
| Garrafa Térmica G4 | Acessórios | R$ 189,90 | 3x de R$ 63,30 |
| Camiseta G4 Off-White | Vestuário | R$ 159,90 | 3x de R$ 53,30 |
| Jaqueta G4 Corta-Vento | Vestuário | R$ 399,90 | 6x de R$ 66,65 |
| Calça Jogger G4 | Vestuário | R$ 279,90 | 6x de R$ 46,65 |
| Mochila G4 Executive | Acessórios | R$ 449,90 | 6x de R$ 74,98 |
| Caneca G4 | Acessórios | R$ 79,90 | 2x de R$ 39,95 |
| Kit Meias G4 | Acessórios | R$ 89,90 | 2x de R$ 44,95 |

## Funcionalidades

- Carrinho persistente em `localStorage`, badge com `aria-live` e animação ao adicionar.
- Frete grátis automático acima de R$ 299, com aviso de quanto falta.
- Catálogo com filtro por categoria, busca textual e contador de resultados.
- Página de produto dinâmica, seleção de tamanho e relacionados da mesma categoria.
- Vitrine da home renderizada no HTML: funciona sem JavaScript e é indexável.
- Menu mobile que fecha no `Esc`, devolve o foco e move o foco ao abrir.
- Skeletons durante o carregamento das listas e das páginas de produto.

## Animações

| Elemento | Movimento | Duração |
|---|---|---|
| Topbar e header | Descem com fade | 0,55s |
| Foto do hero | Zoom-out de 109% para 100% | 1,5s |
| Texto do hero | Cascata: eyebrow, título, parágrafo, botão | 0,18s → 0,58s |
| Traço do eyebrow | Desenha da esquerda | 0,7s |
| Cards e blocos | Sobem em cascata ao entrar na tela | 80ms entre itens |
| Fotos | Fade-in ao terminar o download | 0,7s |

Todas desativadas automaticamente com `prefers-reduced-motion: reduce`.

## Performance e acessibilidade

- Imagens em WebP com fallback JPG/PNG via `<picture>`; hero com duas larguras.
- `width`/`height` em todas as imagens para evitar salto de layout (CLS).
- Fotos de produto com fundo transparente, recortadas por flood fill a partir das bordas.
- Foco visível (`:focus-visible`) em todos os elementos interativos.
- Contraste de texto secundário acima de 4,5:1.
- `aria-pressed` nos filtros e nos tamanhos; `aria-current` no menu ativo.

## Observações

- Conteúdo, preços e produtos são de demonstração para validação de interface.
- As imagens foram geradas para este projeto e não representam produtos reais.
- O checkout é apenas indicativo: não há integração de pagamento.
