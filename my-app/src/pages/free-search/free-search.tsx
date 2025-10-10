
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
			{/* Contenedor principal responsive */}
			<div className="max-w-[95%] sm:max-w-[90%] mx-auto w-full flex-1">
				{/* searchbar y filtros */}
				<div className="w-full px-2 sm:px-4 mt-24 sm:mt-32">
					<div className="max-w-screen-2xl mx-auto">
						{/* Contenedor responsive para searchbar y filtros */}
						<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
							{/* Searchbar */}
							<div className="flex items-center bg-white shadow px-3 sm:px-4 py-2 w-full lg:flex-1 lg:mr-4" style={{ borderRadius: '8px' }}>
								<img src="/svgs/search.svg" alt="Search icon" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(329%) hue-rotate(202deg) brightness(94%) contrast(87%)' }} />
								<input type="text" placeholder="Busca tu fondo manualmente" className="bg-transparent outline-none flex-1 text-gray-700 placeholder-[#bdbdbd] text-sm sm:text-base" value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							{/* Filtros */}
							<div className="w-full lg:w-auto lg:flex-shrink-0">
								<FiltersComponent order={order} setOrder={setOrder} cardsPerPage={cardsPerPage} setCardsPerPage={setCardsPerPage} filters={filters} onApplyFilters={setFilters} />
							</div>
						</div>
					</div>
				</div>

				{/* Contenedor principal con ancho limitado para las cards */}
				<div className="w-full px-2 sm:px-4">
					{/* Cards paginadas */}
					<div className="flex justify-center gap-4 sm:gap-6 flex-wrap" style={{ marginTop: '60px' }}>
						{paginatedCards.length > 0 ? (
							paginatedCards.map((card, idx) => (
								<FreeSearchCard key={idx + (page - 1) * cardsPerPage} {...card} />
							))
						) : (
							<div className="text-center py-12 sm:py-20 px-4">
								<p className="text-gray-500 text-base sm:text-lg">
									{instrumentos.length === 0 ? 
										'Cargando instrumentos...' : 
										'No se encontraron instrumentos que coincidan con tu búsqueda'
									}
								</p>
							</div>
						)}
					</div>

					{/* Paginación debajo de las cards */}
					<div className="flex justify-center py-4 gap-1 sm:gap-2 flex-wrap" style={{ marginTop: '40px' }}>
						{/* Flecha izquierda */}
						<button className={`px-2 sm:px-3 py-2 rounded-full font-semibold border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#8ba888] border-[#8ba888]'}`} onClick={() => pageHandlers.goToPrevious(page)} disabled={page === 1} aria-label="Anterior">
							<img src="/svgs/right-arrow.svg" alt="Anterior" className="w-3 h-3 sm:w-4 sm:h-4" style={{ transform: 'rotate(180deg)', filter: page === 1 ? 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(96%)' : 'brightness(0) saturate(100%) invert(63%) sepia(15%) saturate(357%) hue-rotate(73deg) brightness(95%) contrast(88%)' }} />
						</button>
								{/* Página actual */}
								<button
									className={`px-2 sm:px-3 py-1 rounded-full font-semibold bg-[#8ba888] text-white text-sm`}
									disabled
								>
									{page}
								</button>
								{/* Página siguiente */}
								{page + 1 <= totalPages && (
									<button
										className={`px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`}
										onClick={() => pageHandlers.goToPage(page + 1)}
									>
										{page + 1}
									</button>
								)}
								{/* Página siguiente +1 - Solo visible en pantallas medianas y grandes */}
								{page + 2 <= totalPages && (
									<button
										className={`hidden sm:block px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`}
										onClick={() => pageHandlers.goToPage(page + 2)}
									>
										{page + 2}
									</button>
								)}
								{/* ... si hay más páginas entre medio - Solo visible en pantallas medianas y grandes */}
								{page + 3 < totalPages && (
									<span className="hidden sm:inline px-2">...</span>
								)}
								{/* Última página si no es visible como subsiguiente - Solo visible en pantallas medianas y grandes */}
								{totalPages > 1 && page !== totalPages && (page + 2 < totalPages) && (
									<button
										className={`hidden sm:block px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`}
										onClick={() => pageHandlers.goToPage(totalPages)}
									>
										{totalPages}
									</button>
								)}
						{/* Flecha derecha */}
						<button
							className={`px-2 sm:px-3 py-2 rounded-full font-semibold border ${page === totalPages ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#8ba888] border-[#8ba888]'}`}
							onClick={() => pageHandlers.goToNext(page)}
							disabled={page === totalPages}
							aria-label="Siguiente"
						>
							<img src="/svgs/right-arrow.svg" alt="Siguiente" className="w-3 h-3 sm:w-4 sm:h-4" style={{ filter: page === totalPages ? 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(96%)' : 'brightness(0) saturate(100%) invert(63%) sepia(15%) saturate(357%) hue-rotate(73deg) brightness(95%) contrast(88%)' }} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FreeSearch;
export { FreeSearch };
