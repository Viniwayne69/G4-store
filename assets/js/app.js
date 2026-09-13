/**
 * G4 Store — comportamento do front-end.
 * Sem dependências externas: carrinho em localStorage, catálogo, filtros,
 * menu mobile acessível, animações de entrada e feedback de ações.
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var STORAGE_KEY = "g4store.cart.v1";
  var FREE_SHIPPING = 299;
  var SHIPPING_COST = 29.9;
  var products = window.G4_PRODUCTS || [];

  /* ----------------------------------------------------------- Helpers --- */

  function money(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function bySlug(slug) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].slug === slug) return products[i];
    }
    return null;
  }

  function readCart() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function writeCart(cart) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      /* modo privado: segue sem persistir */
    }
    paintCartCount(true);
  }

  function paintCartCount(pulse) {
    var total = readCart().reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
    var nodes = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(total);
      if (pulse) {
        nodes[i].classList.remove("is-pulse");
        /* força o reinício da animação */
        void nodes[i].offsetWidth;
        nodes[i].classList.add("is-pulse");
      }
    }
  }

  function addToCart(slug) {
    var product = bySlug(slug);
    if (!product) return;

    var cart = readCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].slug === slug) {
        cart[i].qty += 1;
        found = true;
        break;
      }
    }
    if (!found) cart.push({ slug: slug, qty: 1 });

    writeCart(cart);
    toast(product.name + " adicionado à sacola");
  }

  function setQty(slug, qty) {
    var cart = readCart().filter(function (item) {
      return item.slug !== slug || qty > 0;
    });
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].slug === slug) cart[i].qty = qty;
    }
    writeCart(cart);
  }

  var toastTimer = null;

  function toast(message) {
    var node = document.querySelector("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      node.classList.remove("is-visible");
    }, 2600);
  }

  /** Faz as fotos aparecerem só depois de carregadas, evitando o "pop". */
  function hydrateImages(scope) {
    var imgs = (scope || document).querySelectorAll("img:not(.is-loaded)");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add("is-loaded");
        } else {
          img.addEventListener(
            "load",
            function () {
              img.classList.add("is-loaded");
            },
            { once: true }
          );
          img.addEventListener(
            "error",
            function () {
              img.classList.add("is-loaded");
            },
            { once: true }
          );
        }
      })(imgs[i]);
    }
  }

  /* -------------------------------------------------------- Templates --- */

  var plusIcon =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  function pictureTemplate(product, sizes, eager) {
    return (
      "<picture>" +
      '<source type="image/webp" srcset="' +
      product.webp +
      '">' +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" width="900" height="900" sizes="' +
      sizes +
      '" ' +
      (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"') +
      ">" +
      "</picture>"
    );
  }

  function cardTemplate(product, index) {
    return (
      '<article class="card reveal" style="--i:' +
      (index % 4) +
      '">' +
      /* a foto repete o destino do título: fica fora da ordem de tabulação */
      '<a class="card__media" href="produto.html?slug=' +
      product.slug +
      '" tabindex="-1" aria-hidden="true">' +
      (product.tag ? '<span class="card__tag">' + product.tag + "</span>" : "") +
      pictureTemplate(product, "(max-width: 600px) 92vw, (max-width: 1040px) 44vw, 300px") +
      "</a>" +
      '<div class="card__body">' +
      '<div class="card__info">' +
      '<h3><a href="produto.html?slug=' +
      product.slug +
      '">' +
      product.name +
      "</a></h3>" +
      '<div class="price">' +
      money(product.price) +
      "</div>" +
      '<div class="installments">' +
      product.installments +
      "</div>" +
      "</div>" +
      '<button class="icon-btn" type="button" data-add="' +
      product.slug +
      '" aria-label="Adicionar ' +
      product.name +
      ' à sacola">' +
      plusIcon +
      "</button>" +
      "</div>" +
      "</article>"
    );
  }

  function renderGrid(target, list) {
    if (!list.length) {
      target.innerHTML =
        '<p class="empty">Nenhum produto encontrado para esta busca</p>';
      return;
    }
    target.innerHTML = list.map(cardTemplate).join("");
    hydrateImages(target);
    observeReveals();
  }

  /* ------------------------------------------------------------ Views --- */

  function initHomeShowcase() {
    var target = document.querySelector("[data-showcase]");
    if (!target) return;
    /* a home já vem renderizada no HTML: aqui só hidratamos */
    if (target.getAttribute("data-static") === "1") {
      hydrateImages(target);
      return;
    }
    renderGrid(target, products.slice(0, 4));
  }

  function initCatalog() {
    var target = document.querySelector("[data-catalog]");
    if (!target) return;

    var chips = document.querySelectorAll("[data-filter]");
    var searchInput = document.querySelector("[data-search]");
    var counter = document.querySelector("[data-count]");
    var active = "todos";

    function apply() {
      var term = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      var list = products.filter(function (product) {
        var matchCategory = active === "todos" || product.category === active;
        var matchTerm =
          !term ||
          product.name.toLowerCase().indexOf(term) > -1 ||
          product.short.toLowerCase().indexOf(term) > -1 ||
          product.categoryLabel.toLowerCase().indexOf(term) > -1;
        return matchCategory && matchTerm;
      });
      renderGrid(target, list);
      if (counter) {
        counter.textContent =
          list.length === 1 ? "1 produto" : list.length + " produtos";
      }
    }

    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", function (event) {
        active = event.currentTarget.getAttribute("data-filter");
        for (var j = 0; j < chips.length; j++) {
          var isOn = chips[j] === event.currentTarget;
          chips[j].classList.toggle("is-active", isOn);
          chips[j].setAttribute("aria-pressed", isOn ? "true" : "false");
        }
        apply();
      });
    }

    if (searchInput) searchInput.addEventListener("input", apply);

    /* pré-seleciona a categoria vinda do menu */
    var q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      var normalized = q.toLowerCase();
      var map = { vestuário: "vestuario", acessórios: "acessorios" };
      if (map[normalized]) {
        active = map[normalized];
        for (var k = 0; k < chips.length; k++) {
          var on = chips[k].getAttribute("data-filter") === active;
          chips[k].classList.toggle("is-active", on);
          chips[k].setAttribute("aria-pressed", on ? "true" : "false");
        }
        if (searchInput) searchInput.value = "";
      }
    }

    apply();
  }

  function initProductPage() {
    var root = document.querySelector("[data-product-page]");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var product = bySlug(params.get("slug")) || products[0];

    document.title = product.name + " — G4 Store";

    var sizes = (product.sizes || [])
      .map(function (size, index) {
        return (
          '<button class="size' +
          (index === 0 ? " is-active" : "") +
          '" type="button" data-size aria-pressed="' +
          (index === 0 ? "true" : "false") +
          '">' +
          size +
          "</button>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="pdp__media">' +
      pictureTemplate(product, "(max-width: 1040px) 92vw, 620px", true) +
      "</div>" +
      "<div>" +
      '<span class="eyebrow">' +
      product.categoryLabel +
      "</span>" +
      "<h1>" +
      product.name +
      "</h1>" +
      '<p class="pdp__lead">' +
      product.description +
      "</p>" +
      '<div class="pdp__price"><strong>' +
      money(product.price) +
      "</strong><span>" +
      product.installments +
      " · Frete calculado no checkout</span></div>" +
      (sizes
        ? '<p class="size-label">Tamanho</p><div class="sizes">' + sizes + "</div>"
        : "") +
      '<button class="btn btn--block" type="button" data-add="' +
      product.slug +
      '">Adicionar à sacola</button>' +
      '<ul class="pdp__list">' +
      product.highlights
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("") +
      "</ul>" +
      "</div>";

    hydrateImages(root);

    root.addEventListener("click", function (event) {
      var size = event.target.closest("[data-size]");
      if (!size) return;
      var all = root.querySelectorAll("[data-size]");
      for (var i = 0; i < all.length; i++) {
        var on = all[i] === size;
        all[i].classList.toggle("is-active", on);
        all[i].setAttribute("aria-pressed", on ? "true" : "false");
      }
    });

    var crumb = document.querySelector("[data-crumb]");
    if (crumb) crumb.textContent = product.name;

    var related = document.querySelector("[data-related]");
    if (related) {
      renderGrid(
        related,
        products
          .filter(function (item) {
            return item.category === product.category && item.slug !== product.slug;
          })
          .slice(0, 3)
      );
    }
  }

  function initCartPage() {
    var root = document.querySelector("[data-cart-page]");
    if (!root) return;

    function paint() {
      var cart = readCart();

      if (!cart.length) {
        root.innerHTML =
          '<div class="empty-state">' +
          '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="1.4" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/>' +
          '<path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
          "<h3>Sua sacola está vazia</h3>" +
          "<p>Escolha uma peça da coleção para começar</p>" +
          '<a class="btn" href="produtos.html">Ver coleção</a>' +
          "</div>";
        return;
      }

      var subtotal = 0;
      var rows = cart
        .map(function (item) {
          var product = bySlug(item.slug);
          if (!product) return "";
          var line = product.price * item.qty;
          subtotal += line;
          return (
            '<li class="cart-row">' +
            '<img class="cart-row__img" src="' +
            product.image +
            '" alt="" width="900" height="900" loading="lazy">' +
            '<div class="cart-row__info">' +
            "<strong>" +
            product.name +
            "</strong>" +
            '<span class="cart-row__meta">' +
            product.categoryLabel +
            "</span>" +
            '<span class="cart-row__unit">' +
            money(product.price) +
            " a unidade</span>" +
            "</div>" +
            '<div class="cart-row__qty"><span class="qty">' +
            '<button type="button" data-dec="' +
            product.slug +
            '" aria-label="Diminuir quantidade de ' +
            product.name +
            '">&minus;</button>' +
            '<span aria-live="polite">' +
            item.qty +
            "</span>" +
            '<button type="button" data-inc="' +
            product.slug +
            '" aria-label="Aumentar quantidade de ' +
            product.name +
            '">+</button>' +
            "</span></div>" +
            '<div class="cart-row__total">' +
            money(line) +
            "</div>" +
            '<button class="cart-row__remove" type="button" data-remove="' +
            product.slug +
            '" aria-label="Remover ' +
            product.name +
            ' da sacola">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
            '<path d="M6 6l12 12M18 6 6 18"/></svg>' +
            "</button>" +
            "</li>"
          );
        })
        .join("");

      var free = subtotal >= FREE_SHIPPING;
      var total = free ? subtotal : subtotal + SHIPPING_COST;
      var missing = FREE_SHIPPING - subtotal;

      root.innerHTML =
        '<ul class="cart-list">' +
        rows +
        "</ul>" +
        '<div class="cart-summary">' +
        '<div class="cart-summary__row"><span>Subtotal</span><span>' +
        money(subtotal) +
        "</span></div>" +
        '<div class="cart-summary__row"><span>Frete</span><span>' +
        (free ? "Grátis" : money(SHIPPING_COST)) +
        "</span></div>" +
        (free
          ? ""
          : '<p class="cart-hint">Faltam ' +
            money(missing) +
            " para o frete grátis</p>") +
        '<div class="cart-summary__total"><span>Total</span><strong>' +
        money(total) +
        "</strong></div>" +
        '<button class="btn btn--block" type="button" data-checkout>Finalizar compra</button>' +
        "</div>";

      hydrateImages(root);
    }

    root.addEventListener("click", function (event) {
      var inc = event.target.closest("[data-inc]");
      var dec = event.target.closest("[data-dec]");
      var remove = event.target.closest("[data-remove]");
      var checkout = event.target.closest("[data-checkout]");
      var cart = readCart();

      function qtyOf(slug) {
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].slug === slug) return cart[i].qty;
        }
        return 0;
      }

      if (inc) {
        var slugInc = inc.getAttribute("data-inc");
        setQty(slugInc, qtyOf(slugInc) + 1);
        paint();
      } else if (dec) {
        var slugDec = dec.getAttribute("data-dec");
        setQty(slugDec, Math.max(0, qtyOf(slugDec) - 1));
        paint();
      } else if (remove) {
        setQty(remove.getAttribute("data-remove"), 0);
        paint();
      } else if (checkout) {
        toast("Checkout de demonstração: integração de pagamento pendente");
      }
    });

    paint();
  }

  /* ------------------------------------------------------- Interações --- */

  function initGlobalClicks() {
    document.addEventListener("click", function (event) {
      var addBtn = event.target.closest("[data-add]");
      if (!addBtn) return;
      event.preventDefault();
      addToCart(addBtn.getAttribute("data-add"));
      addBtn.classList.add("is-added");
      window.setTimeout(function () {
        addBtn.classList.remove("is-added");
      }, 1200);
    });
  }

  function initBurger() {
    var burger = document.querySelector("[data-burger]");
    var nav = document.querySelector("[data-nav]");
    if (!burger || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    }

    burger.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  function initHeaderSearch() {
    var forms = document.querySelectorAll("[data-header-search]");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", function (event) {
        event.preventDefault();
        var value = event.currentTarget.querySelector("input").value.trim();
        window.location.href =
          "produtos.html" + (value ? "?q=" + encodeURIComponent(value) : "");
      });
    }
  }

  function initNewsletter() {
    var form = document.querySelector("[data-newsletter]");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var msg = document.querySelector("[data-newsletter-msg]");
      if (msg) {
        msg.textContent =
          "Inscrição registrada, você receberá as novidades do G4 Store";
      }
      form.reset();
    });
  }

  /** Marca no menu o item correspondente à página/filtro atual. */
  function initActiveNav() {
    var links = document.querySelectorAll(".nav a");
    var path = window.location.pathname.split("/").pop() || "index.html";
    var query = new URLSearchParams(window.location.search).get("q");

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      var parts = href.split("?");
      var target = parts[0];
      var targetQuery = parts[1]
        ? new URLSearchParams(parts[1]).get("q")
        : null;

      var samePage = target === path;
      var sameFilter = (targetQuery || null) === (query || null);

      if (samePage && sameFilter) {
        links[i].setAttribute("aria-current", "page");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  var observer = null;

  function observeReveals() {
    var nodes = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-visible");
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
    }
    for (var j = 0; j < nodes.length; j++) {
      /* cascata: usa a posição do elemento entre os irmãos reveláveis */
      if (!nodes[j].style.getPropertyValue("--i")) {
        var siblings = nodes[j].parentNode
          ? nodes[j].parentNode.querySelectorAll(".reveal")
          : [];
        for (var k = 0; k < siblings.length; k++) {
          if (siblings[k] === nodes[j]) {
            nodes[j].style.setProperty("--i", String(k));
            break;
          }
        }
      }
      observer.observe(nodes[j]);
    }
  }

  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  /* ------------------------------------------------------------- Boot --- */

  document.addEventListener("DOMContentLoaded", function () {
    paintCartCount(false);
    initGlobalClicks();
    initBurger();
    initHeaderSearch();
    initNewsletter();
    initActiveNav();
    initHomeShowcase();
    initCatalog();
    initProductPage();
    initCartPage();
    initYear();
    hydrateImages(document);
    observeReveals();
  });
})();
