import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/navbar';
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

const EditField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; disabled?: boolean }> = 
({ label, name, value, onChange, type = "text", placeholder, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder || ''} disabled={disabled}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-green-300 focus:border-transparent disabled:bg-slate-200 disabled:cursor-not-allowed"
        />
    </div>
);

const EditSelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }> =
({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-green-300 focus:border-transparent">
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


const EditProfile: React.FC = () => {
    const navigate = useNavigate();


    const [originalUser, setOriginalUser] = useState<Usuario | null>(null);
    const [originalPersona, setOriginalPersona] = useState<Persona | null>(null);
  

    const [formData, setFormData] = useState({
        Nombre: '',
        Correo: '',
        NombreDeUsuario: '',
        FechaDeNacimiento: '',
        Sexo: '',
    });

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
     
            const storedUser = sessionStorage.getItem("usuario");
            if (!storedUser) {
                setError("No se encontró información de sesión.");
                setLoading(false);
                return;
            }
            try {
                const sessionData = JSON.parse(storedUser);
                const userId = sessionData.Usuario?.ID;
                const personaId = sessionData.Usuario?.Persona;

                if (!userId || !personaId) throw new Error("Datos de sesión incompletos.");

                const [usersRes, personasRes] = await Promise.all([
                    fetch('https://backend.matchafunding.com/vertodoslosusuarios/'),
                    fetch('https://backend.matchafunding.com/vertodaslaspersonas/')
                ]);

                if (!usersRes.ok || !personasRes.ok) throw new Error("Error al cargar datos del servidor.");

                const allUsers: Usuario[] = await usersRes.json();
                const allPersonas: Persona[] = await personasRes.json();

                const currentUser = allUsers.find(u => u.ID === userId);
                const currentPersona = allPersonas.find(p => p.ID === personaId);

                if (!currentUser || !currentPersona) throw new Error("No se encontraron los datos del usuario.");
                
                setOriginalUser(currentUser);
                setOriginalPersona(currentPersona);

                setFormData({
                    Nombre: currentPersona.Nombre || '',
                    Correo: currentUser.Correo || '',
                    NombreDeUsuario: currentUser.NombreDeUsuario || '',
                    FechaDeNacimiento: currentPersona.FechaDeNacimiento || '',
                    Sexo: currentPersona.Sexo || 'NA',
                });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!originalUser || !originalPersona) {
            setError("No se pueden guardar los cambios, los datos originales no se cargaron.");
            return;
        }
        setIsSaving(true);
        setError(null);

       
        const personaPayload = {
            ...originalPersona,
            Nombre: formData.Nombre,
            FechaDeNacimiento: formData.FechaDeNacimiento,
            Sexo: formData.Sexo,
        };
        
        const usuarioPayload = {
            ...originalUser,
            Correo: formData.Correo,
            NombreDeUsuario: formData.NombreDeUsuario,
        };

        try {
            // .
            const [personaResponse, usuarioResponse] = await Promise.all([
                fetch(`https://backend.matchafunding.com/cambiarpersona/${originalPersona.ID}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(personaPayload),
                }),
                fetch(`https://backend.matchafunding.com/cambiarusuario/${originalUser.ID}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuarioPayload),
                })
            ]);

            if (!personaResponse.ok || !usuarioResponse.ok) {
                const personaError = personaResponse.ok ? null : await personaResponse.text();
                const usuarioError = usuarioResponse.ok ? null : await usuarioResponse.text();
                throw new Error(`Error al guardar: ${personaError || ''} ${usuarioError || ''}`);
            }

            alert("¡Cambios guardados con éxito!");
            navigate('/Perfil');

        } catch (err: any) {
            setError(err.message || "Ocurrió un error inesperado al guardar.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) return <div className="text-center p-10">Cargando datos para edición...</div>;

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorPalette.lightGray }}>
            <NavBar />
            <main className="flex-grow p-6 md:p-10 mt-[8%]">
                <div className="max-w-2xl mx-auto space-y-6">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">{error}</div>}
                    
                    <div className="flex flex-col items-center gap-8">
                        <Card className="p-8 w-full">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-700 text-left mb-6 border-b border-slate-200 pb-4">
                                Cuenta y Acceso
                            </h3>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <EditField label="Correo Electrónico" name="Correo" value={formData.Correo} onChange={handleInputChange} placeholder="tu@correo.com" />
                                <EditField label="Nombre de Usuario" name="NombreDeUsuario" value={formData.NombreDeUsuario} onChange={handleInputChange} placeholder="Tu nombre de usuario" />
                            </div>
                        </Card>

                        <Card className="p-8 w-full">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-700 text-left mb-6 border-b border-slate-200 pb-4">
                                Información Personal
                            </h3>
                           
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <EditField label="Nombre Completo" name="Nombre" value={formData.Nombre} onChange={handleInputChange} placeholder="Tu Nombre Completo" />
                                <EditField label="RUT" name="rut" value={originalPersona?.RUT || ''} onChange={() => {}} placeholder="12.345.678-9" disabled />
                                <EditField label="Fecha de Nacimiento" name="FechaDeNacimiento" value={formData.FechaDeNacimiento} onChange={handleInputChange} type="date" />
                                <EditSelectField
                                    label="Sexo"
                                    name="Sexo"
                                    value={formData.Sexo}
                                    onChange={handleInputChange}
                                    options={[
                                        { value: 'NA', label: 'Prefiero no decirlo' },
                                        { value: 'VAR', label: 'Varón' },
                                        { value: 'MUJ', label: 'Mujer' },
                                    ]}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={() => navigate(-1)} disabled={isSaving}
                            className="font-semibold py-2 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors disabled:opacity-50">
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={isSaving}
                            className="font-semibold text-white py-2 px-6 rounded-xl shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                            style={{ backgroundColor: colorPalette.darkGreen }}>
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProfile;