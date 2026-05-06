import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Armazenamento em memória (em produção usar banco de dados)
let usuarios = [
  {
    id: 1,
    nome: 'Admin',
    email: 'admin@verdesabor.com.br',
    senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    telefone: '(11) 3456-7890',
    papel: 'admin',
    dataCriacao: new Date().toISOString()
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui';

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

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token não fornecido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido'
      });
    }
    req.user = user;
    next();
  });
};

// POST /api/usuarios/registrar - Registrar novo usuário
router.post('/registrar',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { nome, email, senha, telefone } = req.body;
      
      // Verificar se email já existe
      const usuarioExistente = usuarios.find(u => u.email === email);
      if (usuarioExistente) {
        return res.status(400).json({
          error: 'Email já cadastrado'
        });
      }
      
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Criar novo usuário
      const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha: senhaHash,
        telefone,
        papel: 'cliente',
        dataCriacao: new Date().toISOString()
      };
      
      usuarios.push(novoUsuario);
      
      // Remover senha do retorno
      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      
      res.status(201).json({
        success: true,
        data: usuarioSemSenha,
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao criar usuário'
      });
    }
  }
);

// POST /api/usuarios/login - Login de usuário
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      // Buscar usuário
      const usuario = usuarios.find(u => u.email === email);
      if (!usuario) {
        return res.status(401).json({
          error: 'Email ou senha incorretos'
        });
      }
      
      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({
          error: 'Email ou senha incorretos'
        });
      }
      
      // Gerar token
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          papel: usuario.papel 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Remover senha do retorno
      const { senha: _, ...usuarioSemSenha } = usuario;
      
      res.json({
        success: true,
        data: {
          usuario: usuarioSemSenha,
          token
        },
        message: 'Login realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao fazer login'
      });
    }
  }
);

// GET /api/usuarios/perfil - Obter perfil do usuário autenticado
router.get('/perfil', authenticateToken, (req, res) => {
  try {
    const usuario = usuarios.find(u => u.id === req.user.id);
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }
    
    // Remover senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;
    
    res.json({
      success: true,
      data: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar perfil'
    });
  }
});

// PUT /api/usuarios/perfil - Atualizar perfil do usuário
router.put('/perfil',
  authenticateToken,
  [
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('telefone').optional().notEmpty().withMessage('Telefone não pode ser vazio'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { nome, telefone } = req.body;
      const usuarioIndex = usuarios.findIndex(u => u.id === req.user.id);
      
      if (usuarioIndex === -1) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }
      
      // Atualizar dados
      if (nome) usuarios[usuarioIndex].nome = nome;
      if (telefone) usuarios[usuarioIndex].telefone = telefone;
      usuarios[usuarioIndex].dataAtualizacao = new Date().toISOString();
      
      // Remover senha do retorno
      const { senha: _, ...usuarioAtualizado } = usuarios[usuarioIndex];
      
      res.json({
        success: true,
        data: usuarioAtualizado,
        message: 'Perfil atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar perfil'
      });
    }
  }
);

// PUT /api/usuarios/senha - Alterar senha
router.put('/senha',
  authenticateToken,
  [
    body('senhaAtual').notEmpty().withMessage('Senha atual é obrigatória'),
    body('novaSenha').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { senhaAtual, novaSenha } = req.body;
      const usuario = usuarios.find(u => u.id === req.user.id);
      
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }
      
      // Verificar senha atual
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaValida) {
        return res.status(400).json({
          error: 'Senha atual incorreta'
        });
      }
      
      // Atualizar senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      usuario.senha = novaSenhaHash;
      usuario.dataAtualizacao = new Date().toISOString();
      
      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao alterar senha'
      });
    }
  }
);

// GET /api/usuarios - Listar todos os usuários (admin apenas)
router.get('/', authenticateToken, (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.papel !== 'admin') {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }
    
    // Remover senhas do retorno
    const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
    
    res.json({
      success: true,
      data: usuariosSemSenha,
      total: usuariosSemSenha.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao listar usuários'
    });
  }
});

export default router;
