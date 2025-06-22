// frontend/js/main.js
// Funções de validação
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 5000);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
}

// Formulário de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                // Armazenar token e informações do usuário
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.tipo);
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.nome);

                // Redirecionar baseado no tipo de usuário
                switch (data.tipo) {
                    case 'cliente':
                        window.location.href = '/Cliente/perfil.html';
                        break;
                    case 'nutricionista':
                        window.location.href = '/Nutricionista/perfil.html';
                        break;
                    case 'personal':
                        window.location.href = '/Personal/perfil.html';
                        break;
                    default:
                        showMessage('Tipo de usuário desconhecido', 'error');
                }
            } else {
                showMessage(data.error || 'Credenciais inválidas', 'error');
            }
        } catch (error) {
            showMessage('Erro na conexão. Tente novamente mais tarde.', 'error');
        }
    });
}

// Função para cadastro genérico
async function handleCadastro(formId, userType, extraFields = []) {
    const form = document.getElementById(formId);

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Coletar dados básicos
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            // Validações
            if (!nome || !email || !senha || !confirmarSenha) {
                showMessage('Preencha todos os campos obrigatórios', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Por favor, insira um e-mail válido', 'error');
                return;
            }

            if (!validatePassword(senha)) {
                showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }

            if (!validateConfirmPassword(senha, confirmarSenha)) {
                showMessage('As senhas não coincidem', 'error');
                return;
            }

            // Coletar campos extras
            const extraData = {};
            extraFields.forEach(field => {
                extraData[field] = document.getElementById(field).value;
            });

            try {
                // Montar objeto de usuário
                let userData = {
                    Nome: nome,
                    Email: email,
                    Senha: senha,
                    ...extraData
                };

                // Para clientes, adicionar estrutura específica
                if (userType === 'cliente') {
                    userData = {
                        Nome: nome,
                        Email: email,
                        Senha: senha,
                        Sexo: extraData.sexo,
                        Data_Nascimento: extraData.data_nascimento,
                        Endereço: extraData.endereco,
                        Telefone: extraData.telefone,
                        Turno: extraData.turno,
                        Altura: extraData.altura,
                        Meta: extraData.meta,
                        Observacao: extraData.observacao || null
                    };
                }

                // Determinar endpoint correto
                let endpoint;
                switch (userType) {
                    case 'cliente': endpoint = '/api/clientes'; break;
                    case 'nutricionista': endpoint = '/api/nutricionistas'; break;
                    case 'personal': endpoint = '/api/personals'; break;
                }

                // Enviar para o backend
                const response = await fetch(`http://localhost:3000${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    showMessage('Cadastro realizado com sucesso!', 'success');
                    form.reset();

                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    showMessage(errorData.error || 'Erro no cadastro', 'error');
                }
            } catch (error) {
                showMessage('Erro no cadastro. Tente novamente.', 'error');
            }
        });
    }
}

// Inicialização do dashboard e perfil
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se está em uma página que requer autenticação
    if (window.location.pathname.includes('dashboard.html') ||
        window.location.pathname.includes('perfil.html')) {

        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const userId = localStorage.getItem('userId');

        if (!token || !userType || !userId) {
            window.location.href = 'login.html';
            return;
        }

        try {
            // Obter dados do usuário
            const response = await fetch('http://localhost:3000/api/user/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar dados do usuário');
            }

            const userData = await response.json();

            // Preencher os dados na página
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = userData.Nome;
            }

            if (document.getElementById('userNameTitle')) {
                document.getElementById('userNameTitle').textContent = userData.Nome;
            }

            // Preencher campos comuns
            const commonFields = [
                'Email', 'Telefone', 'Endereço', 'Data_Nascimento',
                'CRN', 'CREF', 'Altura', 'Meta', 'Sexo', 'Turno'
            ];

            commonFields.forEach(field => {
                const element = document.getElementById(`user${field}`);
                if (element && userData[field]) {
                    element.textContent = userData[field];
                }
            });

            // Preencher campos específicos por tipo
            if (userType === 'cliente') {
                // Campos específicos de cliente
                if (document.getElementById('userObservacao') && userData.Observacao) {
                    document.getElementById('userObservacao').textContent = userData.Observacao;
                }
            }
            else if (userType === 'nutricionista') {
                // Campos específicos de nutricionista
            }
            else if (userType === 'personal') {
                // Campos específicos de personal
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Sessão expirada. Faça login novamente.');
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }

    // Inicializar formulários de cadastro
    handleCadastro('cadastroAlunoForm', 'cliente', [
        'sexo', 'data_nascimento', 'endereco', 'telefone', 'turno',
        'altura', 'meta', 'observacao'
    ]);

    handleCadastro('cadastroPersonalForm', 'personal', [
        'idade', 'endereco', 'telefone', 'cref'
    ]);

    handleCadastro('cadastroNutriForm', 'nutricionista', [
        'idade', 'endereco', 'telefone', 'crn'
    ]);

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    }
});