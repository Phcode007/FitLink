import React from 'react';

const CadastroAluno = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Cadastro de Aluno</h2>
            <form className="flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Nome"
                    className="border p-2 mb-2 w-64 rounded"
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    className="border p-2 mb-2 w-64 rounded"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="border p-2 mb-2 w-64 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirmação de senha"
                    className="border p-2 mb-2 w-64 rounded"
                />
                <input
                    type="text"
                    placeholder="Objetivo"
                    className="border p-2 mb-2 w-64 rounded"
                />
                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-64 mt-2"
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
};

export default CadastroAluno;