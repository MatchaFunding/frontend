
import { useState, useMemo, useEffect } from 'react';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import FiltersComponent from '../../components/filters-component/filters-component.tsx';
import NavBar from '../../components/NavBar/navbar';
import type { FiltersValues, OrderOption, CardsPerPageOption } from '../../components/filters-component/filters-component.ts';
import { initialFilters, filterCards, sortCards, mapInstrumentsToCards, getPaginatedCards, calculatePagination, searchCardsByText, createHandlePageChange } from './free-search';
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';

function FreeSearch() {
	const [order, setOrder] = useState<OrderOption>('none');
	const [page, setPage] = useState(1);
	const [cardsPerPage, setCardsPerPage] = useState<CardsPerPageOption>(10);
	const [filters, setFilters] = useState<FiltersValues>(initialFilters);
	const [searchTerm, setSearchTerm] = useState('');
	const instrumentos = VerTodosLosInstrumentos();
	const availableCards = useMemo(() => {
		return mapInstrumentsToCards(instrumentos);
	}, [instrumentos]);

	const cards = useMemo(() => {
		let processedCards = searchCardsByText(availableCards, searchTerm);
		let filteredCards = filterCards(processedCards, filters);
		const sortedCards = sortCards(filteredCards, order);
		return sortedCards;
	}, [order, filters, availableCards, searchTerm]);

	const paginationData = useMemo(() => {
		return calculatePagination(cards.length, cardsPerPage, page);
	}, [cards.length, cardsPerPage, page]);

	const { totalPages } = paginationData;

	const paginatedCards = useMemo(() => {
		return getPaginatedCards(cards, page, cardsPerPage);
	}, [cards, page, cardsPerPage]);

	const pageHandlers = useMemo(() => {
		return createHandlePageChange(setPage, totalPages);
	}, [totalPages]);
	useEffect(() => {
		setPage(1);
	}, [cardsPerPage, searchTerm, filters]);
	return (
		<div className="min-h-screen bg-[#f1f5f9] flex flex-col">
			{/* NavBar */}
			<NavBar />
			{/* Contenedor principal con ancho máximo del 90% */}
			<div className="max-w-[90%] mx-auto w-full flex-1">
				{/* searchbar y filtros */}
				<div className="w-full px-4" style={{ marginTop: '120px' }}>
					<div className="max-w-screen-2xl mx-auto flex justify-between items-center">
						{/* Searchbar */}
						<div className="flex items-center bg-white shadow px-4 py-2 flex-1 mr-4" style={{ borderRadius: '8px' }}>
							<img src="/svgs/search.svg" alt="Search icon" className="w-5 h-5 text-gray-400 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(329%) hue-rotate(202deg) brightness(94%) contrast(87%)' }} />
							<input type="text" placeholder="Busca tu fondo manualmente" className="bg-transparent outline-none flex-1 text-gray-700 placeholder-[#bdbdbd] text-base" value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						{/* Filtros */}
						<div className="flex-shrink-0">
							<FiltersComponent order={order} setOrder={setOrder} cardsPerPage={cardsPerPage} setCardsPerPage={setCardsPerPage} filters={filters} onApplyFilters={setFilters} />
						</div>
					</div>
				</div>

				{/* Contenedor principal con ancho limitado para las cards */}
				<div className="w-full px-4">
					{/* Cards paginadas */}
					<div className="flex justify-center gap-6 flex-wrap" style={{ marginTop: '80px' }}>
						{paginatedCards.length > 0 ? (
							paginatedCards.map((card, idx) => (
								<FreeSearchCard key={idx + (page - 1) * cardsPerPage} {...card} />
							))
						) : (
							<div className="text-center py-20">
								<p className="text-gray-500 text-lg">
									{instrumentos.length === 0 ? 
										'Cargando instrumentos...' : 
										'No se encontraron instrumentos que coincidan con tu búsqueda'
									}
								</p>
							</div>
						)}
					</div>

					{/* Paginación debajo de las cards */}
					<div className="flex justify-center py-4 gap-2" style={{ marginTop: '60px' }}>
						{/* Flecha izquierda */}
						<button className={`px-3 py-2 rounded-full font-semibold border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#989F2B] border-[#989F2B]'}`} onClick={() => pageHandlers.goToPrevious(page)} disabled={page === 1} aria-label="Anterior">
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
										onClick={() => pageHandlers.goToPage(page + 1)}
									>
										{page + 1}
									</button>
								)}
								{/* Página siguiente +1 */}
								{page + 2 <= totalPages && (
									<button
										className={`px-4 py-2 rounded-full font-semibold border bg-white text-[#989F2B] border-[#989F2B]`}
										onClick={() => pageHandlers.goToPage(page + 2)}
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
										onClick={() => pageHandlers.goToPage(totalPages)}
									>
										{totalPages}
									</button>
								)}
						{/* Flecha derecha */}
						<button
							className={`px-3 py-2 rounded-full font-semibold border ${page === totalPages ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#989F2B] border-[#989F2B]'}`}
							onClick={() => pageHandlers.goToNext(page)}
							disabled={page === totalPages}
							aria-label="Siguiente"
						>
							&#8594;
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FreeSearch;
export { FreeSearch };
