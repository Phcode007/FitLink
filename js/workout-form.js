// Função para adicionar um novo exercício
function addExercise() {
    const container = document.getElementById('exercises-container');
    const exerciseId = Date.now(); // ID único
    
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise';
    exerciseDiv.id = `exercise-${exerciseId}`;
    
    exerciseDiv.innerHTML = `
        <button type="button" class="remove-exercise" data-exercise-id="${exerciseId}">×</button>
        <div class="form-group">
            <label for="exercise-name-${exerciseId}">Nome do Exercício:</label>
            <input type="text" id="exercise-name-${exerciseId}" required>
        </div>
        
        <div class="form-group">
            <label for="exercise-sets-${exerciseId}">Séries:</label>
            <input type="number" id="exercise-sets-${exerciseId}" min="1" value="3">
        </div>
        
        <div class="form-group">
            <label for="exercise-reps-${exerciseId}">Repetições:</label>
            <input type="text" id="exercise-reps-${exerciseId}" value="8-12">
        </div>
        
        <div class="form-group">
            <label for="exercise-rest-${exerciseId}">Descanso (segundos):</label>
            <input type="number" id="exercise-rest-${exerciseId}" min="0" value="60">
        </div>
        
        <div class="form-group">
            <label for="exercise-notes-${exerciseId}">Observações:</label>
            <textarea id="exercise-notes-${exerciseId}"></textarea>
        </div>
    `;
    
    container.appendChild(exerciseDiv);
}

// Função para remover um exercício
function removeExercise(event) {
    const button = event.target;
    const exerciseId = button.getAttribute('data-exercise-id');
    const exerciseDiv = document.getElementById(`exercise-${exerciseId}`);
    if (exerciseDiv) {
        exerciseDiv.remove();
    }
}

// Carregar clientes (simulação)
function loadClients() {
    const clientSelect = document.getElementById('client');
    const mockClients = [
        {id: 1, name: "João Silva"},
        {id: 2, name: "Maria Souza"},
        {id: 3, name: "Carlos Oliveira"}
    ];
    
    mockClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
}

// Função para salvar o plano de treino
function saveWorkoutPlan(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const clientId = document.getElementById('client').value;
    const workoutName = document.getElementById('workout-name').value;
    const duration = document.getElementById('workout-duration').value;
    const objective = document.getElementById('workout-objective').value;
    const notes = document.getElementById('notes').value;
    
    // Coletar exercícios
    const exercises = [];
    const exerciseElements = document.querySelectorAll('.exercise');
    
    exerciseElements.forEach(exerciseDiv => {
        const id = exerciseDiv.id.split('-')[1];
        exercises.push({
            name: document.getElementById(`exercise-name-${id}`).value,
            sets: document.getElementById(`exercise-sets-${id}`).value,
            reps: document.getElementById(`exercise-reps-${id}`).value,
            rest: document.getElementById(`exercise-rest-${id}`).value,
            notes: document.getElementById(`exercise-notes-${id}`).value
        });
    });
    
    // Criar objeto com todos os dados
    const workoutPlan = {
        clientId,
        workoutName,
        duration,
        objective,
        exercises,
        notes,
        createdAt: new Date().toISOString()
    };
    
    // Aqui você enviaria os dados para o servidor
    console.log('Plano de treino a ser salvo:', workoutPlan);
    
    // Simulação de sucesso
    alert('Plano de treino salvo com sucesso!');
    // event.target.reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    addExercise(); // Adicionar um exercício por padrão
    
    document.getElementById('add-exercise-btn').addEventListener('click', addExercise);
    document.getElementById('workout-form').addEventListener('submit', saveWorkoutPlan);
    
    // Delegation para os botões de remover exercício
    document.getElementById('exercises-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-exercise')) {
            removeExercise(e);
        }
    });
});