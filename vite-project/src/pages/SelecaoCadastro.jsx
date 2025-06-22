import React from 'react';
import { Link } from 'react-router-dom';

const SelecaoCadastro = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-8">Selecione seu tipo de cadastro</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Aluno */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xs text-center">
                    <h3 className="text-xl font-semibold mb-3">Aluno</h3>
                    <p className="mb-4 text-gray-600">Busco orientação profissional para meus treinos</p>
                    <Link
                        to="/cadastro/aluno"
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Cadastrar como Aluno
                    </Link>
                </div>

                {/* Card Personal Trainer */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xs text-center">
                    <h3 className="text-xl font-semibold mb-3">Personal Trainer</h3>
                    <p className="mb-4 text-gray-600">Ofereço serviços de treinamento físico</p>
                    <Link
                        to="/cadastro/personal"
                        className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Cadastrar como Personal
                    </Link>
                </div>

                {/* Card Nutricionista */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xs text-center">
                    <h3 className="text-xl font-semibold mb-3">Nutricionista</h3>
                    <p className="mb-4 text-gray-600">Ofereço orientação nutricional</p>
                    <Link
                        to="/cadastro/nutricionista"
                        className="inline-block bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        Cadastrar como Nutricionista
                    </Link>
                </div>
            </div>

            <div className="mt-8">
                <Link to="/login" className="text-blue-500 hover:underline">
                    Voltar para login
                </Link>
            </div>
        </div>
    );
};

export default SelecaoCadastro;