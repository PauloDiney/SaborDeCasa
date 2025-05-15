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

  // Adiciona campo de endereço no carrinho
  const cartBarBottom = document.querySelector('.cart_bar_bottom');
  if (cartBarBottom && !document.getElementById('endereco-input')) {
    const enderecoDiv = document.createElement('div');
    enderecoDiv.style = 'display: flex; align-items: center; width: 100%; margin-bottom: 10px;';

    const enderecoLabel = document.createElement('label');
    enderecoLabel.htmlFor = 'endereco-input';
    enderecoLabel.innerText = 'Endereço para entrega:';
    enderecoLabel.style = 'font-size: 1rem; color: #333; margin-right: 8px; min-width: 150px;';

    const enderecoInput = document.createElement('input');
    enderecoInput.type = 'text';
    enderecoInput.id = 'endereco-input';
    enderecoInput.placeholder = 'Digite seu endereço completo';
    enderecoInput.style = 'flex: 1; padding: 8px 10px; border-radius: 6px; border: 1.5px solid #25d366; font-size: 1rem; background: #f9f9f9;';

    enderecoDiv.appendChild(enderecoLabel);
    enderecoDiv.appendChild(enderecoInput);

    cartBarBottom.parentNode.insertBefore(enderecoDiv, cartBarBottom);
  }

  document.getElementById("checkout-btn").addEventListener("click", function () {
    if (cart.length === 0) return;

    // Pega o endereço digitado
    const endereco = document.getElementById('endereco-input')?.value || '';
    if (!endereco) {
      alert('Por favor, informe seu endereço para entrega.');
      return;
    }

    // Gera número do pedido de 5 dígitos aleatórios
    const numeroPedido = Math.floor(10000 + Math.random() * 90000);

    let itensArray = [];
    let message = `Olá! Gostaria de fazer o seguinte pedido (Nº ${numeroPedido}):%0A`;
    cart.forEach(item => {
      const totalQtd = item.qty * item.quantidade;
      const totalItem = item.qty * item.price;
      message += `- ${totalQtd} ${item.name} por R$${totalItem.toFixed(2)}%0A`;
      itensArray.push(`${totalQtd} ${item.name} por R$${totalItem.toFixed(2)}`);
    });

    let totalGeral = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    message += `%0ATotal: R$${totalGeral.toFixed(2)}%0A`;
    message += `%0AEndereço: ${encodeURIComponent(endereco)}`;
    message += `%0A*Número do pedido: ${numeroPedido}*`;

    // Envia para o Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbxmQ-Nm-MjHvYs3kCY6NHbJwh3KTC1OiNnxNbbNJpuIA0EcSenSKJiKUvrJBkOPb09N/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numero: numeroPedido,
        itens: itensArray.join(' | '),
        total: `R$${totalGeral.toFixed(2)}`,
        endereco: endereco
      })
    });

    const phone = "5518981274159";
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  });

  fetch('https://script.google.com/macros/s/SEU_ID/exec')
    .then(res => res.json())
    .then(data => {
      // data é um array de objetos [{itens:..., total:..., endereco:...}, ...]
      // Monte a tabela igual já faz!
    });

  updateCartUI();