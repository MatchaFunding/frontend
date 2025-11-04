import type Persona from '../../../models/Persona';
import { useState, useEffect } from 'react';
import { Users, SquarePen } from 'lucide-react';
import { User, X, Search } from 'lucide-react';
import { UserPlus, Trash2 } from 'lucide-react';
import { VerMiUsuario } from '../../../api/VerMiUsuario';
import { VerMiBeneficiario } from '../../../api/VerMiBeneficiario';
import { VerMisProyectos } from '../../../api/VerMisProyectos';
import { VerMisPostulaciones } from '../../../api/VerMisPostulaciones';
import { VerMisMiembros } from '../../../api/VerMisMiembros';
import { VerMisIdeas } from '../../../api/VerMisIdeas';
import React from 'react';

interface Tag {
  id: number;
  text: string;
}

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  mediumGreen: '#c0d4ad',
  lightGreen: '#d5e7cf',
  tan: '#d5ccab',
  oliveGray: '#505143',
  background: '#f8f9fa',
  danger: '#e53e3e',
};

const Members: React.FC = () => {
   
    const [members, setMembers] = useState<Persona[]>([]);
    const [tags, setTags] = useState<Tag[]>([
        { id: 1, text: 'Tecnología' },
        { id: 2, text: 'Industrias' },
        { id: 3, text: 'Innovacion' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddMemberMode, setIsAddMemberMode] = useState(false);
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [newMemberName, setNewMemberName] = useState('');
	const [newMemberRut, setNewMemberRut] = useState('');
	const [newTagName, setNewTagName] = useState('');

    // Mostrar por consola para que compile con Vite
    console.log(tags);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            setError(null);
            const storedUser = localStorage.getItem("usuario");
            if (!storedUser) {
                setError("No se encontró información de sesión.");
                setLoading(false);
                return;
            }
            try {
                const userData = JSON.parse(storedUser);
                const id = userData.Usuario.ID;
                if (!id) {
                    throw new Error("No se pudo obtener el ID del Usuario.");
                }
                const miembros: Persona[] = userData.Miembros;
                if (miembros) {
                    setMembers(miembros);
                }
            }
            catch (err: any) {
                setError(err.message || "Ocurrió un error inesperado.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

	const handleOpenModal = () => { setIsModalOpen(true); setIsAddMemberMode(false); };
	const handleCloseModal = () => { setIsModalOpen(false); setIsAddMemberMode(false); setNewMemberName(''); setNewMemberRut(''); };
	const handleAddMemberClick = () => { setIsAddMemberMode(true); };
	const handleBackToList = () => { setIsAddMemberMode(false); setNewMemberName(''); setNewMemberRut(''); };
	const [isSaving, setIsSaving] = useState(false);
	// La lógica de carga ahora está en su propia función
const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
        setError("No se encontró información de sesión.");
        setLoading(false);
        return;
    }
    try {
        const userData = JSON.parse(storedUser);
        const id = userData.Usuario.ID;
        if (!id) {
            throw new Error("No se pudo obtener el ID del Usuario.");
        }
        const miembros: Persona[] = userData.Miembros;
        if (miembros) {
            setMembers(miembros);
        }
    }
    catch (err: any) {
        setError(err.message || "Ocurrió un error inesperado.");
    }
    finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchMembers();
}, []);

const formatRut = (rut: string): string => {
    const cleanRut = rut.replace(/[\.\-]/g, "").toUpperCase();
    if (cleanRut.length < 2)
        return rut; 
    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1);
    const formattedBody = new Intl.NumberFormat('de-DE').format(parseInt(body));
    return `${formattedBody}-${verifier}`;
};



const handleSaveMember = async () => {
    if (!newMemberName || !newMemberRut) {
        alert("Por favor, complete el nombre y el RUT.");
        return;
    }

    setIsSaving(true);
    setError(null);

    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
        setError("Sesión expirada. Por favor, inicie sesión de nuevo.");
        setIsSaving(false);
        return;
    }
    const beneficiarioId = JSON.parse(storedUser).Beneficiario?.ID;
    const formattedRut = formatRut(newMemberRut);
    const id: number = JSON.parse(storedUser).Usuario?.ID;

    try {
        const personaResponse = await fetch(`http://127.0.0.1:8000/personas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Nombre: newMemberName,
                RUT: formattedRut, // Usamos el RUT formateado
                Sexo: "Otro",
                FechaDeNacimiento: new Date().toISOString().split('T')[0]
            }),
        });
        if (!personaResponse.ok) {
            let errorMsg = 'Error al crear la persona en el sistema.';
            try {
                const errorData = await personaResponse.json();
                errorMsg += ` Detalle: ${JSON.stringify(errorData)}`;
            }
            catch (e) {
                errorMsg += ` Código: ${personaResponse.status} ${personaResponse.statusText}`;
            }
            throw new Error(errorMsg);
        }
        const newPersona: Persona[] = await personaResponse.json();
        const personaId = newPersona[0].ID;

        if (personaId) {
            const miembroResponse = await fetch(`http://127.0.0.1:8000/miembros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Persona: personaId,
                    Beneficiario: beneficiarioId,
                    Usuario: id
                }),
            });
            if (!miembroResponse.ok) {
                throw new Error('Error al asociar la persona como miembro de la empresa.');
            }
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
            localStorage.setItem("usuario", JSON.stringify(datos));
            alert("Miembro agregado con éxito.");
            handleBackToList();
            fetchMembers();
        }
    }
    catch (err: any) {
        setError(err.message);
        alert(`Error: ${err.message}`);
    }
    finally {
        setIsSaving(false);
    }
};
    const handleRemoveMember = async (memberIdToRemove: number) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar a este miembro?"))
            return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/miembros/${memberIdToRemove}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('No se pudo eliminar el miembro en el servidor.');
            }
            const storedUser = localStorage.getItem("usuario");
            if (!storedUser) {
                setError("No se encontró información de sesión.");
                setLoading(false);
                return;
            }
            const userData = JSON.parse(storedUser);
            const id = userData.Usuario.ID;
            if (id) {
                const miembros: Persona[] = await VerMisMiembros(id);
                setMembers(miembros);
                alert("Miembro eliminado con éxito.");
            }
        }
        catch (err: any) {
            setError(err.message || "Error al eliminar el miembro.");
        }
    };

	const handleCloseTagModal = () => {
		setIsTagModalOpen(false);
		setNewTagName('');
	};

	const handleSaveTag = () => {
        if (!newTagName) return;
        const newTag: Tag = { id: Date.now(), text: newTagName };
        setTags(prev => [...prev, newTag]);
		console.log('Guardando etiqueta:', newTagName);
		handleCloseTagModal();
	};

    const filteredMembers = members.filter(member => 
        member.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

	return (
		<div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-700"><Users className="w-6 h-6 text-slate-500" /> Miembros</h2>
                    <button onClick={handleOpenModal} className="p-1 rounded-md hover:bg-slate-100"><SquarePen className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 px-1 mb-2">
                    <span></span><span></span>
                    <span className="text-xs font-semibold uppercase text-slate-400 text-right">RUT</span>
                    <span className="text-xs font-semibold uppercase text-slate-400 text-right">Fecha</span>
                </div>
                {loading && <p className="text-slate-500 text-center py-4">Cargando miembros...</p>}
                {error && <p className="text-red-500 text-center py-4">{error}</p>}
                {!loading && !error && (
                    <ul className="space-y-2">
                        {members.map((member) => (
                            <li key={member.ID} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 p-1 rounded-md hover:bg-slate-50">
                                <User className="w-5 h-5 text-slate-500" />
                                <span className="font-medium text-left text-slate-700">{member.Nombre}</span>
                                <span className="text-sm text-right text-slate-500">{member.RUT}</span>
                                <span className="text-sm text-right text-slate-500">{member.FechaDeNacimiento}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <hr className="border-slate-200" />
            <div>
                {/* aqui quité la parte de equiquetas para que otro wons lo haga si es que es necesario */}
            </div>
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
					<div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
						{!isAddMemberMode ? (
							<div className='p-6'>
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-bold text-slate-800">Editar Miembros</h3>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={handleAddMemberClick} className="p-2 rounded-full hover:bg-slate-100" title="Agregar Miembro"><UserPlus className="w-5 h-5 text-slate-600" /></button>
                                        <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-slate-100" title="Cerrar"><X className="w-5 h-5 text-slate-600" /></button>
                                    </div>
								</div>
								<div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
									<input type="text" placeholder="Buscar miembro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-300" />
								</div>
								<div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                                    {filteredMembers.map(member => (
                                        <div key={member.ID} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                            <div>
                                                <div className="font-medium text-slate-700">{member.Nombre}</div>
                                                <div className="text-sm text-slate-500">{member.RUT}</div>
                                            </div>
                                           
                                            <button onClick={() => handleRemoveMember(member.ID)} className="p-2 rounded-full hover:bg-red-100" title="Eliminar Miembro">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>
                                    ))}
								</div>
							</div>
						) : (
							<div className='p-6'>
								<div className="flex justify-between items-center mb-6">
									<h3 className="text-lg font-bold text-slate-800">Agregar Miembro</h3>
									<button onClick={handleBackToList} className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Cerrar">
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
								</div>
								<form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveMember(); }}>
									<div>
										<label className="block text-sm font-medium text-slate-600 mb-1">Nombre completo</label>
										<input type="text" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-transparent" 
											placeholder="Ingrese el nombre completo"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-600 mb-1">RUT</label>
										<input type="text" value={newMemberRut} onChange={(e) => setNewMemberRut(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-transparent" 
											placeholder="Formato: 12.345.678-9"
										/>
									</div>
								</form>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        onClick={handleBackToList} 
                                        disabled={isSaving} 
                                        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSaveMember} 
                                        disabled={isSaving} 
                                        className="px-4 py-2 text-white rounded-md hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100" 
                                        style={{ backgroundColor: colorPalette.darkGreen }}
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
							</div>
						)}
					</div>
				</div>
			)}

			{isTagModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={handleCloseTagModal}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Agregar Etiqueta</h3>
                            <button onClick={handleCloseTagModal} className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Cerrar">
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveTag(); }}>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre de la etiqueta</label>
                                <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-transparent"
                                    placeholder="Ej: Innovación, Finanzas..."
                                />
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={handleCloseTagModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSaveTag} className="px-4 py-2 text-white rounded-md hover:scale-105 transition-transform" style={{ backgroundColor: colorPalette.darkGreen }}>
                                Guardar Etiqueta
                            </button>
                        </div>
                    </div>
                </div>
			)}
		</div>
	);
};

export default Members;