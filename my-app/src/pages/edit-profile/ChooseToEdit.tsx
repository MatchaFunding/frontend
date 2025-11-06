import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/navbar';
import React from 'react';
import './ChooseToEdit.css';

const SelectChange: React.FC = () => {
  const navigate = useNavigate();
    
  return (
    <div className="choose-edit-container">
      <NavBar />
      
      <main className="choose-edit-main">
        <h1 className="choose-edit-title">
          ¿Qué quieres editar?
        </h1>
        
        <div className="choose-edit-grid">
          <div className="edit-card">
            <div className="edit-card__content">
              <img src="/editandoMatch.png" alt="Ilustración de perfil de usuario" className="edit-card__icon" />
              <h2 className="edit-card__title">
                Tu Perfil Personal
              </h2>
              <p className="edit-card__description">
                Actualiza tu nombre, correo y otros datos personales.
              </p>
            </div>
            <button
              className="edit-card__button"
              onClick={() => navigate("/edit-Myprofile")}
            >
              Editar Perfil
            </button>
          </div>

          <div className="edit-card">
            <div className="edit-card__content">
              <img src="/EmpresarioM.png" alt="Ilustración de perfil de empresa" className="edit-card__icon" />
              <h2 className="edit-card__title">
                El Perfil de tu Empresa
              </h2>
              <p className="edit-card__description">
                Administra la información, miembros y etiquetas de la empresa.
              </p>
            </div>
            <button
              className="edit-card__button"
              onClick={() => navigate("/edit-profileE")}
            >
              Editar Empresa
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectChange;