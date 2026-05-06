import React from 'react';
import './cardapio.css';

const Sobre = () => {
  return (
    <section className="cardapio-container">
      <div className="cardapio-header">
        <h1>Sobre Nós</h1>
        <p>Conheça a história do Verde & Sabor</p>
      </div>

      <div className="sobre-conteudo">
        <div className="sobre-section">
          <h2>🍃 Verde & Sabor</h2>
          <p className="sobre-tagline">"Onde a natureza encontra o sabor"</p>
          <p className="sobre-descricao">
            Fundado em 2020, o Verde & Sabor nasceu do sonho de criar um espaço onde culinária e sustentabilidade caminhassem juntas. 
            Nossa missão é oferecer pratos deliciosos que respeitam o meio ambiente e valorizam ingredientes locais e orgânicos.
          </p>
          <p className="sobre-descricao">
            Com um menu que mistura tradição e inovação, buscamos surpreender a cada visita com sabores únicos e experiências memoráveis.
          </p>
        </div>

        <div className="sobre-section">
          <h2>Nossos Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">🌱</div>
              <h3>Sustentabilidade</h3>
              <p>Práticas ecológicas em todos os processos</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">👨‍🍳</div>
              <h3>Qualidade</h3>
              <p>Ingredientes frescos e selecionados</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">❤️</div>
              <h3>Paixão</h3>
              <p>Amor pela culinária em cada prato</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">🌍</div>
              <h3>Comunidade</h3>
              <p>Apoio a produtores locais</p>
            </div>
          </div>
        </div>

        <div className="sobre-section">
          <h2>Horários de Funcionamento</h2>
          <div className="horarios-tabela">
            <div className="horario-linha">
              <span className="horario-dia">Segunda a Quinta</span>
              <span className="horario-hora">11:30 - 22:00</span>
            </div>
            <div className="horario-linha">
              <span className="horario-dia">Sexta e Sábado</span>
              <span className="horario-hora">11:30 - 23:00</span>
            </div>
            <div className="horario-linha">
              <span className="horario-dia">Domingo</span>
              <span className="horario-hora">12:00 - 21:00</span>
            </div>
          </div>
        </div>

        <div className="sobre-section">
          <h2>Onde Estamos</h2>
          <div className="contato-info">
            <div className="contato-item">
              <span className="contato-label">📍 Endereço:</span>
              <span className="contato-valor">Rua das Flores, 123 - Jardim Verde - São Paulo/SP</span>
            </div>
            <div className="contato-item">
              <span className="contato-label">📞 Telefone:</span>
              <span className="contato-valor">(11) 3456-7890</span>
            </div>
            <div className="contato-item">
              <span className="contato-label">📧 E-mail:</span>
              <span className="contato-valor">contato@verdesabor.com.br</span>
            </div>
            <div className="contato-item">
              <span className="contato-label">🌐 Website:</span>
              <span className="contato-valor">www.verdesabor.com.br</span>
            </div>
          </div>
        </div>

        <div className="sobre-section">
          <h2>Nossa Localização</h2>
          <div className="mapa-placeholder">
            <div className="mapa-content">
              <div className="mapa-icon">🗺️</div>
              <h3>Mapa Interativo</h3>
              <p>Localização privilegiada no coração de São Paulo</p>
              <div className="mapa-fake">
                <div className="mapa-marker">📍</div>
                <div className="mapa-streets">
                  <div className="street"></div>
                  <div className="street"></div>
                  <div className="street"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sobre-section">
          <h2>Nossa Equipe</h2>
          <div className="equipe-grid">
            <div className="equipe-membro">
              <div className="membro-foto">👨‍🍳</div>
              <h3>Chef Carlos Silva</h3>
              <p>Executive Chef com 15 anos de experiência</p>
            </div>
            <div className="equipe-membro">
              <div className="membro-foto">👩‍🍳</div>
              <h3>Chef Maria Santos</h3>
              <p>Pastry Chef especialista em sobremesas</p>
            </div>
            <div className="equipe-membro">
              <div className="membro-foto">👨‍💼</div>
              <h3>João Oliveira</h3>
              <p>Gerente do restaurante</p>
            </div>
          </div>
        </div>

        <div className="sobre-section">
          <h2>Contato e Redes Sociais</h2>
          <div className="social-links">
            <a href="#" className="social-link">
              <span className="social-icon">📘</span>
              <span>Facebook</span>
            </a>
            <a href="#" className="social-link">
              <span className="social-icon">📷</span>
              <span>Instagram</span>
            </a>
            <a href="#" className="social-link">
              <span className="social-icon">🐦</span>
              <span>Twitter</span>
            </a>
            <a href="#" className="social-link">
              <span className="social-icon">📱</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
