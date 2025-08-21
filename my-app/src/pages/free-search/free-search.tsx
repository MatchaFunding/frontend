
import NavBar from '../../components/NavBar/navbar.tsx';
import FundingCard from '../../components/funding-card/funding-card.tsx';

function FreeSearch() {
	const cards = [
	  { matchPercent: 87, title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP' },
	  { matchPercent: 68, title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP' },
	  { matchPercent: 50, title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP' },
	  { matchPercent: 32, title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP' },
	  { matchPercent: 4,  title: 'Fondo de Innovación Educativaaaaaaaaaaaaaaaaaaaaaa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativoaaaaaaaaaaaaaaaaaaaaaaaa.', topic: 'Educación', amount: '150.000.000', currency: 'CLP' },
	];
	return (
		<div className="min-h-screen bg-[#e6e8e3] flex flex-col">
			{/* Header */}
			<NavBar />

			{/* Searchbar */}
			<div className="flex justify-center mt-8">
				<div className="w-full max-w-xl flex items-center bg-[#f5f1e7] rounded-full shadow px-4 py-2">
					<svg className="w-5 h-5 text-[#a6b96b] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
					<input
						type="text"
						placeholder="Busca tu fondo manualmente"
						className="bg-transparent outline-none flex-1 text-gray-700 placeholder-[#bdbdbd] text-base"
					/>
				</div>
			</div>

			{/* Ejemplo de múltiples FundingCard */}
			<div className="flex justify-center mt-8 gap-6 flex-wrap">
				{cards.map((card, idx) => (
					<FundingCard key={idx} {...card} />
				))}
			</div>
		</div>
	);
}

export default FreeSearch;
