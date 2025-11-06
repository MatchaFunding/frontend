import { CambiarBeneficiario } from  '../../api/CambiarBeneficiario';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerMiUsuario } from '../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../api/VerMisMiembros';
import { VerMisIdeas } from '../../api/VerMisIdeas';
import Beneficiario from '../../models/Beneficiario';
import Members from './members/members.tsx';
import Company from './company/company.tsx';
import NavBar from '../../components/NavBar/navbar';
import React from 'react';

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f8fafc',
  buttonGray: '#e2e8f0',
  buttonGrayHover: '#cbd5e1',
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const [companyFormData, setCompanyFormData] = useState<Beneficiario | null>(null);
  const [originalCompanyData, setOriginalCompanyData] = useState<Beneficiario | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      const beneficiario = data.Beneficiario;
      if (beneficiario) {
        setCompanyFormData(data.Beneficiario);
        setOriginalCompanyData(data.Beneficiario);
      }
      else {
        setError('No se encontraron datos del beneficiario en la sesión.');
      }
    }
    else {
      setError('No se encontró información de usuario en la sesión.');
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!companyFormData || !originalCompanyData) {
      alert('No hay datos de la empresa para guardar.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = { ...originalCompanyData, ...companyFormData };

    try {
      const beneficiario = await CambiarBeneficiario(originalCompanyData.ID, payload);
      console.log(`Beneficiario modificado: ${JSON.stringify(beneficiario)}`);
      const storedUser = localStorage.getItem('usuario');
      
      if (storedUser) {
        const datos = JSON.parse(storedUser);
        const id = datos.Usuario?.ID;
        if (id) {
          const usuario = await VerMiUsuario(id);
          const beneficiario = await VerMiBeneficiario(id);
          const proyectos = await VerMisProyectos(id);
          const postulaciones = await VerMisPostulaciones(id);
          const miembros = await VerMisMiembros(id);
          const ideas = await VerMisIdeas(id);
          
          const datos = {
            "Usuario":usuario,
            "Beneficiario":beneficiario,
            "Proyectos":proyectos,
            "Postulaciones":postulaciones,
            "Miembros":miembros,
            "Ideas":ideas
          }
          localStorage.setItem('usuario', JSON.stringify(datos));
          alert('¡Cambios en la empresa guardados con éxito!');
          navigate('/Perfil');
        }
      }
    }
    catch (err: any) {
      setError(err.message);
      alert(`Error al guardar: ${err.message}`);
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colorPalette.lightGray }}
    >
      <NavBar />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 mt-20 sm:mt-24 md:mt-8">
        <div className="w-full max-w-6xl space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
              {error}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                <Company
                  formData={companyFormData}
                  setFormData={setCompanyFormData}
                  originalData={originalCompanyData}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-inner p-6 flex flex-col justify-between">
                <Members />
              </div>
            </div>
          </div>
          <footer className="flex justify-center items-center gap-4">
            <button
              onClick={() => navigate('/Perfil')}
              disabled={isSaving}
              className="font-semibold py-2 px-6 rounded-xl transition-colors duration-300 disabled:opacity-50"
              style={{
                backgroundColor: colorPalette.buttonGray,
                color: colorPalette.darkGreen,
              }}
              onMouseOver={(e) => {
                if (!isSaving)
                  e.currentTarget.style.backgroundColor = colorPalette.buttonGrayHover;
              }}
              onMouseOut={(e) => {
                if (!isSaving)
                  e.currentTarget.style.backgroundColor = colorPalette.buttonGray;
              }}
            >
              Volver
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="font-semibold text-white py-2 px-6 rounded-xl shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              style={{ backgroundColor: colorPalette.darkGreen }}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
