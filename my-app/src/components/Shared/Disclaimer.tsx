export const DisclaimerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-[90%] text-center shadow-xl">
        <h2 className="text-xl font-bold text-[rgba(80,81,67,1)] mb-4">Aviso Importante</h2>
        <p className="text-[rgba(80,81,67,0.8)] mb-6">
          Los datos provienen de fuentes públicas y que no se garantiza la disponibilidad de todos los años o fondos/históricos.
        </p>
        <button
          onClick={onClose}
          className="bg-[#8ba888] hover:bg-[rgba(68,98,74,0.8)] text-white font-bold py-2 px-6 rounded-xl transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
