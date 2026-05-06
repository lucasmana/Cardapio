import React, { useState, useEffect } from 'react';
import './cardapio.css';

const Acompanhar = ({ numeroPedido, statusPedido, onFazerNovoPedido }) => {
  const [statusAtual, setStatusAtual] = useState(statusPedido);
  const [tempoRestante, setTempoRestante] = useState(35);

  // Status do pedido
  const statusSteps = [
    { id: 0, nome: 'Pedido Recebido', emoji: '📝' },
    { id: 1, nome: 'Em Preparo', emoji: '👨‍🍳' },
    { id: 2, nome: 'Saiu para Entrega', emoji: '🚚' },
    { id: 3, nome: 'Entregue', emoji: '✅' }
  ];

  // Simulação automática do status
  useEffect(() => {
    if (statusAtual < 3) {
      const timer = setTimeout(() => {
        setStatusAtual(prev => prev + 1);
        setTempoRestante(prev => Math.max(0, prev - 8));
      }, 4000); // 4 segundos

      return () => clearTimeout(timer);
    }
  }, [statusAtual]);

  // Timer para tempo restante
  useEffect(() => {
    if (statusAtual < 3 && tempoRestante > 0) {
      const timer = setTimeout(() => {
        setTempoRestante(prev => prev - 1);
      }, 60000); // 1 minuto

      return () => clearTimeout(timer);
    }
  }, [statusAtual, tempoRestante]);

  const statusInfo = statusSteps[statusAtual];

  return (
    <section className="cardapio-container">
      <div className="cardapio-header">
        <h1>Acompanhar Pedido</h1>
        <p>Acompanhe o status do seu pedido em tempo real</p>
      </div>

      <div className="acompanhar-conteudo">
        <div className="pedido-info">
          <div className="pedido-numero">
            <span className="pedido-label">Número do Pedido:</span>
            <span className="pedido-numero-valor">{numeroPedido}</span>
          </div>
          <div className="pedido-status">
            <span className="pedido-label">Status Atual:</span>
            <span className="pedido-status-valor">
              {statusInfo.emoji} {statusInfo.nome}
            </span>
          </div>
          <div className="pedido-previsao">
            <span className="pedido-label">Previsão de entrega:</span>
            <span className="pedido-previsao-valor">
              {tempoRestante > 0 ? `${tempoRestante} minutos` : 'A qualquer momento!'}
            </span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((statusAtual + 1) / 4) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {statusSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${index <= statusAtual ? 'ativo' : ''}`}
              >
                <div className="step-circle">
                  <span className="step-emoji">{step.emoji}</span>
                </div>
                <span className="step-label">{step.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="status-mensagem">
          {statusAtual === 0 && (
            <div className="mensagem-card">
              <h3>📝 Pedido Recebido!</h3>
              <p>Seu pedido foi recebido e está sendo confirmado pela cozinha.</p>
            </div>
          )}
          {statusAtual === 1 && (
            <div className="mensagem-card">
              <h3>👨‍🍳 Em Preparo!</h3>
              <p>Nossos chefs estão preparando seu pedido com todo cuidado e carinho.</p>
            </div>
          )}
          {statusAtual === 2 && (
            <div className="mensagem-card">
              <h3>🚚 Saiu para Entrega!</h3>
              <p>Seu pedido está a caminho! Fique atento à sua entrega.</p>
            </div>
          )}
          {statusAtual === 3 && (
            <div className="mensagem-card sucesso">
              <h3>✅ Pedido Entregue!</h3>
              <p>Seu pedido foi entregue com sucesso! Aproveite sua refeição!</p>
              <button className="novo-pedido-btn" onClick={onFazerNovoPedido}>
                Fazer Novo Pedido
              </button>
            </div>
          )}
        </div>

        <div className="detalhes-pedido">
          <h3>Detalhes do Pedido</h3>
          <div className="detalhes-grid">
            <div className="detalhe-item">
              <span className="detalhe-label">Data do Pedido:</span>
              <span className="detalhe-valor">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="detalhe-item">
              <span className="detalhe-label">Hora do Pedido:</span>
              <span className="detalhe-valor">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="detalhe-item">
              <span className="detalhe-label">Forma de Pagamento:</span>
              <span className="detalhe-valor">Pagamento na entrega</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Acompanhar;
