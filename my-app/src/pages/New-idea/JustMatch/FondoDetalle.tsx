import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/navbar';
import { Card } from '../../../components/UI/cards';
import { VerFondosIAAsync } from '../../../api/VerFondosIA';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

// --- PASO 1: Interfaz actualizada para coincidir con la estructura real de la API ---
interface Fondo {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Beneficios: string;
  Requisitos: string;
  Estado: string;
  FechaDeApertura: string;
  FechaDeCierre: string;
  MontoMinimo: number;
  MontoMaximo: number;
  DuracionEnMeses: number;
  Alcance: string;
  TipoDeBeneficio: string;
  TipoDePerfil: string;
  EnlaceDeLaFoto: string;
  EnlaceDelDetalle: string;
}

// --- Componente auxiliar para el estado del concurso ---
const StatusBadge: React.FC<{ estado: string }> = ({ estado }) => {
  const isAbierto = estado === 'ABI';
  const bgColor = isAbierto ? 'bg-green-100' : 'bg-red-100';
  const textColor = isAbierto ? 'text-green-800' : 'text-red-800';
  const text = isAbierto ? 'Abierto' : 'Cerrado';

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

// --- Formateador de fechas ---
const formatDate = (dateString: string) => {
  if (!dateString) return 'No especificada';
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const DetalleFondo: React.FC = () => {
  const navigate = useNavigate();
  const { fondoId } = useParams<{ fondoId: string }>();

  const [fondo, setFondo] = useState<Fondo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFondo = async () => {
      if (!fondoId) return;
      try {
        setLoading(true);
        const response = await VerFondosIAAsync();
        if (!response || !response.funds) {
          throw new Error('No se pudo obtener la lista de fondos desde la API.');
        }

        const todosLosFondos: Fondo[] = response.funds;
        const fondoEncontrado = todosLosFondos.find(f => f.ID === parseInt(fondoId));

        if (fondoEncontrado) {
          setFondo(fondoEncontrado);
        } else {
          setError('El fondo solicitado no fue encontrado.');
        }
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar los datos del fondo.');
      } finally {
        setLoading(false);
      }
    };

    fetchFondo();
  }, [fondoId]);

  const handleBack = () => navigate(-1);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando detalles del fondo...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }
  if (!fondo) {
    return <div className="flex justify-center items-center h-screen">Fondo no disponible.</div>;
  }

  // --- PASO 2: Renderizado actualizado para mostrar todos los nuevos campos ---
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex-grow p-6 md:p-10 mt-[5%]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <button onClick={handleBack} className="px-4 py-2 font-semibold text-white rounded-lg shadow-md transition-all duration-300 hover:bg-[rgba(68,98,74,0.8)]" style={{ backgroundColor: colorPalette.darkGreen }}>
              ← Regresar
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center" style={{ color: colorPalette.darkGreen }}>
            {fondo.Titulo}
          </h1>
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img src={fondo.EnlaceDeLaFoto || '/sin-foto.png'} alt={fondo.Titulo} className="w-full h-full object-cover" />
          </div>
          
          {/* --- Sección de Resumen con datos clave --- */}
          <Card>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">ESTADO</p>
                <StatusBadge estado={fondo.Estado} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">FECHA DE CIERRE</p>
                <p className="text-lg font-bold" style={{ color: colorPalette.darkGreen }}>{formatDate(fondo.FechaDeCierre)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">MONTO MÁXIMO</p>
                <p className="text-lg font-bold" style={{ color: colorPalette.darkGreen }}>
                  {fondo.MontoMaximo > 0 ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(fondo.MontoMaximo) : 'No especificado'}
                </p>
              </div>
            </div>
          </Card>

          {/* --- Tarjeta de Descripción --- */}
          <Card>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Descripción del Fondo</h2>
              <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: colorPalette.oliveGray }}>
                {fondo.Descripcion}
              </p>
            </div>
          </Card>

          {/* --- Tarjeta de Requisitos --- */}
          {fondo.Requisitos && (
            <Card>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Requisitos</h2>
                <ul className="list-disc list-inside space-y-2 text-base" style={{ color: colorPalette.oliveGray }}>
                  {fondo.Requisitos.split(',').map((req, index) => <li key={index}>{req.trim()}</li>)}
                </ul>
              </div>
            </Card>
          )}

          {/* --- Tarjeta de Beneficios --- */}
          {fondo.Beneficios && (
            <Card>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPalette.darkGreen }}>Beneficios</h2>
                <ul className="list-disc list-inside space-y-2 text-base" style={{ color: colorPalette.oliveGray }}>
                  {fondo.Beneficios.split(',').map((ben, index) => <li key={index}>{ben.trim()}</li>)}
                </ul>
              </div>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => window.open(fondo.EnlaceDelDetalle, '_blank')}
              className="px-8 py-3 font-bold text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.darkGreen, borderColor: colorPalette.softGreen }}
            >
              Ver Concurso Oficial
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleFondo;