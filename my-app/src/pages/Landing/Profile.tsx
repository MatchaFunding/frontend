import { useState, useEffect } from 'react';
import { Edit, Mail } from 'lucide-react';
import { Phone, User } from 'lucide-react';
import { Briefcase, ShieldCheck } from 'lucide-react';
import { UserCircle2, Building2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Users, MapPin } from 'lucide-react';

import { Card } from '../../components/UI/cards';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/navbar';
import React from 'react';

import Persona from "../../models/Persona";
import Usuario from "../../models/Usuario";
import Beneficiario from '../../models/Beneficiario';

interface MemberRelation {
  ID: number;
  Persona: number;
  Beneficiario: number;
}

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const InfoField: React.FC<{ icon: React.ElementType; label: string; value: string | null | undefined }> = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-sm font-medium" style={{ color: colorPalette.oliveGray }}>{label}</p>
    <div className="flex items-center gap-2 mt-1">
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: colorPalette.oliveGray }} />
      <p className="font-semibold text-base" style={{ color: colorPalette.darkGreen }}>{value || '-'}</p>
    </div>
  </div>
);

const ProfileI: React.FC = () => {
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<Usuario | null>(null);
  const [profilePersona, setProfilePersona] = useState<Persona | null>(null);
  const [companyInfo, setCompanyInfo] = useState<Beneficiario | null>(null);
  const [members, setMembers] = useState<Persona[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const MEMBERS_PER_PAGE = 3;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      const storedUser = localStorage.getItem("usuario");
      console.log(`Datos completos: ${storedUser}`);

      if (storedUser === null) {
        setError("No se encontró información de sesión.");
        setLoading(false);
        return;
      }

      try {
        const datos = JSON.parse(storedUser);
        const user: Usuario = datos.Usuario;
        const beneficiario: Beneficiario = datos.Beneficiario;
        //const beneficiarioId = beneficiario?.ID;

        /*

        if (!user || !beneficiarioId) {
          throw new Error("La información de sesión es incompleta.");
        }      
        const [membersRes, personasRes] = await Promise.all([
            fetch('http://127.0.0.1:8000/miembros/'),
            fetch('http://127.0.0.1:8000/personas/')
        ]);

        if (!membersRes.ok || !personasRes.ok)
          throw new Error("Error al obtener datos del servidor.");

        const allMemberRelations: MemberRelation[] = await membersRes.json();
        const allPersonas: Persona[] = await personasRes.json();
        const currentUserPersona = allPersonas.find(p => p.ID === user.Persona);

        if(!currentUserPersona)
          throw new Error("No se encontraron los datos de la persona del usuario.");

        const companyMemberRelations = allMemberRelations.filter(rel => rel.Beneficiario === beneficiarioId);
        const companyMembers = companyMemberRelations
          .map(relation => allPersonas.find(p => p.ID === relation.Persona))
          .filter((p): p is Persona => p !== undefined); 
          */

        //setProfileUser(user);
        //setProfilePersona(currentUserPersona);
        //setCompanyInfo(beneficiario);
        //setMembers(companyMembers);
      }
      catch (err: any) {
        setError(err.message || "Ocurrió un error al cargar el perfil.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);


  const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
  const paginatedMembers = members.slice(
      (currentPage - 1) * MEMBERS_PER_PAGE,
      currentPage * MEMBERS_PER_PAGE
  );
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
 
  useEffect(() => {
    const fetchProfileData = () => {
      setLoading(true);
      const storedUser = localStorage.getItem("usuario");
      if (!storedUser) {
        setError("No se encontró información de sesión.");
        setLoading(false);
        return;
      }

      try {
        const datos = JSON.parse(storedUser);
        const user: Usuario = datos.Usuario;
        
        const persona: Persona = datos.Miembros?.find((p: Persona) => p.ID === user.Persona) || datos.Miembros[0];
        const beneficiario: Beneficiario = datos.Beneficiario;
        const allMembers: Persona[] = datos.Miembros;

        if (!user || !persona || !beneficiario) {
          throw new Error("La información de sesión es incompleta.");
        }

        setProfileUser(user);
        setProfilePersona(persona);
        setCompanyInfo(beneficiario);
        setMembers(allMembers);

      } catch (err: any) {
        setError(err.message || "Ocurrió un error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorPalette.lightGray }}><p>Cargando perfil...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorPalette.lightGray }}><p className="text-red-600">Error: {error}</p></div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
      <NavBar />
      <main className="flex-grow p-6 md:p-10 mt-[5%]">
        <div className="max-w-6xl mx-auto">
        
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Perfil General</h1>
            <button 
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-transform hover:scale-105" 
              style={{ backgroundColor: colorPalette.darkGreen }} 
              onClick={() => navigate("/edit")} 
            >
              <Edit className="w-5 h-5" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            
            <Card className="p-8 w-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 ring-4 ring-white" style={{ backgroundColor: colorPalette.softGreen, boxShadow: `0 0 20px ${colorPalette.softGreen}50` }}>
                  <UserCircle2 className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colorPalette.darkGreen }}>
                  {profilePersona?.Nombre || 'N/A'}
                </h2>
                <p className="text-md mt-1 font-medium" style={{ color: colorPalette.softGreen }}>{profileUser?.NombreDeUsuario || 'Usuario'}</p>
                <hr className="w-full my-6 border-slate-200" />
                <div className="w-full space-y-4 text-left">
                  <InfoField icon={Mail} label="Correo Electrónico" value={profileUser?.Correo} />
                  <InfoField icon={Phone} label="Teléfono" value={"No disponible"} />
                </div>
              </div>
            </Card>

      
            <Card className="p-8 w-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <Building2 className="w-7 h-7 text-slate-500" />
                    <h3 className="text-xl font-bold" style={{ color: colorPalette.darkGreen }}>{companyInfo?.Nombre}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <InfoField icon={ShieldCheck} label="RUT Empresa" value={companyInfo?.RUTdeEmpresa} />
                    <InfoField icon={User} label="RUT Representante" value={companyInfo?.RUTdeRepresentante} />
                    <InfoField icon={Briefcase} label="Tipo de Empresa" value={companyInfo?.TipoDeEmpresa} />
                    <div className="md:col-span-2">
                        <InfoField icon={MapPin} label="Dirección" value={companyInfo?.Direccion} />
                    </div>
                </div>
            </Card>
            
         
            <Card className="p-8 w-full">
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200" style={{ color: colorPalette.darkGreen }}>Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <InfoField icon={User} label="Nombre Completo" value={profilePersona?.Nombre} />
                <InfoField icon={User} label="Fecha de Nacimiento" value={profilePersona?.FechaDeNacimiento} />
                <InfoField icon={ShieldCheck} label="RUT" value={profilePersona?.RUT} />
                <InfoField icon={Briefcase} label="Profesión" value={"No disponible"} />
              </div>
            </Card>

          <Card className="p-8 w-full flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <Users className="w-7 h-7 text-slate-500" />
                    <h3 className="text-xl font-bold" style={{ color: colorPalette.darkGreen }}>Miembros</h3>
                </div>
                <div className="flex-grow">
                    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 px-1 mb-2">
                        <span className="text-xs font-semibold uppercase text-slate-400">Nombre</span>
                        <span className="text-xs font-semibold uppercase text-slate-400 text-right">RUT</span>
                    </div>
                    <ul className="space-y-2">
                        {paginatedMembers.map((member) => (
                            <li key={member.ID} className="grid grid-cols-[1fr_auto] items-center gap-x-4 p-1 rounded-md">
                                <span className="font-medium text-slate-700 truncate">{member.Nombre}</span>
                                <span className="text-sm text-slate-500 text-right">{member.RUT}</span>
                            </li>
                        ))}
                    </ul>
                </div>
             
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                        <span className="text-sm text-slate-500">
                            Página {currentPage} de {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileI;