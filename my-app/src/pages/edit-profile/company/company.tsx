import React from 'react';
import './company.css';

const Company: React.FC = () => {
	return (
		<section className="company-section">
			<h2 className="company-title">Empresa
				<img src="/svgs/building.svg" alt="Empresa" className="company-icon" />
			</h2>
			<form className="company-form">
				<div>
					<label className="form-label">Razon social</label>
					<input className="form-input" placeholder="Placeholder" />
				</div>
				<div>
					<label className="form-label">RUT</label>
					<input className="form-input" placeholder="Formato: 12345678-9" />
				</div>
				<div>
					<label className="form-label">Representante</label>
					<input className="form-input" placeholder="Placeholder" />
				</div>
				<div>
					<label className="form-label">Fecha de creacion</label>
					<input type="date" className="form-input" />
				</div>
				<div>
					<label className="form-label">Descripcion</label>
					<textarea className="form-input form-textarea" placeholder="Describe tu empresa..." rows={4}></textarea>
				</div>
			</form>
		</section>
	);
};

export default Company;