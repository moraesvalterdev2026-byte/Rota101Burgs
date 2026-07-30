/**
 * Módulo Principal da Aplicação com Busca em Tempo Real e UX Refinada
 */
class App {
    constructor() {
        this.selectedProduct = null;
        this.currentQty = 1;
        this.selectedExtras = [];
        this.searchQuery = "";
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
            return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
        }

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }

    updateStoreStatusUI() {
        const isOpen = this.isStoreOpen();
        const statusContainer = document.getElementById('store-status-badge');
        
        if (statusContainer) {
            if (isOpen) {
                statusContainer.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                statusContainer.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Aberto`;
            } else {
                statusContainer.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30";
                statusContainer.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span> Fechado`;
            }
        }
    }

    renderNeighborhoodOptions() {
        const deliveryFields = document.getElementById('delivery-fields');
        if (!deliveryFields) return;

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
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all border ${index === 0 ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20' : 'bg-brand-card text-gray-300 border-brand-border hover:border-gray-500'}">
                ${cat}
            </button>
        `).join('');
    }

    handleSearch() {
        const input = document.getElementById('search-input');
        this.searchQuery = input ? input.value.toLowerCase().trim() : "";
        this.renderMenu();
    }

    renderMenu() {
        const menuSections = document.getElementById('menu-sections');
        const categories = [...new Set(PRODUCTS_DATA.map(p => p.category))];

        let filteredProducts = PRODUCTS_DATA;
        if (this.searchQuery) {
            filteredProducts = PRODUCTS_DATA.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery) || 
                p.description.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filteredProducts.length === 0) {
            menuSections.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i class="fa-solid fa-magnifying-glass text-3xl mb-2 text-gray-500 opacity-50"></i>
                    <p class="text-sm font-semibold">Nenhum lanche encontrado com esse nome.</p>
                </div>
            `;
            return;
        }

        menuSections.innerHTML = categories.map(cat => {
            const products = filteredProducts.filter(p => p.category === cat);
            if (products.length === 0) return '';

            return `
                <div id="cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}" class="space-y-3">
                    <h2 class="text-base font-black text-white tracking-wide border-l-4 border-brand-orange pl-2 uppercase leading-none">${cat}</h2>
                    <div class="grid grid-cols-1 gap-3">
                        ${products.map(p => this.renderProductCard(p)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Card do Produto com CTA Solid e Maior Contraste
    renderProductCard(product) {
        return `
            <div class="bg-brand-card rounded-2xl p-3 border border-brand-border flex gap-3 shadow-md hover:border-brand-border/80 transition-all">
                <img src="${product.image}" alt="${product.name}" class="w-24 h-24 rounded-xl object-cover bg-gray-800 flex-shrink-0">
                <div class="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 class="font-bold text-white text-sm leading-snug truncate">${product.name}</h3>
                        <p class="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">${product.description}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2 pt-1">
                        <span class="font-black text-brand-yellow text-sm tracking-tight">${this.formatCurrency(product.price)}</span>
                        
                        <!-- CTA Primário Solid com Feedback de Toque -->
                        <button onclick="app.openModal('${product.id}')" class="bg-brand-orange hover:bg-orange-600 active:scale-95 text-white text-xs font-extrabold py-2 px-3.5 rounded-xl shadow-md shadow-brand-orange/20 transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-plus text-[10px]"></i> Adicionar
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
                    <div class="flex items-center space-x-2.5">
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