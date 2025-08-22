import React, { useState, useRef, useEffect } from 'react';
import './filters-component.css';


export type OrderOption = 'none' | 'title-asc' | 'amount-desc' | 'amount-asc';

interface FiltersComponentProps {
  order: OrderOption;
  setOrder: (order: OrderOption) => void;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({ order, setOrder }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const orderOptions = [
    { value: 'none', label: 'Sin orden' },
    { value: 'title-asc', label: 'Alfabéticamente por título' },
    { value: 'amount-desc', label: 'Amount (mayor a menor valor)' },
    { value: 'amount-asc', label: 'Amount (menor a mayor valor)' },
  ];

  return (
    <div className="filters-container">
      <button className="filter-btn">Filtros</button>
      <div className="filter-dropdown" ref={dropdownRef} style={{position: 'relative'}}>
        <button
          className="filter-btn"
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          Ordenar por
        </button>
        {open && (
          <div className="dropdown-menu">
            {orderOptions.map(opt => (
              <div
                key={opt.value}
                className={`dropdown-item${order === opt.value ? ' selected' : ''}`}
                onClick={() => { setOrder(opt.value as OrderOption); setOpen(false); }}
                role="option"
                aria-selected={order === opt.value}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') { setOrder(opt.value as OrderOption); setOpen(false); }}}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="filter-btn">Mostrar</button>
    </div>
  );
};

export default FiltersComponent;
