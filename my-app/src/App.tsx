
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FreeSearch from './pages/free-search/free-search.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/free-search" element={<FreeSearch />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
