import type { CardsPerPageOption } from '../../components/filters-component/filters-component.ts';
import type { FiltersValues } from '../../components/filters-component/filters-component.ts';
import type { OrderOption } from '../../components/filters-component/filters-component.ts';
import { useState, useMemo, useEffect } from 'react';
import { initialFilters, filterCards } from './free-search';
import { sortCards, mapInstrumentsToCards } from './free-search';
import { searchProjectsByText, mapProyectosToCards } from './free-search';
import { getPaginatedCards, calculatePagination } from './free-search';
import { searchCardsByText, createHandlePageChange } from './free-search';
import FreeSearchCard from '../../components/free-search-card/free-search-card.tsx';
import FiltersComponent from '../../components/filters-component/filters-component.tsx';
import VerTodosLosInstrumentos from '../../api/VerTodosLosInstrumentos.tsx';
import VerTodosLosProyectos from '../../api/VerTodosLosProyectos.tsx';
import FreeSearchCardProject from '../../components/free-search-card-project/free-search-card-project.tsx';
import NavBar from '../../components/NavBar/navbar';
import './free-search.css';

function FreeSearch() {
	const [order, setOrder] = useState<OrderOption>('none');
	const [page, setPage] = useState(1);
	const [cardsPerPage, setCardsPerPage] = useState<CardsPerPageOption>(8);
	const [filters, setFilters] = useState<FiltersValues>(initialFilters);
	const [searchTerm, setSearchTerm] = useState('');
	const [activeView, setActiveView] = useState<'fondos' | 'proyectos'>('fondos');
	const [isAnimating, setIsAnimating] = useState(false);
	const [animatingFrom, setAnimatingFrom] = useState<'fondos' | 'proyectos' | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(0);
	
	const instrumentos = VerTodosLosInstrumentos();
	const proyectos = VerTodosLosProyectos();
	
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
	
	const handleViewChange = (newView: 'fondos' | 'proyectos') => {
		if (newView === activeView || isAnimating) return;
		
		setIsAnimating(true);
		setAnimatingFrom(activeView);
		
		// Después de 200ms (cuando termina la animación "out"), cambiamos la vista
		setTimeout(() => {
			setActiveView(newView);
			setTimeout(() => {
				setIsAnimating(false);
				setAnimatingFrom(null);
			}, 200);
		}, 200);
	};
	
	const availableCards = useMemo(() => {
		return mapInstrumentsToCards(instrumentos);
	}, [instrumentos]);

	const availableProjectCards = useMemo(() => {
		return mapProyectosToCards(proyectos);
	}, [proyectos]);

	const cards = useMemo(() => {
		let processedCards = searchCardsByText(availableCards, searchTerm);
		let filteredCards = filterCards(processedCards, filters);
		const sortedCards = sortCards(filteredCards, order);
		return sortedCards;
	}, [order, filters, availableCards, searchTerm]);

	const projectCards = useMemo(() => {
		return searchProjectsByText(availableProjectCards, searchTerm);
	}, [availableProjectCards, searchTerm]);

	const paginationData = useMemo(() => {
		const currentCards = activeView === 'fondos' ? cards.length : projectCards.length;
		return calculatePagination(currentCards, cardsPerPage, page);
	}, [cards.length, projectCards.length, cardsPerPage, page, activeView]);

	const { totalPages } = paginationData;

	const paginatedCards = useMemo(() => {
		return getPaginatedCards(cards, page, cardsPerPage);
	}, [cards, page, cardsPerPage]);

	const paginatedProjectCards = useMemo(() => {
		return getPaginatedCards(projectCards, page, cardsPerPage);
	}, [projectCards, page, cardsPerPage]);

	// Calcular cuántas cards "fantasma" necesitamos para completar la última fila
	const cardsWithGhosts = useMemo(() => {
		const currentPaginatedCards = activeView === 'fondos' ? paginatedCards : paginatedProjectCards;
		if (currentPaginatedCards.length === 0) return [];
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
		const remainder = currentPaginatedCards.length % cardsPerRow;
		const ghostCount = remainder === 0 ? 0 : cardsPerRow - remainder;
		
		return [...currentPaginatedCards, ...Array(ghostCount).fill(null)];
	}, [paginatedCards, paginatedProjectCards, activeView]);

	const pageHandlers = useMemo(() => {
		return createHandlePageChange(setPage, totalPages);
	}, [totalPages]);
	
	useEffect(() => {
		setPage(1);
	}, [cardsPerPage, searchTerm, filters]);
	
	useEffect(() => {
		const timeout = setTimeout(() => {
			const cardsContainer = document.querySelector('.flex.justify-center.gap-4.sm\\:gap-6.flex-wrap');
			const firstCard = document.querySelector('.free-search-card');
			
			if (cardsContainer && firstCard) {
				const containerWidth = cardsContainer.getBoundingClientRect().width;
				const cardWidth = firstCard.getBoundingClientRect().width;
				const computedStyle = window.getComputedStyle(cardsContainer);
				const gap = computedStyle.gap;
				
				console.log('===== ANCHO REAL DEL DOM =====');
				console.log('Contenedor de cards (ancho real):', containerWidth);
				console.log('Card individual (ancho real):', cardWidth);
				console.log('Gap entre cards:', gap);
				console.log('==============================');
			}
		}, 100);
		
		return () => clearTimeout(timeout);
	}, [paginatedCards]);
	return (
		<div className="min-h-screen bg-[#f1f5f9] flex flex-col">
			<NavBar />
			<div className="max-w-[95%] sm:max-w-[90%] mx-auto w-full flex-1">
				<div className="w-full px-2 sm:px-4 mt-24 sm:mt-32">
					<div className="max-w-screen-2xl mx-auto flex justify-center">
						{/* Contenedor responsive para searchbar y filtros - mismo ancho que las cards */}
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full" style={{ maxWidth: containerWidth > 0 ? `${containerWidth}px` : 'fit-content' }}>
							{/* Botones de Fondos y Proyectos */}
							<div className="bg-white p-2 sm:p-3 rounded-2xl shadow-md flex-shrink-0">
								<div className="flex items-center gap-3 h-[48px]">
									<button 
										className={`px-3 rounded-lg font-semibold h-full flex items-center justify-center w-28 ${
											activeView === 'fondos' 
												? 'bg-[#44624a] text-white hover:bg-[#3a5340]' 
												: 'text-[#44624a] hover:bg-[rgba(139,168,136,0.3)]'
										} ${
											isAnimating && animatingFrom === 'fondos' ? 'btn-swipe-out-left' : ''
										} ${
											isAnimating && animatingFrom === 'proyectos' && activeView === 'fondos' ? 'btn-swipe-in-right' : ''
										}`}
										style={{ backgroundColor: activeView !== 'fondos' ? 'rgba(139, 168, 136, 0.2)' : undefined }}
										onClick={() => handleViewChange('fondos')}
										disabled={isAnimating}
									>
										Fondos
									</button>
									<svg 
										width="24" 
										height="24" 
										viewBox="0 0 24 24" 
										fill="none" 
										xmlns="http://www.w3.org/2000/svg" 
										className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
										onClick={() => handleViewChange(activeView === 'fondos' ? 'proyectos' : 'fondos')}
										role="button"
										aria-label="Intercambiar vista"
									>
										<path d="M16,16L16,12L21,17L16,22L16,18L4,18L4,16L16,16ZM8,2L8,5.9990234375L20,6L20,8L8,8L8,12L3,7L8,2Z" fill="#44624a"/>
									</svg>
									<button 
										className={`px-3 rounded-lg font-semibold h-full flex items-center justify-center w-28 ${
											activeView === 'proyectos' 
												? 'bg-[#44624a] text-white hover:bg-[#3a5340]' 
												: 'text-[#44624a] hover:bg-[rgba(139,168,136,0.3)]'
										} ${
											isAnimating && animatingFrom === 'proyectos' ? 'btn-swipe-out-right' : ''
										} ${
											isAnimating && animatingFrom === 'fondos' && activeView === 'proyectos' ? 'btn-swipe-in-left' : ''
										}`}
										style={{ backgroundColor: activeView !== 'proyectos' ? 'rgba(139, 168, 136, 0.2)' : undefined }}
										onClick={() => handleViewChange('proyectos')}
										disabled={isAnimating}
									>
										Proyectos
									</button>
								</div>
							</div>
							{/* Searchbar - Se expande para llenar el espacio disponible */}
							<div className="bg-white p-2 sm:p-3 rounded-2xl shadow-md flex-1">
								<div className="relative w-full">
									<div className="flex items-center bg-[rgba(241,245,249,1)] border border-[rgba(80,81,67,0.3)] rounded-lg py-3 pl-4 pr-4">
										<img src="/svgs/search.svg" alt="Search icon" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(329%) hue-rotate(202deg) brightness(94%) contrast(87%)' }} />
										<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={activeView === 'fondos' ? 'Busca tu fondo manualmente' : 'Busca tu proyecto manualmente'} className="w-full bg-transparent focus:outline-none focus:ring-0 text-sm md:text-base" />
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
				<div className="w-full px-2 sm:px-4">
					<div className="max-w-screen-2xl mx-auto flex justify-center">
						{/* Cards paginadas - Solo se muestran cuando está activo "Fondos" */}
						{activeView === 'fondos' && (
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
												'Cargando instrumentos...' : 
												'No se encontraron instrumentos que coincidan con tu búsqueda'
											}
										</p>
									</div>
								)}
							</div>
						)}
						
						{/* Vista de Proyectos - Se mostrará cuando esté activo "Proyectos" */}
						{activeView === 'proyectos' && (
							<div className="flex justify-center gap-4 sm:gap-6 flex-wrap" style={{ marginTop: '60px', maxWidth: 'fit-content' }}>
								{paginatedProjectCards.length > 0 ? (
									cardsWithGhosts.map((card, idx) => (
										card === null ? (
											<div key={`ghost-${idx}`} className="w-full sm:w-[19rem] max-w-[20rem] invisible"></div>
										) : (
											<FreeSearchCardProject key={idx + (page - 1) * cardsPerPage} {...card} />
										)
									))
								) : (
									<div className="text-center py-12 sm:py-20 px-4">
										<p className="text-gray-500 text-base sm:text-lg">
											{proyectos.length === 0 ? 
												'Cargando proyectos...' : 
												'No se encontraron proyectos que coincidan con tu búsqueda'
											}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
					
					{/* Paginación debajo de las cards - Fuera del contenedor con max-width */}
					{((activeView === 'fondos' && paginatedCards.length > 0) || (activeView === 'proyectos' && paginatedProjectCards.length > 0)) && (
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
}export default FreeSearch;
export { FreeSearch };
