import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { io } from '../server.js';

const router = express.Router();

// Dados mock do cardápio (em produção viria do banco de dados)
const cardapioData = {
  entradas: [
    { id: 1, titulo: 'Bruschetta Italiana', descricao: 'Pão torrado com tomate, manjericão e azeite', preco: 18.90, imagem: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400', tags: ['vegetariano', 'recomendado'], disponivel: true },
    { id: 2, titulo: 'Carpaccio de Salmão', descricao: 'Salmão cru fatiado com azeite, limão e alcaparras', preco: 30.50, imagem: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', tags: ['recomendado'], disponivel: true },
    { id: 3, titulo: 'Ceviche Peruano', descricao: 'Peixe branco marinado em limão, cebola e coentro', preco: 28.90, imagem: 'https://images.unsplash.com/photo-1535400255456-984e06f0e3fa?w=400', tags: ['picante'], disponivel: true }
  ],
  pratosPrincipais: [
    { id: 4, titulo: 'Filé Mignon ao Molho Madeira', descricao: 'Filé mignon grelhado com molho madeira e batatas rústicas', preco: 45.90, imagem: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', tags: ['recomendado'], disponivel: true },
    { id: 5, titulo: 'Risoto de Funghi', descricao: 'Risoto cremoso com cogumelos paris e parmesão', preco: 38.50, imagem: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', tags: ['vegetariano'], disponivel: true },
    { id: 6, titulo: 'Frango ao Curry', descricao: 'Frango em molho curry com arroz basmati e naan', preco: 35.90, imagem: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', tags: ['picante'], disponivel: true }
  ],
  sobremesas: [
    { id: 7, titulo: 'Tiramisu Clássico', descricao: 'Sobremesa italiana com café, mascarpone e cacau', preco: 22.90, imagem: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', tags: ['recomendado'], disponivel: true },
    { id: 8, titulo: 'Cheesecake de Frutas Vermelhas', descricao: 'Cheesecake cremoso com calda de frutas vermelhas', preco: 19.90, imagem: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', tags: ['vegetariano'], disponivel: true }
  ],
  bebidas: [
    { id: 9, titulo: 'Caipirinha Tradicional', descricao: 'Cachaça, limão, açúcar e gelo', preco: 15.90, imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', tags: ['recomendado'], disponivel: true },
    { id: 10, titulo: 'Suco Detox Verde', descricao: 'Couve, maçã, limão e gengibre', preco: 12.90, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', tags: ['vegetariano'], disponivel: true },
    { id: 11, titulo: 'Cerveja Artesanal IPA', descricao: 'Cerveja artesanal estilo IPA com notas cítricas', preco: 18.90, imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', tags: [], disponivel: true }
  ]
};

// Middleware para validação de erros
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

// GET /api/cardapio - Obter todo o cardápio
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: cardapioData,
      total: Object.values(cardapioData).flat().length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar cardápio'
    });
  }
});

// GET /api/cardapio/categoria - Obter itens por categoria
router.get('/categoria',
  query('categoria').isIn(['entradas', 'pratosPrincipais', 'sobremesas', 'bebidas']).withMessage('Categoria inválida'),
  handleValidationErrors,
  (req, res) => {
    try {
      const { categoria } = req.query;
      const itens = cardapioData[categoria] || [];
      
      res.json({
        success: true,
        data: itens,
        categoria,
        total: itens.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar itens da categoria'
      });
    }
  }
);

// GET /api/cardapio/item/:id - Obter item específico
router.get('/item/:id', (req, res) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    // Buscar em todas as categorias
    const todosItens = Object.values(cardapioData).flat();
    const item = todosItens.find(item => item.id === itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar item'
    });
  }
});

// GET /api/cardapio/busca - Buscar itens por termo
router.get('/busca',
  query('termo').notEmpty().withMessage('Termo de busca é obrigatório'),
  handleValidationErrors,
  (req, res) => {
    try {
      const { termo } = req.query;
      const termoLower = termo.toLowerCase();
      
      const todosItens = Object.values(cardapioData).flat();
      const resultados = todosItens.filter(item => 
        item.titulo.toLowerCase().includes(termoLower) ||
        item.descricao.toLowerCase().includes(termoLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(termoLower))
      );
      
      res.json({
        success: true,
        data: resultados,
        termo,
        total: resultados.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro na busca'
      });
    }
  }
);

// GET /api/cardapio/tags - Obter todas as tags disponíveis
router.get('/tags', (req, res) => {
  try {
    const todosItens = Object.values(cardapioData).flat();
    const todasTags = todosItens.flatMap(item => item.tags);
    const tagsUnicas = [...new Set(todasTags)];
    
    res.json({
      success: true,
      data: tagsUnicas,
      total: tagsUnicas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tags'
    });
  }
});

// GET /api/cardapio/disponiveis - Obter apenas itens disponíveis
router.get('/disponiveis', (req, res) => {
  try {
    const todosItens = Object.values(cardapioData).flat();
    const itensDisponiveis = todosItens.filter(item => item.disponivel);
    
    res.json({
      success: true,
      data: itensDisponiveis,
      total: itensDisponiveis.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar itens disponíveis'
    });
  }
});

export default router;
