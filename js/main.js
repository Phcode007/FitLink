// Armazenamento de usuários (simulado)
let users = JSON.parse(localStorage.getItem('fitlink_users')) || [];

// Elementos globais
const messageEl = document.getElementById('message');

// Funções de validação
function showMessage(text, type) {
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
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        if (!validateEmail(email)) {
            showMessage('Por favor, insira um e-mail válido', 'error');
            return;
        }

        const user = users.find(u => u.email === email && u.senha === senha);

        if (user) {
            // Simular requisição fetch
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    showMessage('Erro na conexão. Tente novamente mais tarde.', 'error');
                });
        } else {
            showMessage('E-mail ou senha incorretos', 'error');
        }
    });
}

// Função para cadastro genérico
function handleCadastro(formId, userType, extraFields = []) {
    const form = document.getElementById(formId);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

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

            // Verificar se usuário já existe
            if (users.some(u => u.email === email)) {
                showMessage('Este e-mail já está cadastrado', 'error');
                return;
            }

            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                nome,
                email,
                senha,
                tipo: userType,
                ...extraData
            };

            // Simular requisição fetch
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    users.push(newUser);
                    localStorage.setItem('fitlink_users', JSON.stringify(users));
                    showMessage('Cadastro realizado com sucesso!', 'success');

                    // Limpar formulário
                    form.reset();

                    // Redirecionar após 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                })
                .catch(error => {
                    showMessage('Erro no cadastro. Tente novamente.', 'error');
                });
        });
    }
}

// Inicializar formulários de cadastro
document.addEventListener('DOMContentLoaded', () => {
    // Cadastro de Aluno
    handleCadastro('cadastroAlunoForm', 'aluno', ['objetivo']);

    // Cadastro de Personal
    handleCadastro('cadastroPersonalForm', 'personal', ['cref', 'area']);

    // Cadastro de Nutricionista
    handleCadastro('cadastroNutriForm', 'nutricionista', ['crn', 'especializacao']);

    // Dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userNameEl = document.getElementById('userName');
    const userNameTitle = document.getElementById('userNameTitle');
    const userInfoEl = document.getElementById('userInfo');

    if (currentUser && userNameEl) {
        userNameEl.textContent = currentUser.nome;

        if (userNameTitle) {
            userNameTitle.textContent = currentUser.nome;
        }

        if (userInfoEl) {
            let infoHTML = `
                <p><strong>Tipo de Conta:</strong> ${currentUser.tipo === 'aluno' ? 'Aluno' :
                currentUser.tipo === 'personal' ? 'Personal Trainer' : 'Nutricionista'}</p>
                <p><strong>E-mail:</strong> ${currentUser.email}</p>
            `;

            if (currentUser.objetivo) {
                infoHTML += `<p><strong>Objetivo:</strong> ${currentUser.objetivo}</p>`;
            }

            if (currentUser.cref) {
                infoHTML += `<p><strong>CREF:</strong> ${currentUser.cref}</p>`;
            }

            if (currentUser.crn) {
                infoHTML += `<p><strong>CRN:</strong> ${currentUser.crn}</p>`;
            }

            if (currentUser.area) {
                infoHTML += `<p><strong>Área de Atuação:</strong> ${currentUser.area}</p>`;
            }

            if (currentUser.especializacao) {
                infoHTML += `<p><strong>Especialização:</strong> ${currentUser.especializacao}</p>`;
            }

            userInfoEl.innerHTML = infoHTML;
        }
    } else if (window.location.pathname.includes('dashboard.html')) {
        // Se não estiver logado e estiver no dashboard, redireciona
        window.location.href = 'login.html';
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});