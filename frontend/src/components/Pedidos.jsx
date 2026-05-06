import React from 'react';
import './cardapio.css';

const Pedidos = ({ 
  itensCarrinho, 
  onRemoverItem, 
  onAtualizarQuantidade, 
  onFinalizarPedido, 
  onVoltarCardapio 
}) => {
  // Calcular totais
  const calcularSubtotal = (item) => item.preco * item.quantidade;
  const calcularTotal = () => {
    return itensCarrinho.reduce((total, item) => total + calcularSubtotal(item), 0);
  };

  // Renderizar item do carrinho
  const renderItemCarrinho = (item, index) => (
    <div key={`${item.id}-${index}`} className="item-carrinho">
      <img src={item.imagem} alt={item.titulo} className="item-carrinho-img" />
      <div className="item-carrinho-info">
        <h4>{item.titulo}</h4>
        <p className="item-carrinho-preco">R$ {item.preco.toFixed(2)}</p>
      </div>
      <div className="item-carrinho-controles">
        <div className="quantidade-controles">
          <button 
            className="quantidade-btn"
            onClick={() => onAtualizarQuantidade(index, item.quantidade - 1)}
            disabled={item.quantidade <= 1}
          >
            -
          </button>
          <span className="quantidade">{item.quantidade}</span>
          <button 
            className="quantidade-btn"
            onClick={() => onAtualizarQuantidade(index, item.quantidade + 1)}
          >
            +
          </button>
        </div>
        <div className="item-subtotal">
          R$ {calcularSubtotal(item).toFixed(2)}
        </div>
        <button 
          className="remover-btn"
          onClick={() => onRemoverItem(index)}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  // Carrinho vazio
  if (itensCarrinho.length === 0) {
    return (
      <section className="cardapio-container">
        <div className="carrinho-vazio">
          <div className="carrinho-vazio-icon">🛒</div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione deliciosos itens do nosso cardápio para começar!</p>
          <button className="voltar-btn" onClick={onVoltarCardapio}>
            Ver Cardápio
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cardapio-container">
      <div className="cardapio-header">
        <h1>Seus Pedidos</h1>
        <p>Revise seu pedido antes de finalizar</p>
      </div>

      <div className="carrinho-conteudo">
        <div className="carrinho-itens">
          <h3>Itens do Pedido</h3>
          {itensCarrinho.map(renderItemCarrinho)}
        </div>

        <div className="carrinho-resumo">
          <div className="resumo-section">
            <h3>Observações</h3>
            <textarea 
              className="observacoes-textarea"
              placeholder="Alguma observação especial para seu pedido?"
              rows={4}
            />
          </div>

          <div className="resumo-section">
            <h3>Tipo de Entrega</h3>
            <div className="entrega-opcoes">
              <label className="entrega-opcao">
                <input 
                  type="radio" 
                  name="entrega" 
                  value="retirada" 
                  defaultChecked
                />
                <span>Retirada no local</span>
              </label>
              <label className="entrega-opcao">
                <input type="radio" name="entrega" value="delivery" />
                <span>Delivery</span>
              </label>
            </div>
            <input 
              type="text" 
              className="endereco-input" 
              placeholder="Endereço para delivery"
              style={{ display: 'none' }}
            />
          </div>

          <div className="resumo-section">
            <h3>Resumo do Pedido</h3>
            <div className="resumo-linha">
              <span>Subtotal:</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
            <div className="resumo-linha">
              <span>Taxa de entrega:</span>
              <span>R$ 5.00</span>
            </div>
            <div className="resumo-linha total">
              <span>Total:</span>
              <span>R$ {(calcularTotal() + 5).toFixed(2)}</span>
            </div>
          </div>

          <button className="finalizar-btn" onClick={onFinalizarPedido}>
            Finalizar Pedido
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pedidos;
