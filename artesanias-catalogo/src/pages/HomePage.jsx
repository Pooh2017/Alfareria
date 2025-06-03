import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const irAlCatalogo = () => {
    navigate('/catalogo');
  };

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Bienvenido al Catálogo Artesanal</h1>
        <p>Descubre la riqueza cultural de Santa María Atzompa a través de sus artesanías únicas.</p>
        <div className="home-buttons">
          <button onClick={irAlCatalogo}>Ver Catálogo</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
