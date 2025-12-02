// Funcionalidade do Cardápio
document.addEventListener('DOMContentLoaded', function() {
    // Dados do cardápio
    const cardapioData = {
        'entradas': [
            {
                titulo: 'Bruschetta Italiana',
                descricao: 'Pão torrado com tomate, manjericão e azeite de oliva',
                preco: 'R$ 18,90',
                imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFS5-WywWzND0Hbc0DI0WfpqLEiKZ8YoJA5Q&s',
                tags: ['vegetariano', 'recomendado']
            },
            {
                titulo: 'Carpaccio de Salmão',
                descricao: 'Salmão cru fatiado com azeite, limão e alcaparras',
                preco: 'R$ 30,50',
                imagem: 'https://media.istockphoto.com/id/1214416414/pt/foto/barbecued-salmon-fried-potatoes-and-vegetables-on-wooden-background.jpg?s=612x612&w=0&k=20&c=SVk3tajK5ZdUNZn24Sx99AJtBjEbKf-qsmL9_Hk_YPw=',
                tags: ['recomendado']
            },
            {
                titulo: 'Ceviche Peruano',
                descricao: 'Peixe branco marinado em limão, cebola e coentro',
                preco: 'R$ 28,90',
                imagem: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
                tags: ['picante']
            }
        ],
        'pratos-principais': [
            {
                titulo: 'Filé Mignon ao Molho Madeira',
                descricao: 'Filé mignon grelhado com molho madeira e batatas rústicas',
                preco: 'R$ 45,90',
                imagem: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
                tags: ['recomendado']
            },
            {
                titulo: 'Risoto de Funghi',
                descricao: 'Risoto cremoso com cogumelos paris e parmesão',
                preco: 'R$ 38,50',
                imagem: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
                tags: ['vegetariano']
            },
            {
                titulo: 'Frango ao Curry',
                descricao: 'Frango em molho curry com arroz basmati e naan',
                preco: 'R$ 35,90',
                imagem: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
                tags: ['picante']
            }
        ],
        'sobremesas': [
            {
                titulo: 'Tiramisu Clássico',
                descricao: 'Sobremesa italiana com café, mascarpone e cacau',
                preco: 'R$ 22,90',
                imagem: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
                tags: ['recomendado']
            },
            {
                titulo: 'Cheesecake de Frutas Vermelhas',
                descricao: 'Cheesecake cremoso com calda de frutas vermelhas',
                preco: 'R$ 19,90',
                imagem: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
                tags: ['vegetariano']
            },
            {
                titulo: 'Chocolate Quente com Marshmallow',
                descricao: 'Chocolate quente cremoso com marshmallows artesanais',
                preco: 'R$ 16,90',
                imagem: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400',
                tags: ['recomendado']
            }
        ],
        'bebidas': [
            {
                titulo: 'Caipirinha Tradicional',
                descricao: 'Cachaça, limão, açúcar e gelo',
                preco: 'R$ 15,90',
                imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
                tags: ['recomendado']
            },
            {
                titulo: 'Suco Detox Verde',
                descricao: 'Suco natural de couve, maçã, limão e gengibre',
                preco: 'R$ 12,90',
                imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
                tags: ['vegetariano']
            },
            {
                titulo: 'Cerveja Artesanal IPA',
                descricao: 'Cerveja artesanal estilo IPA com notas cítricas',
                preco: 'R$ 18,90',
                imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
                tags: []
            }
        ]
    };

    // Função para criar card de item
    function criarItemCard(item) {
        const tagsHTML = item.tags.map(tag => 
            `<span class="tag ${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`
        ).join('');

        return `
            <div class="item-cardapio">
                <img src="${item.imagem}" alt="${item.titulo}" class="item-imagem">
                <div class="item-info">
                    <h3 class="item-titulo">${item.titulo}</h3>
                    <p class="item-descricao">${item.descricao}</p>
                    <div class="item-preco">${item.preco}</div>
                    <div class="item-tags">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Função para filtrar por categoria
    function filtrarPorCategoria(categoria) {
        const grid = document.querySelector('.cardapio-grid');
        const botoes = document.querySelectorAll('.categoria-btn');
        
        // Remove classe ativo de todos os botões
        botoes.forEach(btn => btn.classList.remove('ativo'));
        
        // Adiciona classe ativo ao botão clicado
        event.target.classList.add('ativo');
        
        // Limpa o grid
        grid.innerHTML = '';
        
        // Adiciona os itens da categoria selecionada
        if (categoria === 'todos') {
            Object.values(cardapioData).flat().forEach(item => {
                grid.innerHTML += criarItemCard(item);
            });
        } else {
            cardapioData[categoria].forEach(item => {
                grid.innerHTML += criarItemCard(item);
            });
        }
    }

    // Adiciona event listeners aos botões
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            filtrarPorCategoria(categoria);
        });
    });

    // Inicializa com todos os itens
    filtrarPorCategoria('todos');
}); 