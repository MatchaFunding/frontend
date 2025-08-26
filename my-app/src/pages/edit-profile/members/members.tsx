import React, { useState } from 'react';
import './members.css';

const Members: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddMemberMode, setIsAddMemberMode] = useState(false);
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [newMemberName, setNewMemberName] = useState('');
	const [newMemberRut, setNewMemberRut] = useState('');
	const [newTagName, setNewTagName] = useState('');

	const handleOpenModal = () => {
		setIsModalOpen(true);
		setIsAddMemberMode(false);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setIsAddMemberMode(false);
		setNewMemberName('');
		setNewMemberRut('');
	};

	const handleAddMemberClick = () => {
		setIsAddMemberMode(true);
	};

	const handleBackToList = () => {
		setIsAddMemberMode(false);
		setNewMemberName('');
		setNewMemberRut('');
	};

	const handleSaveMember = () => {
		// Aquí se implementaría la lógica para guardar el miembro
		console.log('Guardando miembro:', { name: newMemberName, rut: newMemberRut });
		setIsAddMemberMode(false);
		setNewMemberName('');
		setNewMemberRut('');
	};

	const handleRemoveTag = () => {
		// Aquí se implementaría la lógica para eliminar la etiqueta
		console.log('Eliminando etiqueta');
	};

	const handleOpenTagModal = () => {
		setIsTagModalOpen(true);
	};

	const handleCloseTagModal = () => {
		setIsTagModalOpen(false);
		setNewTagName('');
	};

	const handleSaveTag = () => {
		// Aquí se implementaría la lógica para guardar la etiqueta
		console.log('Guardando etiqueta:', newTagName);
		setIsTagModalOpen(false);
		setNewTagName('');
	};
	return (
		<section className="members-section">
			<div>
				<h2 className="members-title">Miembros
					<img src="/svgs/members.svg" alt="Miembros" className="members-icon" />
					<button className="edit-members-btn" onClick={handleOpenModal}>
						<img src="/svgs/edit-box.svg" alt="Editar miembros" className="edit-members-icon" />
					</button>
				</h2>
				<ul className="members-list">
					<li className="member-item">
						<div className="member-name-section">
							<img src="/svgs/user.svg" alt="Usuario" className="user-icon" />
							<span className="member-name">Miguel Soto Delgado</span>
						</div>
						<span className="member-info">20.430.363-0</span> 
						<span className="member-date">4 de Julio</span>
					</li>
					<li className="member-item">
						<div className="member-name-section">
							<img src="/svgs/user.svg" alt="Usuario" className="user-icon" />
							<span className="member-name">Alvaro Opazo Saavedra</span>
						</div>
						<span className="member-info">21.430.363-0</span> 
						<span className="member-date">8 de Septiembre</span>
					</li>
					<li className="member-item">
						<div className="member-name-section">
							<img src="/svgs/user.svg" alt="Usuario" className="user-icon" />
							<span className="member-name">Javiera Osorio</span>
						</div>
						<span className="member-info">20.430.363-0</span> 
						<span className="member-date">4 de Julio</span>
					</li>
					<li className="member-item">
						<div className="member-name-section">
							<img src="/svgs/user.svg" alt="Usuario" className="user-icon" />
							<span className="member-name">Vicente Alvear</span>
						</div>
						<span className="member-info">21.430.363-0</span> 
						<span className="member-date">8 de Septiembre</span>
					</li>
				</ul>
			</div>
			<div>
				<h2 className="tags-title">
					Etiquetas
					<img src="/svgs/add.svg" alt="Agregar etiqueta" className="tags-icon" />
					<div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
						<button className="add-tag-btn" onClick={handleOpenTagModal}>
							<img src="/svgs/plus2.svg" alt="Agregar etiqueta" className="plus2-icon" />
						</button>
					</div>
				</h2>
				<div className="tags-container">
					<span className="tag">
						Tecnología
						<button className="cancel-tag-btn" onClick={handleRemoveTag}>
							<img src="/svgs/cancel2.svg" alt="Eliminar" className="cancel2-icon" />
						</button>
					</span>
					<span className="tag">
						Industrias
						<button className="cancel-tag-btn" onClick={handleRemoveTag}>
							<img src="/svgs/cancel2.svg" alt="Eliminar" className="cancel2-icon" />
						</button>
					</span>
					<span className="tag">
						Innovacion
						<button className="cancel-tag-btn" onClick={handleRemoveTag}>
							<img src="/svgs/cancel2.svg" alt="Eliminar" className="cancel2-icon" />
						</button>
					</span>
				</div>
			</div>

			{/* Modal para editar miembros */}
			{isModalOpen && (
				<div className="modal-overlay" onClick={handleCloseModal}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						{!isAddMemberMode ? (
							<>
								<div className="modal-header">
									<h3 className="modal-title">
										Editar Miembros
										<button className="add-member-btn" onClick={handleAddMemberClick}>
											<img src="/svgs/add-user.svg" alt="Agregar miembro" className="add-member-icon" />
										</button>
									</h3>
									<button className="modal-close-btn" onClick={handleCloseModal}>
										<img src="/svgs/cancel2.svg" alt="Cerrar" className="modal-close-icon" />
									</button>
								</div>

								{/* Barra de búsqueda */}
								<div className="modal-search-container">
									<div className="modal-search-bar">
										<img src="/svgs/search.svg" alt="Search icon" className="modal-search-icon" />
										<input
											type="text"
											placeholder="Buscar miembro"
											className="modal-search-input"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>

								<div className="modal-member-list">
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Miguel Soto Delgado</div>
											<div className="modal-member-rut">20.430.363-0</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Alvaro Opazo Saavedra</div>
											<div className="modal-member-rut">21.430.363-0</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Javiera Osorio</div>
											<div className="modal-member-rut">20.430.363-0</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Vicente Alvear</div>
											<div className="modal-member-rut">21.430.363-0</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Ana García López</div>
											<div className="modal-member-rut">19.123.456-7</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">Carlos Rodríguez Pérez</div>
											<div className="modal-member-rut">18.987.654-3</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
									<div className="modal-member-item">
										<div className="modal-member-info">
											<div className="modal-member-name">María González Silva</div>
											<div className="modal-member-rut">22.345.678-9</div>
										</div>
										<button className="delete-member-btn">
											<img src="/svgs/delete-member.svg" alt="Eliminar miembro" className="delete-member-icon" />
										</button>
									</div>
								</div>
							</>
						) : (
							<>
								<div className="modal-header">
									<h3 className="modal-title">Agregar Miembro</h3>
									<button className="modal-close-btn" onClick={handleCloseModal}>
										<img src="/svgs/cancel2.svg" alt="Cerrar" className="modal-close-icon" />
									</button>
								</div>

								<form className="modal-form">
									<div className="modal-form-field">
										<label className="form-label">Nombre completo</label>
										<input 
											type="text"
											className="form-input" 
											placeholder="Ingrese el nombre completo"
											value={newMemberName}
											onChange={(e) => setNewMemberName(e.target.value)}
										/>
									</div>
									<div className="modal-form-field">
										<label className="form-label">RUT</label>
										<input 
											type="text"
											className="form-input" 
											placeholder="Formato: 12345678-9"
											value={newMemberRut}
											onChange={(e) => setNewMemberRut(e.target.value)}
										/>
									</div>
								</form>

								<div className="modal-form-buttons">
									<button className="modal-btn modal-btn-cancel" onClick={handleBackToList}>
										Cancelar
									</button>
									<button className="modal-btn modal-btn-save" onClick={handleSaveMember}>
										Guardar
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Modal para agregar etiquetas */}
			{isTagModalOpen && (
				<div className="modal-overlay" onClick={handleCloseTagModal}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3 className="modal-title">Agregar Etiqueta</h3>
							<button className="modal-close-btn" onClick={handleCloseTagModal}>
								<img src="/svgs/cancel2.svg" alt="Cerrar" className="modal-close-icon" />
							</button>
						</div>

						<form className="modal-form">
							<div className="modal-form-field">
								<input 
									type="text"
									className="form-input" 
									placeholder="Ingrese el nombre de la etiqueta"
									value={newTagName}
									onChange={(e) => setNewTagName(e.target.value)}
								/>
							</div>
						</form>

						<div className="modal-form-buttons">
							<button className="modal-btn modal-btn-cancel" onClick={handleCloseTagModal}>
								Cancelar
							</button>
							<button className="modal-btn modal-btn-save" onClick={handleSaveTag}>
								Guardar
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Members;