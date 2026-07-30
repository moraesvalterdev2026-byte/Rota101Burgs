/**
 * Configuração de Horários de Funcionamento, Taxas por Bairro e Cardápio
 */

// Horários de Funcionamento (Horário de Brasília)
const STORE_CONFIG = {
    whatsappNumber: "5548999999999", // Configure o número WhatsApp com DDD
    schedule: {
        0: { open: "18:00", close: "23:30" }, // Domingo
        1: null,                             // Segunda: FECHADO
        2: { open: "18:00", close: "23:00" }, // Terça
        3: { open: "18:00", close: "23:00" }, // Quarta
        4: { open: "18:00", close: "23:00" }, // Quinta
        5: { open: "18:00", close: "23:59" }, // Sexta
        6: { open: "18:00", close: "23:59" }  // Sábado
    },
    // Taxas de Entrega por Bairro em Araranguá
    deliveryRates: [
        { neighborhood: "Cidade Alta", fee: 5.00 },
        { neighborhood: "Centro", fee: 7.00 },
        { neighborhood: "Coloninha", fee: 7.00 },
        { neighborhood: "Alto Feliz", fee: 8.00 },
        { neighborhood: "Jardim das Avenidas", fee: 8.00 },
        { neighborhood: "Urussanguinha", fee: 8.00 },
        { neighborhood: "Mato Alto", fee: 9.00 },
        { neighborhood: "Polocentro", fee: 9.00 },
        { neighborhood: "Divinéia", fee: 10.00 },
        { neighborhood: "Vila São José", fee: 10.00 },
        { neighborhood: "Outros Bairros (A consultar)", fee: 12.00 }
    ]
};

// Base de Dados de Produtos com Imagens Locais (.avif)
const PRODUCTS_DATA = [
    {
        id: "x1",
        category: "🍔 Xis 15cm",
        name: "Xis Salada Tradicional 15cm",
        price: 24.99,
        description: "Pão prensado 15cm, hambúrguer artesanal, queijo, presunto, ovo, alface, tomate e maionese da casa.",
        image: "images/Xis Salada Tradicional.avif",
        highlight: true,
        extras: [
            { id: "e1", name: "Ovo Extra", price: 3.00 },
            { id: "e2", name: "Bacon Crocante Extra", price: 6.00 },
            { id: "e3", name: "Pote Extra Maionese Verde 100g", price: 4.75 }
        ]
    },
    {
        id: "x2",
        category: "🍔 Xis 15cm",
        name: "Xis Bacon e Calabresa",
        price: 29.90,
        description: "Pão prensado, hambúrguer, bastante bacon crocante, calabresa fatiada, queijo duplo, ovo e salada completa.",
        image: "images/Xis Bacon e Calabresa.avif",
        highlight: false,
        extras: [
            { id: "e3", name: "Pote Extra Maionese Verde 100g", price: 4.75 },
            { id: "e4", name: "Queijo Duplo Extra", price: 5.00 }
        ]
    },
    {
        id: "x3",
        category: "🍔 Xis 15cm",
        name: "Xis Frango com Catupiry",
        price: 27.50,
        description: "Peito de frango desfiado temperado, Catupiry original, queijo, presunto, ovo, milho, alface e tomate.",
        image: "images/Xis Frango com Catupiry.avif",
        highlight: false,
        extras: [
            { id: "e2", name: "Bacon Crocante Extra", price: 6.00 },
            { id: "e3", name: "Pote Extra Maionese Verde 100g", price: 4.75 }
        ]
    },
    {
        id: "x4",
        category: "🍔 Xis 15cm",
        name: "Xis Coração de Frango",
        price: 31.90,
        description: "Coração de frango grelhado na chapa, queijo derretido, presunto, ovo, milho, maionese e salada.",
        image: "images/Xis Coração de Frango.avif",
        highlight: false,
        extras: [
            { id: "e3", name: "Pote Extra Maionese Verde 100g", price: 4.75 },
            { id: "e5", name: "Adicional de Catupiry", price: 4.50 }
        ]
    },
    {
        id: "x5",
        category: "🍔 Xis 15cm",
        name: "Xis Tudo Carga Pesada",
        price: 38.00,
        description: "O monstro da Rota 101: Hambúrguer, frango, bacon, calabresa, coração, 2x queijo, 2x ovo e salada completa.",
        image: "images/Xis Tudo Carga Pesada.avif",
        highlight: true,
        extras: [
            { id: "e3", name: "Pote Extra Maionese Verde 100g", price: 4.75 }
        ]
    },
    {
        id: "a1",
        category: "🍟 Acompanhamentos",
        name: "Batata Frita P Crocante",
        price: 13.00,
        description: "150g de batata palito super crocante e sequinha.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
        highlight: false,
        extras: [
            { id: "e6", name: "Adicional de Cheddar Cremoso", price: 4.50 },
            { id: "e7", name: "Farofa de Bacon Extra", price: 4.00 }
        ]
    },
    {
        id: "b1",
        category: "🥤 Bebidas",
        name: "Coca-Cola Lata 350ml",
        price: 9.00,
        description: "Lata 350ml trincando de gelada.",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        highlight: false,
        extras: []
    },
    {
        id: "m1",
        category: "🟢 Molhos Extras",
        name: "Pote Extra Maionese Verde 100g",
        price: 4.75,
        description: "Nossa receita secreta artesanal de maionese verde com ervas finas.",
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
        highlight: false,
        extras: []
    }
];