import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../../components/NavBar/navbar';
import { Card } from '../../../components/UI/cards';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const DetalleProyecto: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('presentacion');

  const proyectoData = {
    ID: 1,
    Beneficiario: 1001,
    Titulo: 'Plataforma de Telemedicina',
    Descripcion:
      'Proyecto adjudicado que busca llevar atención médica remota a comunidades rurales con baja conectividad.',
    DuracionEnMesesMinimo: 12,
    DuracionEnMesesMaximo: 24,
    Alcance: 'Nacional',
    Area: 'Salud',
    ImagenUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=60',
    Compatibilidad: 95,
    PublicoObjetivo: {
      titulo: 'Beneficiarios del proyecto',
      parrafos: [
        'Comunidades rurales con acceso limitado a hospitales.',
        'Pacientes crónicos que requieren seguimiento médico continuo.',
        'Instituciones de salud que buscan optimizar recursos con atención digital.'
      ],
    },
  };

  const handleBack = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      const newPath = '/' + pathParts.slice(0, -1).join('/');
      navigate(newPath);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex-grow p-6 md:p-10 mt-[5%]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 font-semibold text-white rounded-lg shadow-md transition-all duration-300 hover:bg-[rgba(68,98,74,0.8)]"
              style={{ backgroundColor: colorPalette.darkGreen }}
            >
              ← Regresar
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center" style={{ color: colorPalette.darkGreen }}>
            {proyectoData.Titulo}
          </h1>

          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img src={proyectoData.ImagenUrl} alt={proyectoData.Titulo} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] text-white text-sm font-semibold py-1 px-3 rounded-lg">
              {proyectoData.Compatibilidad}% compatibilidad
            </span>
          </div>

          <div className="flex justify-start space-x-2 pt-2">
            <button
              onClick={() => setActiveTab('presentacion')}
              className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200"
              style={{
                color: activeTab === 'presentacion' ? colorPalette.darkGreen : colorPalette.softGreen,
                borderColor: activeTab === 'presentacion' ? colorPalette.softGreen : '#e2e8f0',
                borderWidth: '2px',
              }}
            >
              PRESENTACIÓN
            </button>
            <button
              onClick={() => setActiveTab('publico-objetivo')}
              className="px-6 py-2 border rounded-md font-semibold transition-colors duration-200"
              style={{
                color: activeTab === 'publico-objetivo' ? colorPalette.darkGreen : colorPalette.softGreen,
                borderColor: activeTab === 'publico-objetivo' ? colorPalette.softGreen : '#e2e8f0',
                borderWidth: '2px',
              }}
            >
              PÚBLICO OBJETIVO
            </button>
          </div>

          <div>
            {activeTab === 'presentacion' && (
              <Card>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>
                    Descripción del proyecto
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                    {proyectoData.Descripcion}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm" style={{ color: colorPalette.oliveGray }}>
                    <li><strong>Área:</strong> {proyectoData.Area}</li>
                    <li><strong>Alcance:</strong> {proyectoData.Alcance}</li>
                    <li><strong>Duración:</strong> {proyectoData.DuracionEnMesesMinimo} - {proyectoData.DuracionEnMesesMaximo} meses</li>
                  </ul>
                </div>
              </Card>
            )}
            {activeTab === 'publico-objetivo' && (
              <Card>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>
                    {proyectoData.PublicoObjetivo.titulo}
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                    {proyectoData.PublicoObjetivo.parrafos.map((p, index) => <p key={index}>{p}</p>)}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => navigate('/Matcha/New-Match')}
              className="px-8 py-3 font-bold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.darkGreen, borderColor: colorPalette.softGreen }}
            >
              Comparar con mi proyecto
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleProyecto;
