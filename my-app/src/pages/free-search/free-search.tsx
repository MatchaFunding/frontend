
import { useState, useMemo, useEffect } from 'react';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import FiltersComponent from '../../components/filters-component/filters-component.tsx';
import type { FiltersValues, OrderOption, CardsPerPageOption } from '../../components/filters-component/filters-component.ts';
import {
  initialFilters,
  initialCards,
  filterCardsByAmount,
  sortCards
} from './free-search';

// Importar funcionalidad del backend
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';

function FreeSearch() {
	const [order, setOrder] = useState<OrderOption>('none');
	const [page, setPage] = useState(1);
	const [cardsPerPage, setCardsPerPage] = useState<CardsPerPageOption>(8);
	const [filters, setFilters] = useState<FiltersValues>(initialFilters);
	const CARDS_PER_PAGE = cardsPerPage;

	// Obtener instrumentos del backend
	const instrumentos = VerTodosLosInstrumentos();

	// Usar datos del backend si están disponibles, sino usar datos iniciales
	const availableCards = useMemo(() => {
		if (instrumentos && instrumentos.length > 0) {
			// Convertir instrumentos del backend al formato de cards
			return instrumentos.map((instrumento: any) => ({
				title: instrumento.Titulo,
				description: instrumento.Descripcion,
				topic: 'General',
				benefit: instrumento.monto ? `${instrumento.monto},${instrumento.moneda || 'CLP'}` : 'Beneficio por consultar',
				image: instrumento.EnlaceDeLaFoto
			}));
		}
		return initialCards;
	}, [instrumentos]);

	const cards = useMemo(() => {
		let filteredCards = filterCardsByAmount(availableCards, filters);
		return sortCards(filteredCards, order);
	}, [order, filters, availableCards]);

	const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
	const paginatedCards = cards.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
	useEffect(() => {
		setPage(1);
	}, [cardsPerPage]);
	return (
		<div className="min-h-screen bg-[#f1ebe1] flex flex-col">
			{/* Header */}

			{/* Searchbar y Filtros */}
			<div className="flex justify-center items-center mt-8 gap-4 px-4">
				{/* Barra de búsqueda */}
				<div className="flex-1 max-w-xl flex items-center bg-white shadow px-4 py-2" style={{ borderRadius: '8px' }}>
					<img src="/svgs/search.svg" alt="Search icon" className="w-5 h-5 text-gray-400 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(329%) hue-rotate(202deg) brightness(94%) contrast(87%)' }} />
					<input
						type="text"
						placeholder="Busca tu fondo manualmente"
						className="bg-transparent outline-none flex-1 text-gray-700 placeholder-[#bdbdbd] text-base"
					/>
				</div>
				
				{/* Componente de filtros */}
				<div className="flex-shrink-0">
					<FiltersComponent
						order={order}
						setOrder={setOrder}
						cardsPerPage={cardsPerPage}
						setCardsPerPage={setCardsPerPage}
						filters={filters}
						onApplyFilters={setFilters}
					/>
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
export { FreeSearch };
