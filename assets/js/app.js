/**
 * G4 Store — comportamento do front-end.
 * Sem dependências externas: carrinho em localStorage, catálogo, filtros,
 * menu mobile, newsletter e animação de entrada.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "g4store.cart.v1";
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
    paintCartCount();
  }

  function paintCartCount() {
    var total = readCart().reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
    var nodes = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(total);
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
    toast(product.name + " adicionado à sacola.");
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

  /* -------------------------------------------------------- Templates --- */

  var plusIcon =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  function cardTemplate(product) {
    return (
      '<article class="card reveal">' +
      '<a class="card__media" href="produto.html?slug=' +
      product.slug +
      '" aria-label="' +
      product.name +
      '">' +
      (product.tag ? '<span class="card__tag">' + product.tag + "</span>" : "") +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" loading="lazy">' +
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
        '<p class="empty">Nenhum produto encontrado para esta busca.</p>';
      return;
    }
    target.innerHTML = list.map(cardTemplate).join("");
    observeReveals();
  }

  /* ------------------------------------------------------------ Views --- */

  function initHomeShowcase() {
    var target = document.querySelector("[data-showcase]");
    if (!target) return;
    renderGrid(target, products.slice(0, 4));
  }

  function initCatalog() {
    var target = document.querySelector("[data-catalog]");
    if (!target) return;

    var chips = document.querySelectorAll("[data-filter]");
    var searchInput = document.querySelector("[data-search]");
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
    }

    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", function (event) {
        active = event.currentTarget.getAttribute("data-filter");
        for (var j = 0; j < chips.length; j++) {
          chips[j].classList.toggle("is-active", chips[j] === event.currentTarget);
        }
        apply();
      });
    }

    if (searchInput) searchInput.addEventListener("input", apply);
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
          '" type="button" data-size>' +
          size +
          "</button>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="pdp__media"><img src="' +
      product.image +
      '" alt="' +
      product.name +
      '"></div>' +
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

    root.addEventListener("click", function (event) {
      var size = event.target.closest("[data-size]");
      if (!size) return;
      var all = root.querySelectorAll("[data-size]");
      for (var i = 0; i < all.length; i++) {
        all[i].classList.toggle("is-active", all[i] === size);
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
            return item.slug !== product.slug;
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
          '<p class="empty">Sua sacola está vazia. ' +
          '<a class="link-arrow" href="produtos.html">Ver produtos &rarr;</a></p>';
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
            "<tr>" +
            '<td><div class="cart-item">' +
            '<img src="' +
            product.image +
            '" alt="' +
            product.name +
            '">' +
            "<div><strong>" +
            product.name +
            "</strong><br><span>" +
            product.categoryLabel +
            "</span></div></div></td>" +
            "<td>" +
            money(product.price) +
            "</td>" +
            '<td><span class="qty">' +
            '<button type="button" data-dec="' +
            product.slug +
            '" aria-label="Diminuir quantidade">&minus;</button>' +
            "<span>" +
            item.qty +
            "</span>" +
            '<button type="button" data-inc="' +
            product.slug +
            '" aria-label="Aumentar quantidade">+</button>' +
            "</span></td>" +
            "<td><strong>" +
            money(line) +
            "</strong></td>" +
            '<td style="text-align:right"><button class="cart-remove" type="button" data-remove="' +
            product.slug +
            '">Remover</button></td>' +
            "</tr>"
          );
        })
        .join("");

      var frete = subtotal >= 299 ? "Grátis" : money(29.9);
      var total = subtotal >= 299 ? subtotal : subtotal + 29.9;

      root.innerHTML =
        '<table class="cart-table"><thead><tr>' +
        "<th>Produto</th><th>Preço</th><th>Qtd.</th><th>Total</th><th></th>" +
        "</tr></thead><tbody>" +
        rows +
        "</tbody></table>" +
        '<div class="cart-summary">' +
        '<div class="cart-summary__row"><span>Subtotal</span><span>' +
        money(subtotal) +
        "</span></div>" +
        '<div class="cart-summary__row"><span>Frete</span><span>' +
        frete +
        "</span></div>" +
        '<div class="cart-summary__total"><span>Total</span><strong>' +
        money(total) +
        "</strong></div>" +
        '<button class="btn btn--block" type="button" data-checkout>Finalizar compra</button>' +
        "</div>";
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
        toast("Checkout de demonstração: integração de pagamento pendente.");
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
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
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
          "Inscrição registrada. Você receberá as novidades da G4 Store.";
      }
      form.reset();
    });
  }

  function prefillCatalogSearch() {
    var input = document.querySelector("[data-search]");
    if (!input) return;
    var q = new URLSearchParams(window.location.search).get("q");
    if (q) input.value = q;
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
        { threshold: 0.1 }
      );
    }
    for (var j = 0; j < nodes.length; j++) observer.observe(nodes[j]);
  }

  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  /* ------------------------------------------------------------- Boot --- */

  document.addEventListener("DOMContentLoaded", function () {
    paintCartCount();
    initGlobalClicks();
    initBurger();
    initHeaderSearch();
    initNewsletter();
    prefillCatalogSearch();
    initHomeShowcase();
    initCatalog();
    initProductPage();
    initCartPage();
    initYear();
    observeReveals();
  });
})();
