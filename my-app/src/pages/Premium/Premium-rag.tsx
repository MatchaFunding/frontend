import { useState, useMemo, useEffect } from 'react';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import FiltersComponent from '../../components/filters-component/filters-component.tsx';
import NavBar from '../../components/NavBar/navbar';
import type { FiltersValues, OrderOption, CardsPerPageOption } from '../../components/filters-component/filters-component.ts';
import { initialFilters, filterCards, sortCards, mapInstrumentsToCards, getPaginatedCards, calculatePagination, searchCardsByText, createHandlePageChange } from '../free-search/free-search';
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';

function PremiumRag() {
	const [order, setOrder] = useState<OrderOption>('none');
	const [page, setPage] = useState(1);
	const [cardsPerPage, setCardsPerPage] = useState<CardsPerPageOption>(8);
	const [filters, setFilters] = useState<FiltersValues>(initialFilters);
	const [searchTerm, setSearchTerm] = useState('');
	const [containerWidth, setContainerWidth] = useState<number>(0);
	const instrumentos = VerTodosLosInstrumentos();
	
	// Calcular el ancho del contenedor basado en el tamaño de la ventana
	useEffect(() => {
		const calculateContainerWidth = () => {
			const windowWidth = window.innerWidth;
			const cardWidth = windowWidth >= 640 ? 304 : 320; 
			
			const gapSmall = 16; 
			const gapLarge = 24; 
			const currentGap = windowWidth >= 640 ? gapLarge : gapSmall;
		
			const containerPercentage = windowWidth >= 640 ? 0.90 : 0.95;
			let containerWidth = windowWidth * containerPercentage;
			
			const maxScreenWidth = 1536;
			if (containerWidth > maxScreenWidth) {
				containerWidth = maxScreenWidth;
			}

			const paddingPerSide = windowWidth >= 640 ? 16 : 8;
			const totalPadding = paddingPerSide * 2;
			
			const availableWidth = containerWidth - totalPadding;
			
			let cardsPerRow = Math.floor((availableWidth + currentGap) / (cardWidth + currentGap));
			cardsPerRow = Math.max(1, cardsPerRow); 
			
			const totalWidth = (cardsPerRow * cardWidth) + ((cardsPerRow - 1) * currentGap);
			
			setContainerWidth(totalWidth);
		};
		
		calculateContainerWidth();
		window.addEventListener('resize', calculateContainerWidth);
		return () => window.removeEventListener('resize', calculateContainerWidth);
	}, []);
	
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

	// Calcular cuántas cards "fantasma" necesitamos para completar la última fila
	const cardsWithGhosts = useMemo(() => {
		if (paginatedCards.length === 0) return [];
		const windowWidth = window.innerWidth;
		const cardWidth = windowWidth >= 640 ? 304 : 320;
		const currentGap = windowWidth >= 640 ? 24 : 16;
		const containerPercentage = windowWidth >= 640 ? 0.90 : 0.95;
		let containerWidth = windowWidth * containerPercentage;
		const maxScreenWidth = 1536;
		if (containerWidth > maxScreenWidth) {
			containerWidth = maxScreenWidth;
		}
		const paddingPerSide = windowWidth >= 640 ? 16 : 8;
		const totalPadding = paddingPerSide * 2;
		const availableWidth = containerWidth - totalPadding;
		let cardsPerRow = Math.floor((availableWidth + currentGap) / (cardWidth + currentGap));
		cardsPerRow = Math.max(1, cardsPerRow);
		
		// Calcular cuántas cards fantasma necesitamos
		const remainder = paginatedCards.length % cardsPerRow;
		const ghostCount = remainder === 0 ? 0 : cardsPerRow - remainder;
		
		return [...paginatedCards, ...Array(ghostCount).fill(null)];
	}, [paginatedCards]);

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
				{/* Título Premium RAG */}
				<div className="w-full px-2 sm:px-4 mt-24 sm:mt-32 mb-8">
					<div className="max-w-screen-2xl mx-auto flex justify-center">
						<div className="text-center">
							<h1 className="text-3xl md:text-4xl font-bold text-[#44624a] mb-2">
								RAG Premium - Chatea con Documentos
							</h1>
							<p className="text-gray-600 text-lg">
								Pregúntale directo al documento. Asegura tu elegibilidad y no te pierdas nada.
							</p>
						</div>
					</div>
				</div>

				{/* searchbar y filtros */}
				<div className="w-full px-2 sm:px-4">
					<div className="max-w-screen-2xl mx-auto flex justify-center">
						{/* Contenedor responsive para searchbar y filtros - mismo ancho que las cards */}
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full" style={{ maxWidth: containerWidth > 0 ? `${containerWidth}px` : 'fit-content' }}>
							{/* Searchbar - Se expande para llenar el espacio disponible */}
							<div className="bg-white p-2 sm:p-3 rounded-2xl shadow-md flex-1">
								<div className="relative w-full">
									<div className="flex items-center bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-4 pr-4">
										<img src="/svgs/search.svg" alt="Search icon" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(329%) hue-rotate(202deg) brightness(94%) contrast(87%)' }} />
										<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Busca tu fondo con IA avanzada" className="w-full bg-transparent focus:outline-none focus:ring-0 text-sm md:text-base" />
									</div>
								</div>
							</div>
							{/* Filtros */}
							<div className="bg-white p-2 sm:p-3 rounded-2xl shadow-md flex-shrink-0">
								<FiltersComponent order={order} setOrder={setOrder} cardsPerPage={cardsPerPage} setCardsPerPage={setCardsPerPage} filters={filters} onApplyFilters={setFilters} />
							</div>
						</div>
					</div>
				</div>

				{/* Contenedor principal con ancho limitado para las cards */}
				<div className="w-full px-2 sm:px-4">
					<div className="max-w-screen-2xl mx-auto flex justify-center">
						{/* Cards paginadas */}
						<div className="flex justify-center gap-4 sm:gap-6 flex-wrap" style={{ marginTop: '60px', maxWidth: 'fit-content' }}>
							{paginatedCards.length > 0 ? (
								cardsWithGhosts.map((card, idx) => (
									card === null ? (
										<div key={`ghost-${idx}`} className="w-full sm:w-[19rem] max-w-[20rem] invisible"></div>
									) : (
										<FreeSearchCard key={idx + (page - 1) * cardsPerPage} {...card} />
									)
								))
							) : (
								<div className="text-center py-12 sm:py-20 px-4">
									<p className="text-gray-500 text-base sm:text-lg">
										{instrumentos.length === 0 ? 
											'Cargando fondos...' : 
											'No se encontraron fondos que coincidan con tu búsqueda'
										}
									</p>
								</div>
							)}
						</div>
					</div>
					
					{/* Paginación debajo de las cards */}
					{paginatedCards.length > 0 && (
						<div className="flex justify-center py-4 gap-1 sm:gap-2 flex-wrap" style={{ marginTop: '40px' }}>
							{/* Flecha izquierda */}
							<button className={`px-2 sm:px-3 py-2 rounded-full font-semibold border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#8ba888] border-[#8ba888]'}`} onClick={() => pageHandlers.goToPrevious(page)} disabled={page === 1} aria-label="Anterior">
								<img src="/svgs/right-arrow.svg" alt="Anterior" className="w-3 h-3 sm:w-4 sm:h-4" style={{ transform: 'rotate(180deg)', filter: page === 1 ? 'brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(96%)' : 'brightness(0) saturate(100%) invert(63%) sepia(15%) saturate(357%) hue-rotate(73deg) brightness(95%) contrast(88%)' }} />
							</button>
							{/* Página actual */}
							<button className={`px-2 sm:px-3 py-1 rounded-full font-semibold bg-[#8ba888] text-white text-sm`} disabled>
								{page}
							</button>
							{/* Página siguiente */}
							{page + 1 <= totalPages && (
								<button className={`px-2 sm:px-3 py-2 font-semibold text-[#8ba888] hover:bg-gray-100 text-sm`} onClick={() => pageHandlers.goToPage(page + 1)}>
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
					)}
				</div>
			</div>
		</div>
	);
}

export default PremiumRag;
export { PremiumRag };