import React from 'react';
import Idea from '../../models/Idea';

// Definir el tipo aquí
interface IdeaConRefinamiento extends Idea {
  ResumenLLM?: string;
  FechaRefinamiento?: string;
}

interface IdeaRefinadaModalProps {
  idea: IdeaConRefinamiento;
  isOpen: boolean;
  onClose: () => void;
}

const colorPalette = {
  darkGreen: '#44624a',
  softGreen: '#8ba888',
  mediumGreen: '#c0d4ad',
  lightGreen: '#d5e7cf',
  tan: '#d5ccab',
  oliveGray: '#505143',
  background: '#f8f9fa',
  primary: '#4c7500',
  secondary: '#a3ae3e',
};

const IdeaRefinadaModal: React.FC<IdeaRefinadaModalProps> = ({ idea, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold" style={{ color: colorPalette.darkGreen }}>
              Detalle de la Idea
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Idea Original */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: colorPalette.darkGreen }}>
              💡 Idea Original
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Campo
                </label>
                <p className="p-2 bg-white rounded border text-sm">{idea.Campo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Público Objetivo
                </label>
                <p className="p-2 bg-white rounded border text-sm">{idea.Publico}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Problema que Resuelve
                </label>
                <p className="p-3 bg-white rounded border">{idea.Problema}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Elemento Único/Diferenciador
                </label>
                <p className="p-3 bg-white rounded border">{idea.Innovacion}</p>
              </div>
            </div>
          </div>

          {/* Idea Refinada */}
          {idea.ResumenLLM && (
            <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: colorPalette.primary }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colorPalette.primary }}>
                🚀 Idea Refinada por IA
              </h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
                  {idea.ResumenLLM}
                </p>
              </div>
              {idea.FechaRefinamiento && (
                <p className="text-sm mt-2" style={{ color: colorPalette.oliveGray }}>
                  Refinada el: {new Date(idea.FechaRefinamiento).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {!idea.ResumenLLM && (
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-orange-700 font-medium">
                  Esta idea aún no ha sido refinada por IA
                </span>
              </div>
              <p className="text-orange-600 text-sm mt-2">
                Las ideas creadas con la nueva versión incluyen refinamiento automático por IA.
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: colorPalette.darkGreen }}>
              📊 Información Adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  Fecha de Creación
                </label>
                <p className="text-sm">{new Date(idea.FechaDeCreacion).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colorPalette.oliveGray }}>
                  ID de la Idea
                </label>
                <p className="text-sm font-mono">#{idea.ID}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              // Aquí podrías añadir funcionalidad para editar o crear proyecto
              console.log('Crear proyecto desde idea:', idea.ID);
            }}
            className="px-6 py-2 text-white rounded-lg hover:scale-105 transition-transform"
            style={{ backgroundColor: colorPalette.primary }}
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaRefinadaModal;