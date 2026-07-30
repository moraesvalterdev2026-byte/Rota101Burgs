/**
 * Módulo Principal da Aplicação
 */
class App {
    constructor() {
        this.selectedProduct = null;
        this.currentQty = 1;
        this.selectedExtras = [];
    }

    init() {
        this.updateStoreStatusUI();
        this.renderCategories();
        this.renderNeighborhoodOptions();
        this.renderMenu();
        cart.render();
    }

    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Lógica para checar se a loja está aberta
    isStoreOpen() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const todaySchedule = STORE_CONFIG.schedule[dayOfWeek];

        if (!todaySchedule) return false;

        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
        const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);

        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;

        if (closeMinutes < openMinutes) {
            // Atendimento atravessa a meia-noite
            return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
        }

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }

    updateStoreStatusUI() {
        const isOpen = this.isStoreOpen();
        const statusContainer = document.getElementById('store-status-badge');
        
        if (statusContainer) {
            if (isOpen) {
                statusContainer.className = "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                statusContainer.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> Aberto`;
            } else {
                statusContainer.className = "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20";
                statusContainer.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span> Fechado`;
            }
        }
    }

    renderNeighborhoodOptions() {
        const deliveryFields = document.getElementById('delivery-fields');
        if (!deliveryFields) return;

        // Injeta o Select de Bairros e o Input de Endereço
        deliveryFields.innerHTML = `
            <select id="client-neighborhood" onchange="cart.updateDeliveryFee()" class="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:border-brand-orange focus:outline-none">
                <option value="" disabled selected>Selecione seu Bairro *</option>
                ${STORE_CONFIG.deliveryRates.map(r => `
                    <option value="${r.neighborhood}" data-fee="${r.fee}">${r.neighborhood} (+ ${this.formatCurrency(r.fee)})</option>
                `).join('')}
            </select>
            <input type="text" id="client-address" placeholder="Rua e Nº da Residência *" class="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:border-brand-orange focus:outline-none">
        `;
    }

    renderCategories() {
        const categoriesContainer = document.getElementById('categories-container');
        const categories = [...new Set(PRODUCTS_DATA.map(p => p.category))];

        categoriesContainer.innerHTML = categories.map((cat, index) => `
            <button onclick="app.filterCategory('${cat}')" 
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all border ${index === 0 ? 'bg-brand-orange text-white border-brand-orange shadow-md' : 'bg-brand-card text-gray-300 border-brand-border hover:border-gray-500'}">
                ${cat}
            </button>
        `).join('');
    }

    renderMenu() {
        const menuSections = document.getElementById('menu-sections');
        const categories = [...new Set(PRODUCTS_DATA.map(p => p.category))];

        menuSections.innerHTML = categories.map(cat => {
            const products = PRODUCTS_DATA.filter(p => p.category === cat);
            return `
                <div id="cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}" class="space-y-3">
                    <h2 class="text-base font-black text-white tracking-wide border-l-4 border-brand-orange pl-2 uppercase">${cat}</h2>
                    <div class="grid grid-cols-1 gap-3">
                        ${products.map(p => this.renderProductCard(p)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderProductCard(product) {
        return `
            <div class="bg-brand-card rounded-2xl p-3 border border-brand-border flex gap-3 shadow-md hover:border-brand-border/80 transition-all">
                <img src="${product.image}" alt="${product.name}" class="w-24 h-24 rounded-xl object-cover bg-gray-800">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-white text-sm leading-tight">${product.name}</h3>
                        <p class="text-xs text-gray-400 mt-1 line-clamp-2">${product.description}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <span class="font-extrabold text-brand-yellow text-sm">${this.formatCurrency(product.price)}</span>
                        <button onclick="app.openModal('${product.id}')" class="bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white border border-brand-orange/30 text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1">
                            <i class="fa-solid fa-plus"></i> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    filterCategory(categoryName) {
        const catId = `cat-${categoryName.replace(/[^a-zA-Z0-9]/g, '')}`;
        const element = document.getElementById(catId);
        if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    openModal(productId) {
        this.selectedProduct = PRODUCTS_DATA.find(p => p.id === productId);
        this.currentQty = 1;
        this.selectedExtras = [];

        document.getElementById('modal-img').src = this.selectedProduct.image;
        document.getElementById('modal-title').innerText = this.selectedProduct.name;
        document.getElementById('modal-desc').innerText = this.selectedProduct.description;
        document.getElementById('modal-price').innerText = this.formatCurrency(this.selectedProduct.price);
        document.getElementById('modal-obs').value = '';

        const extrasContainer = document.getElementById('modal-extras-container');
        const extrasList = document.getElementById('modal-extras-list');

        if (this.selectedProduct.extras && this.selectedProduct.extras.length > 0) {
            extrasContainer.classList.remove('hidden');
            extrasList.innerHTML = this.selectedProduct.extras.map(extra => `
                <label class="flex items-center justify-between p-3 border border-brand-border rounded-xl bg-brand-dark cursor-pointer">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" value="${extra.id}" onchange="app.toggleExtra('${extra.id}')" class="accent-brand-orange w-4 h-4 rounded">
                        <span class="text-xs text-gray-200 font-medium">${extra.name}</span>
                    </div>
                    <span class="text-xs text-brand-yellow font-bold">+ ${this.formatCurrency(extra.price)}</span>
                </label>
            `).join('');
        } else {
            extrasContainer.classList.add('hidden');
        }

        this.updateModalTotal();

        const modal = document.getElementById('product-modal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }

    closeModal() {
        const modal = document.getElementById('product-modal');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    toggleExtra(extraId) {
        const extra = this.selectedProduct.extras.find(e => e.id === extraId);
        const index = this.selectedExtras.findIndex(e => e.id === extraId);

        if (index > -1) {
            this.selectedExtras.splice(index, 1);
        } else {
            this.selectedExtras.push(extra);
        }
        this.updateModalTotal();
    }

    incrementQty() {
        this.currentQty++;
        this.updateModalTotal();
    }

    decrementQty() {
        if (this.currentQty > 1) {
            this.currentQty--;
            this.updateModalTotal();
        }
    }

    updateModalTotal() {
        const extrasTotal = this.selectedExtras.reduce((acc, e) => acc + e.price, 0);
        const total = (this.selectedProduct.price + extrasTotal) * this.currentQty;

        document.getElementById('modal-qty').innerText = this.currentQty;
        document.getElementById('modal-total-btn').innerText = this.formatCurrency(total);

        document.getElementById('modal-add-btn').onclick = () => {
            const obs = document.getElementById('modal-obs').value.trim();
            cart.addItem(this.selectedProduct, this.currentQty, [...this.selectedExtras], obs);
            this.closeModal();
        };
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());