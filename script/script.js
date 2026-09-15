/* =========================================================
   1. GERENCIAMENTO DO CARRINHO DE COMPRAS & DRAWER (SEU CARRINHO)
   ========================================================= */

function getCart() {
    return JSON.parse(localStorage.getItem('cls_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cls_cart', JSON.stringify(cart));
}

// Adicionar produto ao carrinho
function addToCart(event, id, name, price, img) {
    if (event) event.preventDefault();
    
    let cart = getCart();
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }

    saveCart(cart);
    updateCartUI();
    toggleCart(true); // Abre a tela lateral "Seu Carrinho" automaticamente
}

// Alterar quantidade de itens (+ / -)
function changeQty(id, delta) {
    let cart = getCart();
    let item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCart(cart);
    updateCartUI();
}

// Remover item do carrinho
function removeFromCart(id) {
    let cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    updateCartUI();
}

// Abrir e Fechar a Gaveta Lateral (Seu Carrinho)
function toggleCart(show) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar) return;

    const isClosed = sidebar.classList.contains('translate-x-full') || sidebar.style.transform === 'translateX(100%)' || sidebar.style.transform === '';
    const shouldOpen = (show === undefined) ? isClosed : show;

    if (shouldOpen) {
        sidebar.classList.remove('translate-x-full');
        sidebar.style.transform = 'translateX(0%)';
        if (overlay) overlay.classList.remove('hidden');
    } else {
        sidebar.style.transform = 'translateX(100%)';
        if (overlay) overlay.classList.add('hidden');
    }
}

// Atualizar interface gráfica do Carrinho e Badges
function updateCartUI() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const countBadge = document.getElementById('cart-count');
    const totalPrice = document.getElementById('cart-total-price');
    const subtotalPrice = document.getElementById('cart-subtotal-price');

    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalSum = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (countBadge) {
        countBadge.innerText = totalQty;
    }

    const formattedTotal = `R$ ${totalSum.toFixed(2).replace('.', ',')}`;
    if (totalPrice) totalPrice.innerText = formattedTotal;
    if (subtotalPrice) subtotalPrice.innerText = formattedTotal;

    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-stone-500 flex flex-col items-center justify-center">
                    <i class="fa-solid fa-basket-shopping text-5xl mb-3 text-stone-700"></i>
                    <p class="font-medium text-stone-400">Seu carrinho está vazio</p>
                    <p class="text-xs text-stone-600 mt-1">Navegue pelas obras e adicione seus livros favoritos!</p>
                </div>`;
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 bg-stone-800/90 p-3 rounded-xl border border-stone-700/70 shadow-md">
                <img src="${item.img}" class="w-16 h-20 object-cover rounded-lg shadow" alt="${item.name}">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-white text-sm truncate">${item.name}</h4>
                    <p class="text-amber-400 font-bold text-sm mt-0.5">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex items-center bg-stone-900 rounded-lg border border-stone-700">
                            <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 text-stone-300 hover:text-white flex items-center justify-center font-bold text-sm">-</button>
                            <span class="text-xs font-bold text-amber-400 px-2">${item.quantity}</span>
                            <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 text-stone-300 hover:text-white flex items-center justify-center font-bold text-sm">+</button>
                        </div>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-stone-500 hover:text-red-400 p-2 text-lg transition" title="Remover item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }
}


/* =========================================================
   2. NAVEGAÇÃO DE PERFIL & AUTENTICAÇÃO (LOGIN / CADASTRO)
   ========================================================= */

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('cls_current_user')) || null;
}

function getUsers() {
    return JSON.parse(localStorage.getItem('cls_users')) || [];
}

// Ação do Botão de Perfil do Cabeçalho
function handleProfileClick(e) {
    if (e) e.preventDefault();
    const user = getCurrentUser();
    
    if (user) {
        // Se já está logado, entra direto na página de perfil
        window.location.href = 'perfil.html';
    } else {
        // Se não tem login, abre a modal de cadastro/login
        openAuthModal('login');
    }
}

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        switchAuthTab(mode);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
}

function switchAuthTab(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (!loginForm || !registerForm) return;

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.className = "flex-1 py-3.5 font-bold border-b-2 border-amber-500 text-gold bg-stone-800/50";
        tabRegister.className = "flex-1 py-3.5 font-bold border-b-2 border-transparent text-stone-400 hover:text-white";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabRegister.className = "flex-1 py-3.5 font-bold border-b-2 border-amber-500 text-gold bg-stone-800/50";
        tabLogin.className = "flex-1 py-3.5 font-bold border-b-2 border-transparent text-stone-400 hover:text-white";
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    let users = getUsers();
    if (users.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('cls_users', JSON.stringify(users));
    localStorage.setItem('cls_current_user', JSON.stringify(newUser));
    alert(`Perfil criado com sucesso! Bem-vindo(a), ${name}.`);
    closeAuthModal();
    checkAuthState();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('E-mail ou senha incorretos!');
        return;
    }

    localStorage.setItem('cls_current_user', JSON.stringify(user));
    closeAuthModal();
    checkAuthState();
}

function logoutUser() {
    if (confirm('Deseja realmente sair da sua conta?')) {
        localStorage.removeItem('cls_current_user');
        checkAuthState();
        window.location.href = 'index.html';
    }
}

function checkAuthState() {
    const profileBtn = document.getElementById('nav-profile-btn');
    const profileIcon = document.getElementById('nav-profile-icon');
    const userBadge = document.getElementById('user-badge');
    const user = getCurrentUser();

    if (profileBtn && profileIcon) {
        if (user) {
            profileIcon.className = "fa-solid fa-user text-gold";
            profileBtn.title = `Perfil: ${user.name}`;
            if (userBadge) userBadge.classList.remove('hidden');
        } else {
            profileIcon.className = "fa-regular fa-user";
            profileBtn.title = "Entrar ou Cadastrar";
            if (userBadge) userBadge.classList.add('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    checkAuthState();
});