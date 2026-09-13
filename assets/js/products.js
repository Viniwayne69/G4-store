/**
 * Catálogo da G4 Store.
 * Mantido como arquivo JS (e não JSON) para que o site funcione também
 * ao ser aberto direto do disco, sem servidor local.
 */
window.G4_PRODUCTS = [
  {
    slug: "camiseta-g4-classic",
    name: "Camiseta G4 Classic",
    category: "vestuario",
    categoryLabel: "Vestuário",
    price: 159.9,
    installments: "3x de R$ 53,30 sem juros",
    tag: null,
    image: "assets/img/produto-camiseta.jpg",
    sizes: ["P", "M", "G", "GG"],
    short: "Camiseta em algodão penteado com aplicação G4 no peito.",
    description:
      "Malha de algodão penteado 30.1 com toque macio e caimento reto. Gola reforçada para manter o formato após as lavagens e aplicação discreta do monograma G4 no peito.",
    highlights: [
      "100% algodão penteado 30.1, 180 g/m²",
      "Gola com reforço em ribana",
      "Modelagem reta unissex",
      "Produção nacional"
    ]
  },
  {
    slug: "moletom-g4-essential",
    name: "Moletom G4 Essential",
    category: "vestuario",
    categoryLabel: "Vestuário",
    price: 289.9,
    installments: "6x de R$ 48,32 sem juros",
    tag: "Mais vendido",
    image: "assets/img/produto-moletom.jpg",
    sizes: ["P", "M", "G", "GG"],
    short: "Moletom com capuz e bolso canguru, felpado por dentro.",
    description:
      "Moletom flanelado com interior felpado, capuz forrado e bolso canguru. Punhos e barra em ribana para manter o corpo da peça. Monograma G4 bordado no centro do peito.",
    highlights: [
      "Moletom flanelado 320 g/m², interior felpado",
      "Capuz duplo com cordão em algodão",
      "Punhos e barra em ribana",
      "Bordado no centro do peito"
    ]
  },
  {
    slug: "bone-g4-signature",
    name: "Boné G4 Signature",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 129.9,
    installments: "2x de R$ 64,95 sem juros",
    tag: null,
    image: "assets/img/produto-bone.jpg",
    sizes: ["Único"],
    short: "Boné de aba curva em sarja com bordado dourado.",
    description:
      "Boné de seis gomos em sarja de algodão, aba curva estruturada e fechamento com fivela metálica. Bordado G4 em fio dourado no painel frontal.",
    highlights: [
      "Sarja de algodão com estrutura na frente",
      "Aba curva e seis gomos com ilhoses bordados",
      "Fechamento ajustável com fivela metálica",
      "Tamanho único"
    ]
  },
  {
    slug: "garrafa-termica-g4",
    name: "Garrafa Térmica G4",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 189.9,
    installments: "3x de R$ 63,30 sem juros",
    tag: null,
    image: "assets/img/produto-garrafa.jpg",
    sizes: ["500 ml"],
    short: "Garrafa em aço inox com pintura fosca e vedação total.",
    description:
      "Parede dupla a vácuo em aço inox, mantendo a bebida quente por até 12 horas e gelada por até 24. Acabamento fosco antiderrapante e tampa com vedação de silicone.",
    highlights: [
      "Aço inox 304 com parede dupla a vácuo",
      "12 h quente / 24 h gelado",
      "Capacidade de 500 ml",
      "Acabamento fosco antiderrapante"
    ]
  }
];
