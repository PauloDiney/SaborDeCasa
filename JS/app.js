document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".carousel_slide");
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? "block" : "none";
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // Inicializa o carrossel
    showSlide(currentIndex);
    setInterval(nextSlide, 3000); // Troca de slide a cada 3 segundos
});



 let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const cartBar = document.getElementById("cart-bar");
    const cartList = document.getElementById("cart-items-list");
    const cartTotal = document.getElementById("cart-total");

    if (cart.length === 0) {
      cartBar.style.display = "none";
      return;
    }

    cartBar.style.display = "flex";
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const totalQtd = item.qty * item.quantidade;
      const totalItem = (item.qty * item.price).toFixed(2);
      total += item.qty * item.price;

      const div = document.createElement("div");
      div.className = "cart_item";
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          Qtd: ${totalQtd} (x${item.qty}) - R$${totalItem}
        </div>
        <div>
          <button onclick="updateQty(${index}, -1)">-</button>
          <button onclick="updateQty(${index}, 1)">+</button>
          <button onclick="removeItem(${index})">🗑</button>
        </div>
      `;
      cartList.appendChild(div);
    });

    cartTotal.innerText = total.toFixed(2);
  }

  function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    updateCartUI();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const product = {
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        quantidade: parseInt(this.dataset.quantidade),
      };
      const existing = cart.find(p => p.name === product.name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      saveCart();
      updateCartUI();
    });
  });

  document.getElementById("checkout-btn").addEventListener("click", function () {
    if (cart.length === 0) return;

    let message = `Olá! Gostaria de fazer o seguinte pedido:%0A`;
    cart.forEach(item => {
      const totalQtd = item.qty * item.quantidade;
      const totalItem = item.qty * item.price;
      message += `- ${totalQtd} ${item.name} por R$${totalItem.toFixed(2)}%0A`;
    });

    let totalGeral = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    message += `%0ATotal: R$${totalGeral.toFixed(2)}%0A`;
    message += `%0AEndereço: (informe seu endereço aqui)`;

    const phone = "5518981274159";
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  });

  updateCartUI();