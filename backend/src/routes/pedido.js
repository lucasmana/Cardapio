import express from 'express';
import { body, validationResult } from 'express-validator';
import { io } from '../server.js';

const router = express.Router();

// Armazenamento em memória (em produção usar banco de dados)
let pedidos = [];
let pedidoCounter = 1000;

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

// POST /api/pedidos - Criar novo pedido
router.post('/',
  [
    body('itens').isArray({ min: 1 }).withMessage('Itens deve ser um array com pelo menos um item'),
    body('itens.*.id').isInt({ min: 1 }).withMessage('ID do item deve ser um número inteiro positivo'),
    body('itens.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo'),
    body('observacoes').optional().isString().isLength({ max: 500 }).withMessage('Observações deve ter no máximo 500 caracteres'),
    body('tipoEntrega').isIn(['retirada', 'delivery']).withMessage('Tipo de entrega inválido'),
    body('endereco').if(body('tipoEntrega').equals('delivery')).notEmpty().withMessage('Endereço é obrigatório para delivery'),
    body('cliente.nome').notEmpty().withMessage('Nome do cliente é obrigatório'),
    body('cliente.telefone').notEmpty().withMessage('Telefone do cliente é obrigatório'),
  ],
  handleValidationErrors,
  (req, res) => {
    try {
      const { itens, observacoes, tipoEntrega, endereco, cliente } = req.body;
      
      // Calcular total do pedido
      const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
      
      // Gerar número do pedido
      const numeroPedido = `#${pedidoCounter++}`;
      
      // Criar objeto do pedido
      const novoPedido = {
        id: pedidos.length + 1,
        numeroPedido,
        itens,
        cliente,
        observacoes: observacoes || '',
        tipoEntrega,
        endereco: tipoEntrega === 'delivery' ? endereco : null,
        total,
        status: 'recebido', // recebido, preparando, pronto, entregue
        dataCriacao: new Date().toISOString(),
        previsaoEntrega: new Date(Date.now() + 35 * 60 * 1000).toISOString(), // 35 minutos
      };
      
      // Salvar pedido
      pedidos.push(novoPedido);
      
      // Emitir evento WebSocket para acompanhamento em tempo real
      io.emit('pedido-criado', novoPedido);
      
      // Iniciar simulação automática de status
      setTimeout(() => atualizarStatusPedido(novoPedido.id, 'preparando'), 4000);
      setTimeout(() => atualizarStatusPedido(novoPedido.id, 'pronto'), 8000);
      setTimeout(() => atualizarStatusPedido(novoPedido.id, 'entregue'), 12000);
      
      res.status(201).json({
        success: true,
        data: novoPedido,
        message: 'Pedido criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao criar pedido'
      });
    }
  }
);

// GET /api/pedidos - Listar todos os pedidos
router.get('/', (req, res) => {
  try {
    const { status, cliente } = req.query;
    
    let pedidosFiltrados = pedidos;
    
    // Filtrar por status
    if (status) {
      pedidosFiltrados = pedidosFiltrados.filter(p => p.status === status);
    }
    
    // Filtrar por cliente
    if (cliente) {
      pedidosFiltrados = pedidosFiltrados.filter(p => 
        p.cliente.nome.toLowerCase().includes(cliente.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: pedidosFiltrados,
      total: pedidosFiltrados.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao listar pedidos'
    });
  }
});

// GET /api/pedidos/:id - Obter pedido específico
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pedidoId = parseInt(id);
    
    if (isNaN(pedidoId)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido'
    });
  }
});

// GET /api/pedidos/numero/:numeroPedido - Obter pedido por número
router.get('/numero/:numeroPedido', (req, res) => {
  try {
    const { numeroPedido } = req.params;
    
    const pedido = pedidos.find(p => p.numeroPedido === numeroPedido);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido'
    });
  }
});

// PUT /api/pedidos/:id/status - Atualizar status do pedido
router.put('/:id/status',
  [
    body('status').isIn(['recebido', 'preparando', 'pronto', 'entregue']).withMessage('Status inválido'),
  ],
  handleValidationErrors,
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const pedidoId = parseInt(id);
      
      if (isNaN(pedidoId)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido'
        });
      }
      
      const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
      
      if (pedidoIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }
      
      // Atualizar status
      pedidos[pedidoIndex].status = status;
      pedidos[pedidoIndex].dataAtualizacao = new Date().toISOString();
      
      // Emitir evento WebSocket
      io.emit('status-atualizado', pedidos[pedidoIndex]);
      io.to(`pedido-${pedidoId}`).emit('pedido-status', pedidos[pedidoIndex]);
      
      res.json({
        success: true,
        data: pedidos[pedidoIndex],
        message: 'Status atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar status'
      });
    }
  }
);

// DELETE /api/pedidos/:id - Cancelar pedido
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pedidoId = parseInt(id);
    
    if (isNaN(pedidoId)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }
    
    const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
    
    if (pedidoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }
    
    // Verificar se pedido pode ser cancelado
    const pedido = pedidos[pedidoIndex];
    if (pedido.status === 'entregue') {
      return res.status(400).json({
        success: false,
        error: 'Pedido entregue não pode ser cancelado'
      });
    }
    
    // Remover pedido
    pedidos.splice(pedidoIndex, 1);
    
    // Emitir evento WebSocket
    io.emit('pedido-cancelado', { id: pedidoId });
    
    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar pedido'
    });
  }
});

// GET /api/pedidos/stats - Estatísticas dos pedidos
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: pedidos.length,
      porStatus: {},
      totalVendas: pedidos.reduce((sum, p) => sum + p.total, 0),
      pedidosHoje: pedidos.filter(p => {
        const hoje = new Date().toDateString();
        const dataPedido = new Date(p.dataCriacao).toDateString();
        return hoje === dataPedido;
      }).length
    };
    
    // Contar pedidos por status
    pedidos.forEach(pedido => {
      stats.porStatus[pedido.status] = (stats.porStatus[pedido.status] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// Função auxiliar para atualizar status (simulação automática)
function atualizarStatusPedido(pedidoId, novoStatus) {
  const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
  if (pedidoIndex !== -1) {
    pedidos[pedidoIndex].status = novoStatus;
    pedidos[pedidoIndex].dataAtualizacao = new Date().toISOString();
    
    // Emitir evento WebSocket
    io.emit('status-atualizado', pedidos[pedidoIndex]);
    io.to(`pedido-${pedidoId}`).emit('pedido-status', pedidos[pedidoIndex]);
  }
}

export default router;
