
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProfile from './pages/edit-profile/edit-profile.tsx';
import FreeSearch from './pages/free-search/free-search.tsx';
import SignUp from './pages/sign-up/sign-up.tsx';
import Login from './pages/login/login.tsx';
import MatchaHomePage from './pages/Landing/Mainpage.tsx';
import MyProjects from './pages/Landing/Projects.tsx';
import ProfileI from './pages/Landing/Profile.tsx';
import SelectIdea from './pages/New-idea/Generate-idea.tsx';
import Newmatch from './pages/New-idea/NewMatch.tsx';
import MisProyectos from './pages/New-idea/JustMatch/SelectProject.tsx';
import FondosconPorcentaje from './pages/New-idea/JustMatch/FondosConMatch.tsx';
import DetalleFondo from './pages/New-idea/JustMatch/FondoDetalle.tsx';
import LandingPageTailwind from './pages/Landing/Landing.tsx';
import CreateIdea from './pages/New-idea/Creating-idea/CreateIdea.tsx';
import NuevoProyecto from './pages/New-idea/New-project/Create-project.tsx';
import FondosIdea from './pages/New-idea/Creating-idea/FondoIdea.tsx';
import CrearProyectoMatch from './pages/New-idea/Creating-idea/Proyecto-idea.tsx';
import RetomarIdea from './pages/New-idea/Creating-idea/RetomarIdea.tsx';
import MisProyectosH from './pages/New-idea/Historico/SelectProjectH.tsx';
import ProyectosHistoricosConPorcentaje from './pages/New-idea/Historico/HistoricosConMatch.tsx';
import DetalleProyecto from './pages/New-idea/Historico/HistoricoDetalle.tsx';
import SelectChange from './pages/edit-profile/ChooseToEdit.tsx';
import EditmyProfile from './pages/edit-profile/EditMyprofile.tsx';
import PremiumOptions from './pages/Premium/Premium-options.tsx';
import PremiumRag from './pages/Premium/Premium-rag.tsx';
import RagChat from './pages/Premium/RagChat.tsx';
import CrearProyectoFine from './pages/Premium/ProyectoFinetuning.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageTailwind />} />
        <Route path="/free-search" element={<FreeSearch />} />
        <Route path="/edit?" element={<SelectChange />} />
        <Route path="/edit-profileE" element={<EditProfile />} />
        <Route path="/edit-Myprofile" element={<EditmyProfile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home-i" element={<MatchaHomePage />} />
        <Route path="/Proyectos" element={<MyProjects />} />
        <Route path="/Perfil" element={<ProfileI />} />
        <Route path="/premium" element={<PremiumOptions />} />
        <Route path="/premium/rag" element={<PremiumRag />} />
        <Route path="/premium/rag/:nombreFondo" element={<RagChat />} />
        <Route path="/Matcha/Select-Idea" element={<SelectIdea />} />
        <Route path="/Matcha/Select-Project" element={<MisProyectos />} />
        <Route path="/Matcha/Select-Project/fondos" element={<FondosconPorcentaje />} />
        <Route path="/Matcha/Select-Project/fondos/detalle/:fondoId" element={<DetalleFondo />} />
        <Route path="/Matcha/New-Match" element={<Newmatch />} />
        <Route path="/Matcha/New-idea" element={<CreateIdea />} />
        <Route path="/Matcha/retomar-idea" element={<RetomarIdea />} />
        <Route path="/Matcha/Nuevo-proyecto" element={<CrearProyectoMatch />} />
        <Route path="/Matcha/New-idea/Creating-idea/FondoIdea" element={<FondosIdea />} />
        <Route path="/Matcha/New-idea/Fondo-idea" element={<FondosIdea />} />
        <Route path="/Matcha/New-idea/Fondo-idea/detalle/Nuevo-proyecto" element={<CrearProyectoMatch />} />
        <Route path="/Matcha/Nuevo-proyecto" element={<NuevoProyecto />} />
        <Route path="/Matcha/My-projects" element={<MisProyectosH/>} />
        <Route path="/Matcha/My-projects/proyectos-historicos" element={<ProyectosHistoricosConPorcentaje/>} />
        <Route path="/Matcha/My-projects/proyectos-historicos/Detalle/:proyectoId" element={<DetalleProyecto/>} />
        <Route path="/premium/fine-tuning" element={<CrearProyectoFine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
