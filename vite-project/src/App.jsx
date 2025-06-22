import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroAluno from './pages/CadastroAluno';
import CadastroPersonal from './pages/CadastroPersonal';
import CadastroNutricionista from './pages/CadastroNutri';
import SelecaoCadastro from './pages/SelecaoCadastro'; // Novo componente

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<SelecaoCadastro />} /> {/* Atualizado */}
                <Route path="/cadastro/aluno" element={<CadastroAluno />} />
                <Route path="/cadastro/personal" element={<CadastroPersonal />} />
                <Route path="/cadastro/nutricionista" element={<CadastroNutricionista />} />
                <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl">Página não encontrada</h1></div>} />
            </Routes>
        </Router>
    );
}

export default App;