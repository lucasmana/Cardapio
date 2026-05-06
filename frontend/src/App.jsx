import React, { useState } from 'react';
import Cardapio from './components/Cardapio';
import Pedidos from './components/Pedidos';
import Acompanhar from './components/Acompanhar';
import Sobre from './components/Sobre';
import './components/cardapio.css';

function App() {
  // Estado para controlar a aba ativa
  const [abaAtiva, setAbaAtiva] = useState('cardapio');
  
  // Estado para o carrinho de compras
  const [itensCarrinho, setItensCarrinho] = useState([]);
  
  // Estado para o pedido
  const [numeroPedido, setNumeroPedido] = useState('');
  const [statusPedido, setStatusPedido] = useState(0);

  // Adicionar item ao carrinho
  const handleAdicionarItem = (item) => {
    setItensCarrinho(prev => {
      const itemExistente = prev.find(i => i.id === item.id);
      if (itemExistente) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  // Remover item do carrinho
  const handleRemoverItem = (index) => {
    setItensCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  // Atualizar quantidade do item
  const handleAtualizarQuantidade = (index, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      handleRemoverItem(index);
    } else {
      setItensCarrinho(prev => 
        prev.map((item, i) => 
          i === index 
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    }
  };

  // Finalizar pedido
  const handleFinalizarPedido = () => {
    // Gerar número de pedido aleatório
    const novoNumero = '#' + Math.floor(Math.random() * 9000 + 1000);
    setNumeroPedido(novoNumero);
    setStatusPedido(0);
    setAbaAtiva('acompanhar');
  };

  // Fazer novo pedido
  const handleFazerNovoPedido = () => {
    setItensCarrinho([]);
    setNumeroPedido('');
    setStatusPedido(0);
    setAbaAtiva('cardapio');
  };

  // Voltar para o cardápio
  const handleVoltarCardapio = () => {
    setAbaAtiva('cardapio');
  };

  // Calcular quantidade total de itens
  const quantidadeTotal = itensCarrinho.reduce((total, item) => total + item.quantidade, 0);

  // Renderizar o header
  const renderHeader = () => (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">🍃 Verde & Sabor</div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${abaAtiva === 'cardapio' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('cardapio')}
          >
            Cardápio
          </button>
          <button 
            className={`nav-tab ${abaAtiva === 'pedidos' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('pedidos')}
          >
            Pedidos
          </button>
          <button 
            className={`nav-tab ${abaAtiva === 'acompanhar' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('acompanhar')}
          >
            Acompanhar Pedido
          </button>
          <button 
            className={`nav-tab ${abaAtiva === 'sobre' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('sobre')}
          >
            Sobre Nós
          </button>
        </nav>
        <div className="cart-icon" onClick={() => setAbaAtiva('pedidos')}>
          🛒
          {quantidadeTotal > 0 && (
            <span className="cart-badge">{quantidadeTotal}</span>
          )}
        </div>
      </div>
    </header>
  );

  // Renderizar o conteúdo baseado na aba ativa
  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'cardapio':
        return (
          <Cardapio 
            onAdicionarItem={handleAdicionarItem}
            quantidadeItens={quantidadeTotal}
          />
        );
      case 'pedidos':
        return (
          <Pedidos
            itensCarrinho={itensCarrinho}
            onRemoverItem={handleRemoverItem}
            onAtualizarQuantidade={handleAtualizarQuantidade}
            onFinalizarPedido={handleFinalizarPedido}
            onVoltarCardapio={handleVoltarCardapio}
          />
        );
      case 'acompanhar':
        return (
          <Acompanhar
            numeroPedido={numeroPedido}
            statusPedido={statusPedido}
            onFazerNovoPedido={handleFazerNovoPedido}
          />
        );
      case 'sobre':
        return <Sobre />;
      default:
        return (
          <Cardapio 
            onAdicionarItem={handleAdicionarItem}
            quantidadeItens={quantidadeTotal}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderHeader()}
      <main>
        {renderConteudo()}
      </main>
    </div>
  );
}

export default App;
