
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProfile from './pages/edit-profile/edit-profile.tsx';
import FreeSearch from './pages/free-search/free-search.tsx';
import SignUp from './pages/sign-up/sign-up.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/free-search" element={<FreeSearch />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
