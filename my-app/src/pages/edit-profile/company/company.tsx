import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import Beneficiario from '../../../models/Beneficiario'; // Asegúrate que la ruta a tu modelo sea correcta

// --- Interfaces para las Props ---
interface CompanyProps {
  formData: Beneficiario | null;
  setFormData: React.Dispatch<React.SetStateAction<Beneficiario | null>>;
  originalData: Beneficiario | null;
}

const Company: React.FC<CompanyProps> = ({ formData, setFormData, originalData }) => {
    
    // El estado ahora es manejado por el componente padre (EditProfile)
    // useEffect y useState locales han sido removidos para centralizar el estado.
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (setFormData) {
            setFormData(prevData => (prevData ? { ...prevData, [name]: value } : null));
        }
    };

    if (!formData || !originalData) {
        return <div className="text-center p-4">Cargando datos de la empresa...</div>;
    }

	return (
		<section className="bg-white p-2">
            <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-7 h-7 text-slate-500" />
                <h2 className="text-xl font-bold text-slate-700">Empresa</h2>
            </div>
            
			<form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Nombre (Razón Social) */}
                <div>
                    <label htmlFor="Nombre" className="block text-sm font-medium text-slate-600 mb-1">Razón Social</label>
                    <input type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md"/>
                </div>

				{/* RUT de Empresa */}
                <div>
					<label htmlFor="RUTdeEmpresa" className="block text-sm font-medium text-slate-600 mb-1">RUT de Empresa</label>
					<input type="text" id="RUTdeEmpresa" name="RUTdeEmpresa" value={formData.RUTdeEmpresa} onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md"/>
				</div>

				{/* RUT de Representante */}
                <div>
					<label htmlFor="RUTdeRepresentante" className="block text-sm font-medium text-slate-600 mb-1">RUT del Representante</label>
					<input type="text" id="RUTdeRepresentante" name="RUTdeRepresentante" value={formData.RUTdeRepresentante} onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md"/>
				</div>
                
				{/* Fecha de Creación (No editable) */}
                <div>
					<label htmlFor="FechaDeCreacion" className="block text-sm font-medium text-slate-600 mb-1">Fecha de creación</label>
					<input type="date" id="FechaDeCreacion" name="FechaDeCreacion" value={formData.FechaDeCreacion}
                        onChange={() => {}} // No hacer nada en el cambio
                        className="w-full px-3 py-2 bg-slate-200 border border-slate-300 rounded-md cursor-not-allowed"
                        disabled
                    />
				</div>

                {/* Tipo de Empresa */}
                <div>
                    <label htmlFor="TipoDeEmpresa" className="block text-sm font-medium text-slate-600 mb-1">Tipo de Empresa</label>
                    <select id="TipoDeEmpresa" name="TipoDeEmpresa" value={formData.TipoDeEmpresa} onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md">
                        <option value="SPA">SPA</option>
                        <option value="EIRL">EIRL</option>
                        <option value="SA">SA</option>
                        {/* Agrega más tipos de empresa según sea necesario */}
                    </select>
                </div>

                {/* Región */}
                <div>
                    <label htmlFor="RegionDeCreacion" className="block text-sm font-medium text-slate-600 mb-1">Región</label>
                    <input type="text" id="RegionDeCreacion" name="RegionDeCreacion" value={formData.RegionDeCreacion} onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md"/>
                </div>

				{/* Dirección */}
                <div className="md:col-span-2">
					<label htmlFor="Direccion" className="block text-sm font-medium text-slate-600 mb-1">Dirección</label>
					<textarea id="Direccion" name="Direccion" value={formData.Direccion} onChange={handleChange} rows={3}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md"
                    ></textarea>
				</div>
			</form>
		</section>
	);
};

export default Company;