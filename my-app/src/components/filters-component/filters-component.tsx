import React, { useState, useRef, useEffect } from 'react';
import './filters-component.css';
import type {OrderOption, CardsPerPageOption, FiltersValues, FiltersComponentProps} from './filters-component';
import {regionesChile, monedas, tiposBeneficio, estados, orderOptions, showOptions, handleClickOutside, handleKeyDown} from './filters-component';

const FiltersComponent: React.FC<FiltersComponentProps> = ({ order, setOrder, cardsPerPage, setCardsPerPage, filters, onApplyFilters }) => {
  const [openOrder, setOpenOrder] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [openBenefitType, setOpenBenefitType] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [tempFilters, setTempFilters] = useState<FiltersValues>(filters);
  
  const dropdownOrderRef = useRef<HTMLDivElement>(null);
  const dropdownShowRef = useRef<HTMLDivElement>(null);
  const filtersSectionRef = useRef<HTMLDivElement>(null);
  const dropdownRegionRef = useRef<HTMLDivElement>(null);
  const dropdownCurrencyRef = useRef<HTMLDivElement>(null);
  const dropdownBenefitTypeRef = useRef<HTMLDivElement>(null);
  const dropdownStatusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  useEffect(() => {
    const refs = {
      order: dropdownOrderRef,
      show: dropdownShowRef,
      filters: filtersSectionRef,
      region: dropdownRegionRef,
      currency: dropdownCurrencyRef,
      benefitType: dropdownBenefitTypeRef,
      status: dropdownStatusRef
    };
    
    const setters = {
      order: setOpenOrder,
      show: setOpenShow,
      filters: setOpenFilters,
      region: setOpenRegion,
      currency: setOpenCurrency,
      benefitType: setOpenBenefitType,
      status: setOpenStatus
    };

    const handleClick = (event: MouseEvent) => handleClickOutside(event, refs, setters);
    
    if (openOrder || openShow || openFilters || openRegion || openCurrency || openBenefitType || openStatus) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openOrder, openShow, openFilters, openRegion, openCurrency, openBenefitType, openStatus]);

  return (
    <div className="filters-main-container">
      <div className="filters-container">
        <button className="filter-btn" onClick={() => { setOpenFilters(true); setTempFilters(filters); }}>
          Filtros
          <img src="/svgs/filter.svg" alt="Filter icon" style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }} />
        </button>
        <div className="filter-dropdown" ref={dropdownOrderRef}>
          <button className="filter-btn" type="button" onClick={() => setOpenOrder(o => !o)} aria-haspopup="listbox" aria-expanded={openOrder}>
            Ordenar
            <img src="/svgs/arrow-up-down.svg" alt="Sort icon" style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }} />
          </button>
          {openOrder && (
            <div className="dropdown-menu">
              {orderOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`dropdown-item${order === opt.value ? ' selected' : ''}${opt.decorative ? ' decorative-item' : ''}`}
                  onClick={() => {
                    if (!opt.decorative) {
                      setOrder(opt.value as OrderOption);
                      setOpenOrder(false);
                    }
                  }}
                  role="option"
                  aria-selected={order === opt.value}
                  tabIndex={0}
                  onKeyDown={e => handleKeyDown(e, () => {
                    setOrder(opt.value as OrderOption);
                    setOpenOrder(false);
                  }, opt.decorative)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="filter-dropdown" ref={dropdownShowRef}>
          <button className="filter-btn" type="button" onClick={() => setOpenShow(o => !o)} aria-haspopup="listbox" aria-expanded={openShow}>
            Mostrar
            <img src="/svgs/3-points.svg" alt="Show icon" style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }} />
          </button>
          {openShow && (
            <div className="dropdown-menu">
              {showOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`dropdown-item${cardsPerPage === opt.value ? ' selected' : ''}`}
                  onClick={() => { setCardsPerPage(opt.value as CardsPerPageOption); setOpenShow(false); }}
                  role="option"
                  aria-selected={cardsPerPage === opt.value}
                  tabIndex={0}
                  onKeyDown={e => handleKeyDown(e, () => {
                    setCardsPerPage(opt.value as CardsPerPageOption);
                    setOpenShow(false);
                  })}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {openFilters && (
        <div className="filters-section" ref={filtersSectionRef}>
          <form
            onSubmit={e => {
                e.preventDefault();
                onApplyFilters(tempFilters);
                setOpenFilters(false);
              }}
          >
            <div className="filters-fields-container">
              {/* Fila 1: Región */}
              <div className="filter-row">
                <div className="region-container">
                  <label>Región<br/>
                    <div ref={dropdownRegionRef} className="region-dropdown-container">
                      <button
                        className="custom-select region-select"
                        type="button"
                        onClick={() => setOpenRegion(o => !o)}
                      >
                        {tempFilters.region || 'Todas'}
                      </button>
                      {openRegion && (
                        <div className="dropdown-menu">
                          <div
                            className={`dropdown-item${tempFilters.region === '' ? ' selected' : ''}`}
                            onClick={() => {
                              setTempFilters(f => ({...f, region: ''}));
                              setOpenRegion(false);
                            }}
                          >
                            Todas
                          </div>
                          {regionesChile.map(r => (
                            <div
                              key={r}
                              className={`dropdown-item${tempFilters.region === r ? ' selected' : ''}`}
                              onClick={() => {
                                setTempFilters(f => ({...f, region: r}));
                                setOpenRegion(false);
                              }}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Fila 2: Rango de monto */}
              <div className="filter-row">
                <div className="amount-range-container">
                  <label>Rango de monto<br/>
                    <div className="amount-inputs-container">
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={tempFilters.amountMin}
                        min={0}
                        onChange={e => setTempFilters(f => ({...f, amountMin: e.target.value}))}
                        className="custom-input amount-input"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Máximo"
                        value={tempFilters.amountMax}
                        min={0}
                        onChange={e => setTempFilters(f => ({...f, amountMax: e.target.value}))}
                        className="custom-input amount-input"
                      />
                      <div ref={dropdownCurrencyRef} className="currency-dropdown-container">
                        <button
                          className="custom-select currency-select"
                          type="button"
                          onClick={() => setOpenCurrency(o => !o)}
                        >
                          {tempFilters.currency}
                        </button>
                        {openCurrency && (
                          <div className="dropdown-menu">
                            {monedas.map(m => (
                              <div
                                key={m}
                                className={`dropdown-item${tempFilters.currency === m ? ' selected' : ''}`}
                                onClick={() => {
                                  setTempFilters(f => ({...f, currency: m}));
                                  setOpenCurrency(false);
                                }}
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Fila 3: Tipo de beneficio y Estado */}
              <div className="benefit-status-row">
                <div className="flex-container">
                  <label>Tipo de beneficio<br/>
                    <div ref={dropdownBenefitTypeRef} className="dropdown-container">
                      <button
                        className="custom-select full-width-select"
                        type="button"
                        onClick={() => setOpenBenefitType(o => !o)}
                      >
                        {tempFilters.benefitType || 'Todos'}
                      </button>
                      {openBenefitType && (
                        <div className="dropdown-menu">
                          <div
                            className={`dropdown-item${tempFilters.benefitType === '' ? ' selected' : ''}`}
                            onClick={() => {
                              setTempFilters(f => ({...f, benefitType: ''}));
                              setOpenBenefitType(false);
                            }}
                          >
                            Todos
                          </div>
                          {tiposBeneficio.map(t => (
                            <div
                              key={t}
                              className={`dropdown-item${tempFilters.benefitType === t ? ' selected' : ''}`}
                              onClick={() => {
                                setTempFilters(f => ({...f, benefitType: t}));
                                setOpenBenefitType(false);
                              }}
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                <div className="flex-container">
                  <label>Estado<br/>
                    <div ref={dropdownStatusRef} className="dropdown-container">
                      <button
                        className="custom-select full-width-select"
                        type="button"
                        onClick={() => setOpenStatus(o => !o)}
                      >
                        {tempFilters.status || 'Todos'}
                      </button>
                      {openStatus && (
                        <div className="dropdown-menu">
                          <div
                            className={`dropdown-item${tempFilters.status === '' ? ' selected' : ''}`}
                            onClick={() => {
                              setTempFilters(f => ({...f, status: ''}));
                              setOpenStatus(false);
                            }}
                          >
                            Todos
                          </div>
                          {estados.map(e => (
                            <div
                              key={e}
                              className={`dropdown-item${tempFilters.status === e ? ' selected' : ''}`}
                              onClick={() => {
                                setTempFilters(f => ({...f, status: e}));
                                setOpenStatus(false);
                              }}
                            >
                              {e}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="buttons-container">
              <button type="button" className="filter-btn-cancel" onClick={() => {
                setTempFilters(filters);
                setOpenFilters(false);
              }}>Cancelar</button>
              <button type="submit" className="filter-btn">Aplicar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FiltersComponent;
