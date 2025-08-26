import React from 'react';
import './edit-profile.css';
import Members from './members/members.tsx';
import Company from './company/company.tsx';

const EditProfile: React.FC = () => {
	return (
		<div className="edit-profile-container">
			<main className="edit-profile-main">
				<div className="edit-profile-content">
					{/* Empresa */}
					<Company />
					{/* Miembros y Etiquetas */}
					<Members />
				</div>
				<div className="edit-profile-buttons">
					<button className="btn-back">Volver</button>
					<button className="btn-save">Guardar cambios</button>
				</div>
			</main>
		</div>
	);
};

export default EditProfile;
