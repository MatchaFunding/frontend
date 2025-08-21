import React from 'react';

const NavBar: React.FC = () => {
  return (
    <header className="bg-[#a6b96b] flex items-center px-8 py-3">
      <span className="text-[#8b9b5a] text-sm mr-6">mainpage</span>
      <span className="text-white font-bold text-xl mr-8">MatchaFunding</span>
      <div className="flex-1 flex items-center">
        <div className="mx-auto flex flex-col items-center">
          <span className="text-white font-semibold text-lg">Búsqueda libre</span>
          <span className="text-[#e6e8e3] text-xs">Busca fondos de forma libre</span>
        </div>
      </div>
      <button className="ml-auto bg-white text-[#a6b96b] px-4 py-1 rounded-full font-semibold">Mi cuenta</button>
    </header>
  );
};

export default NavBar;
