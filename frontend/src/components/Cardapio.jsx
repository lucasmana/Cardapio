import React, { useState, useEffect } from 'react';
import './cardapio.css';

// Dados do cardápio
const cardapioData = {
  entradas: [
    { 
      id: 1, 
      titulo: 'Bruschetta Italiana', 
      descricao: 'Pão torrado com tomate, manjericão e azeite', 
      preco: 18.90, 
      imagem: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400', 
      tags: ['vegetariano', 'recomendado'] 
    },
    { 
      id: 2, 
      titulo: 'Carpaccio de Salmão', 
      descricao: 'Salmão cru fatiado com azeite, limão e alcaparras', 
      preco: 30.50, 
      imagem: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', 
      tags: ['recomendado'] 
    },
    { 
      id: 3, 
      titulo: 'Ceviche Peruano', 
      descricao: 'Peixe branco marinado em limão, cebola e coentro', 
      preco: 28.90, 
      imagem: 'https://images.unsplash.com/photo-1535400255456-984e06f0e3fa?w=400', 
      tags: ['picante'] 
    }
  ],
  pratosPrincipais: [
    { 
      id: 4, 
      titulo: 'Filé Mignon ao Molho Madeira', 
      descricao: 'Filé mignon grelhado com molho madeira e batatas rústicas', 
      preco: 45.90, 
      imagem: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', 
      tags: ['recomendado'] 
    },
    { 
      id: 5, 
      titulo: 'Risoto de Funghi', 
      descricao: 'Risoto cremoso com cogumelos paris e parmesão', 
      preco: 38.50, 
      imagem: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', 
      tags: ['vegetariano'] 
    },
    { 
      id: 6, 
      titulo: 'Frango ao Curry', 
      descricao: 'Frango em molho curry com arroz basmati e naan', 
      preco: 35.90, 
      imagem: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 
      tags: ['picante'] 
    }
  ],
  sobremesas: [
    { 
      id: 7, 
      titulo: 'Tiramisu Clássico', 
      descricao: 'Sobremesa italiana com café, mascarpone e cacau', 
      preco: 22.90, 
      imagem: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 
      tags: ['recomendado'] 
    },
    { 
      id: 8, 
      titulo: 'Cheesecake de Frutas Vermelhas', 
      descricao: 'Cheesecake cremoso com calda de frutas vermelhas', 
      preco: 19.90, 
      imagem: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', 
      tags: ['vegetariano'] 
    }
  ],
  bebidas: [
    { 
      id: 9, 
      titulo: 'Caipirinha Tradicional', 
      descricao: 'Cachaça, limão, açúcar e gelo', 
      preco: 15.90, 
      imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 
      tags: ['recomendado'] 
    },
    { 
      id: 10, 
      titulo: 'Suco Detox Verde', 
      descricao: 'Couve, maçã, limão e gengibre', 
      preco: 12.90, 
      imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', 
      tags: ['vegetariano'] 
    },
    { 
      id: 11, 
      titulo: 'Cerveja Artesanal IPA', 
      descricao: 'Cerveja artesanal estilo IPA com notas cítricas', 
      preco: 18.90, 
      imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', 
      tags: [] 
    }
  ]
};

const Cardapio = ({ onAdicionarItem, quantidadeItens }) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [itensFiltrados, setItensFiltrados] = useState([]);

  // Filtrar itens com base na categoria
  useEffect(() => {
    if (categoriaAtiva === 'todos') {
      const todosItens = [
        ...cardapioData.entradas,
        ...cardapioData.pratosPrincipais,
        ...cardapioData.sobremesas,
        ...cardapioData.bebidas
      ];
      setItensFiltrados(todosItens);
    } else {
      const categoriaMap = {
        'entradas': cardapioData.entradas,
        'pratos-principais': cardapioData.pratosPrincipais,
        'sobremesas': cardapioData.sobremesas,
        'bebidas': cardapioData.bebidas
      };
      setItensFiltrados(categoriaMap[categoriaAtiva] || []);
    }
  }, [categoriaAtiva]);

  // Renderizar tags
  const renderTags = (tags) => {
    return tags.map((tag, index) => {
      const tagConfig = {
        'vegetariano': { emoji: '🟢', label: 'Vegetariano' },
        'picante': { emoji: '🔴', label: 'Picante' },
        'recomendado': { emoji: '⭐', label: 'Recomendado' }
      };
      
      const config = tagConfig[tag] || { emoji: '', label: tag };
      
      return (
        <span key={index} className={`tag ${tag}`}>
          {config.emoji} {config.label}
        </span>
      );
    });
  };

  // Renderizar item do cardápio
  const renderItem = (item) => {
    return (
      <div key={item.id} className="item-cardapio">
        <img src={item.imagem} alt={item.titulo} />
        <div className="item-info">
          <h3>{item.titulo}</h3>
          <p>{item.descricao}</p>
          <div className="item-preco">
            R$ {item.preco.toFixed(2)}
          </div>
          <div className="item-tags">
            {renderTags(item.tags)}
          </div>
          <button 
            className="adicionar-btn"
            onClick={() => onAdicionarItem(item)}
          >
            Adicionar ao Pedido
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="cardapio-container">
      <div className="cardapio-header">
        <div className="carrossel">
          <div className="carrossel-item">
            <img src="https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400" alt="Bruschetta Italiana" />
            <h2>Bruschetta Italiana</h2>
            <p>Pão torrado com tomate, manjericão e azeite</p>
          </div>
          <div className="carrossel-item">
            <img src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=400" alt="Carpaccio de Salmão" />
            <h2>Carpaccio de Salmão</h2>
            <p>Salmão cru fatiado com azeite, limão e alcaparras</p>
          </div>
          <div className="carrossel-item">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" 
              alt="Ceviche Peruano"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1563379091339-03f51ab87ea3?w=400';
              }}
            />
            <h2>Ceviche Peruano</h2>
            <p>Peixe branco marinado em limão, cebola e coentro</p>
          </div>
          <div className="carrossel-item">
            <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" alt="Filé Mignon ao Molho Madeira" />
            <h2>Filé Mignon ao Molho Madeira</h2>
            <p>Filé mignon grelhado com molho madeira e batatas rústicas</p>
          </div>
          <div className="carrossel-item">
            <img src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400" alt="Risoto de Funghi" />
            <h2>Risoto de Funghi</h2>
            <p>Risoto cremoso com cogumelos paris e parmesão</p>
          </div>
          <div className="carrossel-item">
            <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400" alt="Tiramisu Clássico" />
            <h2>Tiramisu Clássico</h2>
            <p>Sobremesa italiana com café, mascarpone e cacau</p>
          </div>
        </div>
      </div>

      <div className="categorias">
        <button 
          className={`categoria-btn ${categoriaAtiva === 'todos' ? 'ativo' : ''}`}
          onClick={() => setCategoriaAtiva('todos')}
        >
          Todos
        </button>
        <button 
          className={`categoria-btn ${categoriaAtiva === 'entradas' ? 'ativo' : ''}`}
          onClick={() => setCategoriaAtiva('entradas')}
        >
          Entradas
        </button>
        <button 
          className={`categoria-btn ${categoriaAtiva === 'pratos-principais' ? 'ativo' : ''}`}
          onClick={() => setCategoriaAtiva('pratos-principais')}
        >
          Pratos Principais
        </button>
        <button 
          className={`categoria-btn ${categoriaAtiva === 'sobremesas' ? 'ativo' : ''}`}
          onClick={() => setCategoriaAtiva('sobremesas')}
        >
          Sobremesas
        </button>
        <button 
          className={`categoria-btn ${categoriaAtiva === 'bebidas' ? 'ativo' : ''}`}
          onClick={() => setCategoriaAtiva('bebidas')}
        >
          Bebidas
        </button>
      </div>

      <div className="cardapio-grid">
        {itensFiltrados.map(renderItem)}
      </div>
    </section>
  );
};

export default Cardapio;
