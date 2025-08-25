
import NavBar from '../../components/NavBar/navbar.tsx';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import type { FreeSearchCard as FreeSearchCardType } from '../../components/free-search-card/free-search-card.ts';
import FiltersComponent from '../../components/filters-component/filters-component.tsx';
import type { OrderOption } from '../../components/filters-component/filters-component.tsx';

import { useState, useMemo } from 'react';

import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';
import Instrumento from '../../models/Instrumento.tsx';

function parseAmount(amount: string): number {
	// Elimina puntos y convierte a número
	return Number(amount.replace(/\./g, ''));
}

const initialCards: FreeSearchCardType[] = [
	{ title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP', image: '/prueba.png' },
	{ title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP', image: '/anid.jpg' },
	{ title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP', image: '/prueba.png' },
	{ title: 'Fondo de Innovación Educativa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativo.', topic: 'Educación', amount: '150.000.000', currency: 'CLP', image: '/anid.jpg' },
	{ title: 'Fondo de Innovación Educativaaaaaaaaaaaaaaaaaaaaaa', description: 'Financiamiento para proyectos que desarrollen soluciones innovadoras en el sector educativoaaaaaaaaaaaaaaaaaaaaaaaa.', topic: 'Educación', amount: '150.000.000', currency: 'CLP', image: '/prueba.png' },
	{ title: 'Fondo Verde Sustentable', description: 'Apoyo financiero para proyectos de energías renovables y sostenibilidad ambiental.', topic: 'Medio Ambiente', amount: '200.000.000', currency: 'CLP', image: '/anid.jpg' },
	{ title: 'Fondo Mujer Emprende', description: 'Financiamiento para emprendimientos liderados por mujeres en cualquier rubro.', topic: 'Emprendimiento', amount: '100.000.000', currency: 'CLP', image: '/prueba.png' },
	{ title: 'Fondo Salud Digital', description: 'Recursos para proyectos de innovación tecnológica en el área de la salud.', topic: 'Salud', amount: '180.000.000', currency: 'CLP', image: '/anid.jpg' },
	{ title: 'Fondo Cultura Viva', description: 'Apoyo a iniciativas culturales y artísticas a nivel nacional.', topic: 'Cultura', amount: '120.000.000', currency: 'CLP', image: '/prueba.png' },
	{ title: 'Fondo Ciencia Joven', description: 'Financiamiento para jóvenes investigadores y proyectos científicos emergentes.', topic: 'Ciencia', amount: '90.000.000', currency: 'CLP', image: '/anid.jpg' },
	// 40 cards inventadas
	...Array.from({ length: 40 }, (_, i) => ({
		title: `Fondo Extra ${i + 1}`,
		description: `Descripción inventada para el fondo número ${i + 1}.`,
		topic: ['Educación', 'Salud', 'Cultura', 'Ciencia', 'Medio Ambiente', 'Emprendimiento'][i % 6],
		amount: `${Math.floor(Math.random() * 200 + 50)}.000.000`,
		currency: 'CLP',
		image: i % 2 === 0 ? '/prueba.png' : '/anid.jpg',
	})),
];

function FreeSearch() {
	const [order, setOrder] = useState<OrderOption>('none');
	const [page, setPage] = useState(1);
	const CARDS_PER_PAGE = 14;

	let instrumentos = VerTodosLosInstrumentos();
	console.log(instrumentos);

	const cards = useMemo(() => {
		let arr = [...initialCards];
		if (order === 'title-asc') {
			arr.sort((a, b) => a.title.localeCompare(b.title));
		} else if (order === 'amount-desc') {
			arr.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
		} else if (order === 'amount-asc') {
			arr.sort((a, b) => parseAmount(a.amount) - parseAmount(b.amount));
		}
		return arr;
	}, [order]);

	const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
	const paginatedCards = cards.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
	return (
		<div className="min-h-screen bg-[#f1ebe1] flex flex-col">
			{/* Header */}
			<NavBar />

			{/* Searchbar */}
			<div className="flex justify-center mt-8">
				<div className="w-full max-w-xl flex items-center bg-white rounded-full shadow px-4 py-2">
					<svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
					<input
						type="text"
						placeholder="Busca tu fondo manualmente"
						className="bg-transparent outline-none flex-1 text-gray-700 placeholder-[#bdbdbd] text-base"
					/>
				</div>
			</div>

			{/* Filtros */}
			<div className="flex mt-2">
				<div className="w-full max-w-xl">
					<FiltersComponent order={order} setOrder={setOrder} />
				</div>
			</div>

			{/* Cards paginadas */}
			<div className="flex justify-center mt-8 gap-6 flex-wrap">
				{paginatedCards.map((card, idx) => (
					<FreeSearchCard key={idx + (page - 1) * CARDS_PER_PAGE} {...card} />
				))}
			</div>

			{/* Paginación debajo de las cards */}
			<div className="flex justify-center py-4 gap-2">
				{/* Flecha izquierda */}
				<button
					className={`px-3 py-2 rounded-full font-semibold border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#989F2B] border-[#989F2B]'}`}
					onClick={() => page > 1 && setPage(page - 1)}
					disabled={page === 1}
					aria-label="Anterior"
				>
					&#8592;
				</button>
						{/* Página actual */}
						<button
							className={`px-4 py-2 rounded-full font-semibold border bg-[#989F2B] text-white`}
							disabled
						>
							{page}
						</button>
						{/* Página siguiente */}
						{page + 1 <= totalPages && (
							<button
								className={`px-4 py-2 rounded-full font-semibold border bg-white text-[#989F2B] border-[#989F2B]`}
								onClick={() => setPage(page + 1)}
							>
								{page + 1}
							</button>
						)}
						{/* Página siguiente +1 */}
						{page + 2 <= totalPages && (
							<button
								className={`px-4 py-2 rounded-full font-semibold border bg-white text-[#989F2B] border-[#989F2B]`}
								onClick={() => setPage(page + 2)}
							>
								{page + 2}
							</button>
						)}
						{/* ... si hay más páginas entre medio */}
						{page + 3 < totalPages && (
							<span className="px-2">...</span>
						)}
						{/* Última página si no es visible como subsiguiente */}
						{totalPages > 1 && page !== totalPages && (page + 2 < totalPages) && (
							<button
								className={`px-4 py-2 rounded-full font-semibold border ${page === totalPages ? 'bg-[#989F2B] text-white' : 'bg-white text-[#989F2B] border-[#989F2B]'}`}
								onClick={() => setPage(totalPages)}
							>
								{totalPages}
							</button>
						)}
				{/* Flecha derecha */}
				<button
					className={`px-3 py-2 rounded-full font-semibold border ${page === totalPages ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#989F2B] border-[#989F2B]'}`}
					onClick={() => page < totalPages && setPage(page + 1)}
					disabled={page === totalPages}
					aria-label="Siguiente"
				>
					&#8594;
				</button>
			</div>
		</div>
	);
}

export default FreeSearch;
