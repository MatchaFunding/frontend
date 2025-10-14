// DetalleProyecto.tsx

import React, { useState, useEffect } from 'react';
// 1. Importamos los hooks necesarios
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/navbar';
import { Card } from '../../../components/UI/cards';

// Definimos la estructura de un proyecto según tu API
interface Proyecto {
  ID: number;
  Beneficiario: number;
  Titulo: string;
  Descripcion: string;
  DuracionEnMesesMinimo: number;
  DuracionEnMesesMaximo: number;
  Alcance: string;
  Area: string;
  ImagenUrl?: string; // Hacemos la imagen opcional
  Compatibilidad?: number; // Y la compatibilidad también
}

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const DetalleProyecto: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { proyectoId } = useParams<{ proyectoId: string }>(); // 2. Obtenemos el ID de la URL

  // 3. Estados para manejar los datos, la carga y los errores
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. useEffect para buscar los datos cuando el componente se monta o el ID cambia
  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://backend.matchafunding.com/vertodoslosproyectos');
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de proyectos.');
        }
        const todosLosProyectos: Proyecto[] = await response.json();
        
        // Buscamos el proyecto específico. ¡OJO! el ID de la URL es string, hay que convertirlo a número.
        const proyectoEncontrado = todosLosProyectos.find(p => p.ID === parseInt(proyectoId || '0'));

        if (proyectoEncontrado) {
          setProyecto(proyectoEncontrado);
        } else {
          setError('El proyecto no fue encontrado.');
        }
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar el proyecto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [proyectoId]); // Se ejecuta cada vez que el `proyectoId` cambie

  const handleBack = () => {
    navigate(-1); // Forma más simple de regresar a la página anterior
  };
  
  // 5. Renderizado condicional mientras se cargan los datos
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }
  
  if (!proyecto) {
    return <div className="flex justify-center items-center h-screen">Proyecto no encontrado.</div>;
  }
  
  // 6. Si todo está bien, renderizamos el componente con los datos del `proyecto`
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
            {proyecto.Titulo}
          </h1>

          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={proyecto.ImagenUrl || '/sin-foto.png'} // Usamos la imagen del proyecto o una por defecto
              alt={proyecto.Titulo} 
              className="w-full h-full object-cover" 
            />
            {/* Si la compatibilidad viene de otra fuente, tendrás que ajustarlo. Por ahora lo comentamos si no viene en la API */}
            {/* <span className="absolute top-4 left-4 bg-[rgba(68,98,74,0.8)] text-white text-sm font-semibold py-1 px-3 rounded-lg">
              {proyecto.Compatibilidad}% compatibilidad
            </span> */}
          </div>

          {/* Nota: La API que mencionaste no incluye "Público Objetivo". He eliminado esa pestaña. Si la necesitas, deberás añadir esos datos a tu API. */}
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