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
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.tipo);
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.nome);

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

async function handleCadastro(formId, userType, extraFields = []) {
    const form = document.getElementById(formId);

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

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

            const extraData = {};
            extraFields.forEach(field => {
                extraData[field] = document.getElementById(field).value;
            });

            try {
                let userData = {
                    Nome: nome,
                    Email: email,
                    Senha: senha,
                    ...extraData
                };

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

                let endpoint;
                switch (userType) {
                    case 'cliente': endpoint = '/api/clientes'; break;
                    case 'nutricionista': endpoint = '/api/nutricionistas'; break;
                    case 'personal': endpoint = '/api/personals'; break;
                }

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

document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('perfil.html')) {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const userId = localStorage.getItem('userId');

        if (!token || !userType || !userId) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/user/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar dados do usuário');
            }

            const userData = await response.json();

            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = userData.Nome;
            }

            const commonFields = [
                'Email', 'Telefone', 'Endereço', 'Data_Nascimento',
                'CRN', 'CREF', 'Altura', 'Meta', 'Sexo', 'Turno', 'Nome'
            ];

            commonFields.forEach(field => {
                const element = document.getElementById(`user${field}`);
                if (element && userData[field]) {
                    element.textContent = userData[field];
                }
            });

            if (userType === 'cliente' && document.getElementById('userObservacao') && userData.Observacao) {
                document.getElementById('userObservacao').textContent = userData.Observacao;
            }

            // Carregar clientes e planos
            if (userType === 'personal' && window.location.pathname.includes('perfil.html')) {
                const clientsResponse = await fetch('http://localhost:3000/api/personal/clientes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const clients = await clientsResponse.json();
                const clientList = document.getElementById('clientList');
                clientList.innerHTML = clients.map(cliente => `
                    <li>
                        <span>${cliente.Nome}</span>
                        <p>Objetivo: ${cliente.Meta || 'Não especificado'}</p>
                    </li>
                `).join('');

                const plansResponse = await fetch('http://localhost:3000/api/personal/treinos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const plans = await plansResponse.json();
                const trainingPlans = document.getElementById('trainingPlans');
                trainingPlans.innerHTML = plans.map(plan => `
                    <li>
                        <p><strong>Plano de Treino - ${plan.ClienteNome}</strong></p>
                        <p>Objetivo: ${plan.Objetivo || 'Não especificado'}</p>
                        <p>Atualizado: ${new Date(plan.Data_Treino).toLocaleDateString()}</p>
                        <button>Visualizar</button>
                        <button>Editar</button>
                    </li>
                `).join('');

                const clientSelect = document.getElementById('clientSelect');
                clientSelect.innerHTML = '<option value="">Selecione...</option>' + clients.map(cliente => `
                    <option value="${cliente.ID}">${cliente.Nome}</option>
                `).join('');

                const calcClientSelect = document.getElementById('calcClientSelect');
                calcClientSelect.innerHTML = '<option value="">Selecione...</option>' + clients.map(cliente => `
                    <option value="${cliente.ID}">${cliente.Nome}</option>
                `).join('');

                document.getElementById('createPlanBtn').addEventListener('click', () => {
                    document.getElementById('createTrainingModal').style.display = 'flex';
                });
                document.getElementById('cancelTrainingBtn').addEventListener('click', () => {
                    document.getElementById('createTrainingModal').style.display = 'none';
                });

                document.getElementById('addExerciseBtn').addEventListener('click', () => {
                    const exerciseGroup = document.createElement('div');
                    exerciseGroup.className = 'exercise-group';
                    exerciseGroup.innerHTML = `
                        <input type="text" name="exerciseName[]" placeholder="Exercício" required>
                        <input type="number" name="sets[]" placeholder="Séries" required>
                        <input type="number" name="reps[]" placeholder="Repetições" required>
                        <input type="number" name="weight[]" placeholder="Carga (kg)">
                    `;
                    document.getElementById('exercises').appendChild(exerciseGroup);
                });

                document.getElementById('createTrainingForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const exercises = [];
                    document.querySelectorAll('.exercise-group').forEach(group => {
                        exercises.push({
                            name: group.querySelector('input[name="exerciseName[]"]').value,
                            sets: group.querySelector('input[name="sets[]"]').value,
                            reps: group.querySelector('input[name="reps[]"]').value,
                            weight: group.querySelector('input[name="weight[]"]').value || null
                        });
                    });
                    const data = {
                        Cliente_ID: formData.get('client'),
                        Nome: formData.get('trainingName'),
                        Objetivo: formData.get('trainingGoal'),
                        Descricao: formData.get('trainingDescription'),
                        Exercicios: JSON.stringify(exercises)
                    };
                    const response = await fetch('http://localhost:3000/api/personal/treinos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        showMessage('Treino criado com sucesso!', 'success');
                        document.getElementById('createTrainingModal').style.display = 'none';
                        location.reload();
                    } else {
                        showMessage('Erro ao criar treino', 'error');
                    }
                });

                document.getElementById('calc1RMForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const weight = parseFloat(document.getElementById('weightUsed').value);
                    const reps = parseInt(document.getElementById('maxReps').value);
                    const oneRM = weight * (1 + reps / 30); // Fórmula de Epley
                    document.getElementById('result1RM').textContent = oneRM.toFixed(2) + ' kg';
                });

                document.getElementById('close1RMBtn').addEventListener('click', () => {
                    document.getElementById('calc1RMModal').style.display = 'none';
                });
            } else if (userType === 'nutricionista' && window.location.pathname.includes('perfil.html')) {
                const clientsResponse = await fetch('http://localhost:3000/api/nutricionista/clientes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const clients = await clientsResponse.json();
                const clientList = document.getElementById('clientList');
                clientList.innerHTML = clients.map(cliente => `
                    <li>
                        <span>${cliente.Nome}</span>
                        <p>Objetivo: ${cliente.Meta || 'Não especificado'}</p>
                    </li>
                `).join('');

                const plansResponse = await fetch('http://localhost:3000/api/nutricionista/planos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const plans = await plansResponse.json();
                const nutritionPlans = document.getElementById('nutritionPlans');
                nutritionPlans.innerHTML = plans.map(plan => `
                    <li>
                        <p><strong>Plano Alimentar - ${plan.ClienteNome}</strong></p>
                        <p>Objetivo: ${plan.Objetivo}</p>
                        <p>Criado em: ${new Date(plan.Data_Criacao).toLocaleDateString()}</p>
                        <button>Visualizar</button>
                        <button>Editar</button>
                    </li>
                `).join('');

                const clientSelect = document.getElementById('clientSelect');
                clientSelect.innerHTML = '<option value="">Selecione...</option>' + clients.map(cliente => `
                    <option value="${cliente.ID}">${cliente.Nome}</option>
                `).join('');

                document.getElementById('createNutritionPlanBtn').addEventListener('click', () => {
                    document.getElementById('createNutritionPlanModal').style.display = 'flex';
                });
                document.getElementById('cancelNutritionPlanBtn').addEventListener('click', () => {
                    document.getElementById('createNutritionPlanModal').style.display = 'none';
                });

                document.getElementById('createNutritionPlanForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = {
                        Cliente_ID: formData.get('client'),
                        Nome: formData.get('planName'),
                        Objetivo: formData.get('planGoal'),
                        Descricao: formData.get('planDescription')
                    };
                    const response = await fetch('http://localhost:3000/api/nutricionista/planos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        showMessage('Plano alimentar criado com sucesso!', 'success');
                        document.getElementById('createNutritionPlanModal').style.display = 'none';
                        location.reload();
                    } else {
                        showMessage('Erro ao criar plano alimentar', 'error');
                    }
                });
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Sessão expirada. Faça login novamente.');
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }

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