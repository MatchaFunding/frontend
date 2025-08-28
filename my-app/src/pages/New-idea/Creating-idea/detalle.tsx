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


const DetalleF: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('presentacion');

  const proyectoData = {
    titulo: 'Concurso Asignación de Tiempo de Buque Oceanográfico 2025',
    imagenUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60',
    presentacion: [
      'Con el propósito de apoyar la investigación científica y tecnológica en aquellos ámbitos en los cuales el avance de la misma requiere del uso de infraestructura y equipamiento mayor únicos en Chile, los cuales no es posible duplicar debido a la magnitud de sus costos, pero sí aprovechar de manera óptima de acuerdo a su disponibilidad y funcionalidad, ANID, a través del Departamento de Equipamiento e Infraestructura Associativa, abre este concurso para la postulación a Tiempo de Uso del Buque Oceanográfico AGS-61 Cabo de Hornos.',
      'Este concurso se realiza en el marco del Convenio de ejecución de Cruceros de Investigación científica entre la Armada de Chile y ANID, aprobado por Resolución N°2175 del 28 de febrero de 2025. Las cláusulas del convenio son parte integral de estas bases y se recomienda la lectura y consideración del mismo para poder entender a cabalidad las reglas de este concurso.'
    ],
    publicoObjetivo: {
      titulo: 'Beneficiario(a) y/o Participantes',
      parrafos: [
        'Podrán postular a tiempo para el uso del Buque Cabo de Hornos solamente propuestas que se encuentren basadas en proyectos albergantes de investigación en C&T financiados por fondos públicos concursables y cuya vigencia sea, como mínimo, hasta junio del 2026. Estos proyectos deben contar con financiamiento para cubrir gastos de transporte, viáticos, seguros, análisis de muestras y datos.',
        'Podrán acceder al Buque, de acuerdo a la disponibilidad de tiempo y espacio, todos(as) aquellos(as) integrantes del proyecto albergante (máximo 25 personas), incluso si provienen de diferentes instituciones.',
        'Los proyectos presentados a este concurso deberán aprovechar al máximo las experiencias y capacidades internacionales. Para ello, se podrá promover la participación de personas o instituciones extranjeras en las actividades que se realicen, las cuales deberán estar debidamente justificadas y al alero de los proyectos e investigadores(as) de los proyectos albergantes.'
      ]
    }
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
            {proyectoData.titulo}
          </h1>
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={proyectoData.imagenUrl} 
              alt="Buque Oceanográfico Cabo de Hornos" 
              className="w-full h-full object-cover" 
            />
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
                    Presentación
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                    {proyectoData.presentacion.map((parrafo, index) => (
                      <p key={index}>{parrafo}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
            {activeTab === 'publico-objetivo' && (
              <Card>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>
                    {proyectoData.publicoObjetivo.titulo}
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                    {proyectoData.publicoObjetivo.parrafos.map((parrafo, index) => (
                      <p key={index}>{parrafo}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => navigate("Nuevo-proyecto")}
              className="px-8 py-3 font-bold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.darkGreen, borderColor: colorPalette.softGreen }}
            >
              Seleccionar fondo y Crear proyecto
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleF;