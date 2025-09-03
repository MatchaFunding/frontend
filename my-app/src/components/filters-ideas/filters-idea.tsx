import React, { useState, useRef, useEffect } from 'react';
import './filters-idea.css';
import type {OrderOption, FiltersIdeaValues, FiltersIdeaProps} from './filters-idea';
import {camposIdea, publicosObjetivo, orderOptions, handleClickOutside, handleKeyDown} from './filters-idea';

const FiltersIdea: React.FC<FiltersIdeaProps> = ({ filters, onApplyFilters }) => {
  const [openOrder, setOpenOrder] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [openCampo, setOpenCampo] = useState(false);
  const [openPublico, setOpenPublico] = useState(false);
  const [tempFilters, setTempFilters] = useState<FiltersIdeaValues>(filters);
  
  const dropdownOrderRef = useRef<HTMLDivElement>(null);
  const filtersSectionRef = useRef<HTMLDivElement>(null);
  const dropdownCampoRef = useRef<HTMLDivElement>(null);
  const dropdownPublicoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  useEffect(() => {
    const refs = {
      order: dropdownOrderRef,
      filters: filtersSectionRef,
      campo: dropdownCampoRef,
      publico: dropdownPublicoRef
    };
    
    const setters = {
      order: setOpenOrder,
      filters: setOpenFilters,
      campo: setOpenCampo,
      publico: setOpenPublico
    };

    const handleClick = (event: MouseEvent) => handleClickOutside(event, refs, setters);
    
    if (openOrder || openFilters || openCampo || openPublico) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openOrder, openFilters, openCampo, openPublico]);

  const applyFilters = () => {
    onApplyFilters(tempFilters);
    setOpenFilters(false);
  };

  const resetFilters = () => {
    const resetFilters: FiltersIdeaValues = {
      campo: '',
      publico: '',
      orderBy: filters.orderBy,
      searchIdea: '',
      searchCampo: '',
      fechaMin: '',
      fechaMax: ''
    };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
    setOpenFilters(false);
  };

  return (
    <div className="filters-main-container">
      <div className="filters-container">
        
        {/* Botón de Filtros */}
        <button className="filter-btn" onClick={() => { setOpenFilters(true); setTempFilters(filters); }}>
          Filtros
          <img src="/svgs/filter.svg" alt="Filter icon" />
        </button>

        {/* Botón de Ordenar */}
        <div className="filter-dropdown" ref={dropdownOrderRef}>
          <button className="filter-btn" type="button" onClick={() => setOpenOrder(o => !o)} aria-haspopup="listbox" aria-expanded={openOrder}>
            Ordenar
            <img src="/svgs/arrow-up-down.svg" alt="Sort icon" />
          </button>
          {openOrder && (
            <div className="dropdown-menu">
              {orderOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`dropdown-item${filters.orderBy === opt.value ? ' selected' : ''}`}
                  onClick={() => {
                    const newFilters = { ...filters, orderBy: opt.value as OrderOption };
                    onApplyFilters(newFilters);
                    setOpenOrder(false);
                  }}
                  role="option"
                  aria-selected={filters.orderBy === opt.value}
                  tabIndex={0}
                  onKeyDown={e => handleKeyDown(e, () => {
                    const newFilters = { ...filters, orderBy: opt.value as OrderOption };
                    onApplyFilters(newFilters);
                    setOpenOrder(false);
                  })}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Filtros */}
      {openFilters && (
        <div className="filters-section" ref={filtersSectionRef}>
          <div className="filters-fields-container">
            
            {/* Fila 1: Search bars */}
            <div className="filter-row">
              {/* Search bar para Idea/Problema */}
              <div className="search-container">
                <label className="filter-label">Buscar en Idea/Problema:</label>
                <input
                  type="text"
                  placeholder="Buscar texto en idea..."
                  value={tempFilters.searchIdea}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, searchIdea: e.target.value }))}
                  className="search-input"
                />
              </div>

              {/* Search bar para Campo */}
              <div className="search-container">
                <label className="filter-label">Buscar en Campo:</label>
                <input
                  type="text"
                  placeholder="Buscar texto en campo..."
                  value={tempFilters.searchCampo}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, searchCampo: e.target.value }))}
                  className="search-input"
                />
              </div>
            </div>

            {/* Fila 2: Rango de fechas */}
            <div className="filter-row">
              <div className="date-range-container">
                <label className="filter-label">Rango de fechas:</label>
                <div className="date-inputs-container">
                  <input
                    type="date"
                    value={tempFilters.fechaMin}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, fechaMin: e.target.value }))}
                    className="date-input"
                    placeholder="Fecha mínima"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={tempFilters.fechaMax}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, fechaMax: e.target.value }))}
                    className="date-input"
                    placeholder="Fecha máxima"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="filters-actions">
              <button className="btn-reset" onClick={resetFilters}>
                Limpiar filtros
              </button>
              <button className="btn-apply" onClick={applyFilters}>
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersIdea;
