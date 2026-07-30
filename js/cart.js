/**
 * Módulo do Carrinho com Cálculo de Taxa de Entrega e Integração WhatsApp
 */
class CartModule {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('rota101_cart')) || [];
        this.selectedDeliveryFee = 0;
        this.selectedNeighborhoodName = "";
    }

    save() {
        localStorage.setItem('rota101_cart', JSON.stringify(this.items));
        this.render();
    }

    addItem(product, quantity, selectedExtras, observation) {
        const itemIndex = this.items.findIndex(item => 
            item.product.id === product.id && 
            JSON.stringify(item.extras) === JSON.stringify(selectedExtras) &&
            item.observation === observation
        );

        if (itemIndex > -1) {
            this.items[itemIndex].quantity += quantity;
        } else {
            this.items.push({
                cartItemId: Date.now().toString(),
                product,
                quantity,
                extras: selectedExtras,
                observation
            });
        }

        this.save();
    }

    removeItem(cartItemId) {
        this.items = this.items.filter(item => item.cartItemId !== cartItemId);
        this.save();
    }

    updateQuantity(cartItemId, delta) {
        const item = this.items.find(item => item.cartItemId === cartItemId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(cartItemId);
                return;
            }
            this.save();
        }
    }

    getSubtotal() {
        return this.items.reduce((total, item) => {
            const extrasTotal = item.extras.reduce((acc, ext) => acc + ext.price, 0);
            return total + ((item.product.price + extrasTotal) * item.quantity);
        }, 0);
    }

    getTotal() {
        const isDelivery = document.querySelector('input[name="delivery-type"]:checked')?.value === 'delivery';
        const fee = isDelivery ? this.selectedDeliveryFee : 0;
        return this.getSubtotal() + fee;
    }

    toggleDrawer() {
        const drawer = document.getElementById('cart-drawer');
        if (drawer.classList.contains('hidden')) {
            drawer.classList.remove('hidden');
            setTimeout(() => drawer.classList.remove('opacity-0'), 10);
        } else {
            drawer.classList.add('opacity-0');
            setTimeout(() => drawer.classList.add('hidden'), 300);
        }
    }

    toggleDeliveryFields() {
        const isDelivery = document.querySelector('input[name="delivery-type"]:checked').value === 'delivery';
        const fields = document.getElementById('delivery-fields');
        if (isDelivery) {
            fields.classList.remove('hidden');
        } else {
            fields.classList.add('hidden');
            this.selectedDeliveryFee = 0;
            this.selectedNeighborhoodName = "";
        }
        this.render();
    }

    updateDeliveryFee() {
        const select = document.getElementById('client-neighborhood');
        if (!select) return;

        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value) {
            this.selectedDeliveryFee = parseFloat(selectedOption.dataset.fee || 0);
            this.selectedNeighborhoodName = selectedOption.value;
        } else {
            this.selectedDeliveryFee = 0;
            this.selectedNeighborhoodName = "";
        }
        this.render();
    }

    toggleChangeField() {
        const method = document.getElementById('payment-method').value;
        const changeField = document.getElementById('change-field');
        if (method === 'Dinheiro') {
            changeField.classList.remove('hidden');
        } else {
            changeField.classList.add('hidden');
        }
    }

    render() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = this.getSubtotal();
        const total = this.getTotal();
        const isDelivery = document.querySelector('input[name="delivery-type"]:checked')?.value === 'delivery';

        // Atualiza Badges e Totais
        document.getElementById('cart-badge').innerText = totalCount;
        document.getElementById('cart-badge').classList.toggle('hidden', totalCount === 0);
        
        document.getElementById('cart-bar-count').innerText = totalCount;
        document.getElementById('cart-bar-total').innerText = app.formatCurrency(total);
        document.getElementById('drawer-subtotal').innerText = app.formatCurrency(subtotal);
        document.getElementById('drawer-total').innerText = app.formatCurrency(total);

        // Linha visual da Taxa de Entrega no Drawer
        const deliveryFeeRow = document.getElementById('drawer-delivery-fee-row');
        if (deliveryFeeRow) {
            if (isDelivery && this.selectedDeliveryFee > 0) {
                deliveryFeeRow.innerHTML = `
                    <div class="flex justify-between text-xs text-gray-400">
                        <span>Taxa de Entrega (${this.selectedNeighborhoodName})</span>
                        <span class="text-white">${app.formatCurrency(this.selectedDeliveryFee)}</span>
                    </div>
                `;
                deliveryFeeRow.classList.remove('hidden');
            } else if (isDelivery) {
                deliveryFeeRow.innerHTML = `
                    <div class="flex justify-between text-xs text-gray-400">
                        <span>Taxa de Entrega</span>
                        <span class="text-amber-400">Selecione o Bairro</span>
                    </div>
                `;
                deliveryFeeRow.classList.remove('hidden');
            } else {
                deliveryFeeRow.classList.add('hidden');
            }
        }

        // Exibição da barra flutuante inferior
        const cartBar = document.getElementById('cart-bar');
        if (totalCount > 0) {
            cartBar.classList.remove('translate-y-full');
        } else {
            cartBar.classList.add('translate-y-full');
        }

        // Lista de itens no carrinho
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fa-solid fa-basket-shopping text-4xl mb-3 opacity-40"></i>
                    <p class="text-sm">Seu carrinho está vazio.</p>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => {
            const itemUnitTotal = item.product.price + item.extras.reduce((acc, e) => acc + e.price, 0);
            return `
                <div class="pt-3 first:pt-0">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="font-bold text-white text-sm">${item.quantity}x ${item.product.name}</h4>
                            <span class="text-xs text-brand-yellow font-semibold">${app.formatCurrency(itemUnitTotal * item.quantity)}</span>
                            
                            ${item.extras.length > 0 ? `
                                <ul class="text-[11px] text-gray-400 mt-1 pl-2 border-l border-brand-border">
                                    ${item.extras.map(e => `<li>+ ${e.name} (${app.formatCurrency(e.price)})</li>`).join('')}
                                </ul>
                            ` : ''}

                            ${item.observation ? `
                                <p class="text-[11px] text-gray-400 italic mt-0.5">└ Obs: ${item.observation}</p>
                            ` : ''}
                        </div>

                        <div class="flex items-center space-x-2 border border-brand-border rounded-lg bg-brand-dark p-1 ml-2">
                            <button onclick="cart.updateQuantity('${item.cartItemId}', -1)" class="w-6 h-6 text-brand-orange font-bold hover:bg-brand-border/50 rounded flex items-center justify-center">-</button>
                            <span class="text-xs font-bold text-white w-4 text-center">${item.quantity}</span>
                            <button onclick="cart.updateQuantity('${item.cartItemId}', 1)" class="w-6 h-6 text-brand-orange font-bold hover:bg-brand-border/50 rounded flex items-center justify-center">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    checkout() {
        // Validação de Loja Aberta
        if (!app.isStoreOpen()) {
            alert("A loja está fechada no momento! Confira nossos horários de funcionamento.");
            return;
        }

        if (this.items.length === 0) {
            alert("Adicione itens ao carrinho antes de finalizar!");
            return;
        }

        const name = document.getElementById('client-name').value.trim();
        const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
        const neighborhoodSelect = document.getElementById('client-neighborhood');
        const neighborhood = neighborhoodSelect ? neighborhoodSelect.value : "";
        const address = document.getElementById('client-address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        const cashChange = document.getElementById('cash-change').value.trim();
        const orderObs = document.getElementById('order-obs').value.trim();

        // Validações
        if (!name) {
            alert("Por favor, preencha seu Nome.");
            return;
        }

        if (deliveryType === 'delivery') {
            if (!neighborhood) {
                alert("Por favor, selecione o Bairro de entrega.");
                return;
            }
            if (!address) {
                alert("Por favor, preencha a Rua e o Número.");
                return;
            }
        }

        // Construção da Mensagem para WhatsApp
        let text = `*🍔 NOVO PEDIDO - ROTA 101 🍔*\n`;
        text += `--------------------------------\n`;
        text += `*Cliente:* ${name}\n`;
        text += `*Tipo:* ${deliveryType === 'delivery' ? 'Tele-Entrega' : 'Retirada no Balcão (Cidade Alta)'}\n`;
        
        if (deliveryType === 'delivery') {
            text += `*Endereço:* ${address}\n`;
            text += `*Bairro:* ${neighborhood}\n`;
        }

        text += `\n*ITENS DO PEDIDO:*\n`;

        this.items.forEach(item => {
            const itemTotal = (item.product.price + item.extras.reduce((acc, e) => acc + e.price, 0)) * item.quantity;
            text += `• ${item.quantity}x ${item.product.name} (${app.formatCurrency(itemTotal)})\n`;
            item.extras.forEach(ext => {
                text += `  └ Extra: ${ext.name}\n`;
            });
            if (item.observation) {
                text += `  └ Obs: ${item.observation}\n`;
            }
        });

        text += `\n--------------------------------\n`;
        text += `*Subtotal:* ${app.formatCurrency(this.getSubtotal())}\n`;
        
        if (deliveryType === 'delivery') {
            text += `*Taxa de Entrega:* ${app.formatCurrency(this.selectedDeliveryFee)}\n`;
        }

        text += `*TOTAL DO PEDIDO:* ${app.formatCurrency(this.getTotal())}\n`;
        text += `*Forma de Pagamento:* ${paymentMethod}\n`;
        
        if (paymentMethod === 'Dinheiro' && cashChange) {
            text += `*Troco para:* ${cashChange}\n`;
        }
        if (orderObs) {
            text += `*Observações:* ${orderObs}\n`;
        }
        text += `--------------------------------\n`;
        text += `_Enviado pelo Cardápio Web Rota 101_`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_CONFIG.whatsappNumber}&text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    }
}

const cart = new CartModule();