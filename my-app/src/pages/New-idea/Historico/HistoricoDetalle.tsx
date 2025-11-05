import { useNavigate, useParams } from 'react-router-dom';
import { VerTodosLosProyectos } from '../../../api/VerTodosLosProyectos';
import { useState, useEffect } from 'react';
import { Card } from '../../../components/UI/cards';
import NavBar from '../../../components/NavBar/navbar';
import Proyecto from '../../../models/Proyecto';
import React from 'react';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const DetalleProyecto: React.FC = () => {
  const navigate = useNavigate();
  const {proyectoId} = useParams<{ proyectoId: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        setLoading(true);
        const proyectos = await VerTodosLosProyectos();
        if (proyectos) {
          const proyectoEncontrado = proyectos.find(p => p.ID === parseInt(proyectoId || '0'));
          if (proyectoEncontrado) {
            setProyecto(proyectoEncontrado);
          }
          else {
            setError('El proyecto no fue encontrado.');
          }
        }
      }
      catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar el proyecto.');
      }
      finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [proyectoId]);

  const handleBack = () => {
    navigate(-1);
  };
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando detalles del proyecto...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }
  if (!proyecto) {
    return <div className="flex justify-center items-center h-screen">Proyecto no encontrado.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex-grow p-6 md:p-10 mt-24 sm:mt-32">
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
            {proyecto.Titulo}
          </h1>

          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={'/sin-foto.png'}
              alt={proyecto.Titulo} 
              className="w-full h-full object-cover" 
            />
          </div>
          <Card>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>
                Descripción del proyecto
              </h2>
              <p className="text-base leading-relaxed" style={{ color: colorPalette.oliveGray }}>
                {proyecto.Descripcion}
              </p>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: colorPalette.oliveGray }}>
                <li><strong>Área:</strong> {proyecto.Area}</li>
                <li><strong>Alcance:</strong> {proyecto.Alcance}</li>
                <li><strong>Duración:</strong> {proyecto.DuracionEnMesesMinimo} - {proyecto.DuracionEnMesesMaximo} meses</li>
              </ul>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default DetalleProyecto;