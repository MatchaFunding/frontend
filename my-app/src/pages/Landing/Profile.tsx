import React from 'react';
import NavBar from '../../components/NavBar/navbar';
import { Edit, Mail, Phone, User, Briefcase,  ShieldCheck } from 'lucide-react';
import { Card } from '../../components/UI/cards';
import { useNavigate } from 'react-router-dom';
import Persona from "../../models/Persona";
import Usuario from "../../models/Usuario";

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  oliveGray: '#505143',
  lightGray: '#f1f5f9',
};

const InfoField: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-sm font-medium" style={{ color: colorPalette.oliveGray }}>{label}</p>
    <div className="flex items-center gap-2 mt-1">
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: colorPalette.oliveGray }} />
      <p className="font-semibold text-base truncate" style={{ color: colorPalette.darkGreen }}>{value || '-'}</p>
    </div>
  </div>
);

const ProfileI: React.FC = () => {
  const storedUser = sessionStorage.getItem("usuario");
  if (storedUser) {
    const datos = JSON.parse(storedUser);
    const usuario: Usuario = datos.Usuario;
    const miembros: Persona[] = datos.Miembros;
    const id: number = datos.Usuario.Persona;
    let personas: Persona[] = miembros.filter((p) => p.ID === id);
    let persona: Persona = personas[0];

    if (personas === undefined || personas.length == 0) {
      console.log("El usuario no es miembro de la empresa");
      persona = miembros[0];
    }

    console.log("Usuario del Perfil: " + JSON.stringify(persona));

    const userData = {
      firstName: persona.Nombre,
      lastName: '',
      initials: '',
      email: usuario.Correo,
      role: '',
      rut: persona.RUT,
      phone: '',
      occupation: '',
      communityMember: 'Sí',
    };

    const navigate = useNavigate();
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
        <NavBar />
        <main className="flex-grow p-6 md:p-10 mt-[5%]">
          <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
              
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-white rounded-xl shadow-md transition-transform hover:scale-105" style={{ backgroundColor: colorPalette.softGreen }} onClick={() => navigate("/edit-profile")}>
                <Edit className="w-5 h-5" />
                Editar Perfil
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 ring-4 ring-white" style={{ backgroundColor: colorPalette.softGreen, boxShadow: `0 0 20px ${colorPalette.softGreen}50` }}>
                      <span className="text-4xl font-bold text-white tracking-wider">{userData.initials}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold" style={{ color: colorPalette.darkGreen }}>{userData.firstName} {userData.lastName}</h2>
                    <p className="text-md mt-1 font-medium" style={{ color: colorPalette.softGreen }}>{userData.role}</p>
                    <hr className="w-full my-6 border-slate-200" />
                    <div className="w-full space-y-4 text-left">
                      <InfoField icon={Mail} label="Correo Electrónico" value={userData.email} />
                      <InfoField icon={Phone} label="Teléfono" value={userData.phone} />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="p-8">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-xl md:text-2xl font-bold" style={{ color: colorPalette.darkGreen }}>Información General</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <InfoField icon={User} label="Nombres" value={userData.firstName} />
                    <InfoField icon={User} label="Apellidos" value={userData.lastName} />
                    <InfoField icon={ShieldCheck} label="RUT" value={userData.rut} />
                    <InfoField icon={Briefcase} label="Profesión/Ocupación" value={userData.occupation} />
                  
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (<div></div>);
};

export default ProfileI;
