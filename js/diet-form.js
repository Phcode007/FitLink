// Função para adicionar uma nova refeição
function addMeal() {
    const container = document.getElementById('meals-container');
    const mealId = Date.now(); // ID único
    
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal';
    mealDiv.id = `meal-${mealId}`;
    mealDiv.dataset.mealId = mealId;
    
    mealDiv.innerHTML = `
        <button type="button" class="remove-meal" data-meal-id="${mealId}">×</button>
        <div class="form-group">
            <label for="meal-name-${mealId}">Nome da Refeição:</label>
            <select id="meal-name-${mealId}" class="meal-type">
                <option value="breakfast">Café da Manhã</option>
                <option value="snack1">Lanche da Manhã</option>
                <option value="lunch">Almoço</option>
                <option value="snack2">Lanche da Tarde</option>
                <option value="dinner">Jantar</option>
                <option value="supper">Ceia</option>
                <option value="pre-workout">Pré-Treino</option>
                <option value="post-workout">Pós-Treino</option>
                <option value="other">Outro</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="meal-time-${mealId}">Horário Sugerido:</label>
            <input type="time" id="meal-time-${mealId}">
        </div>
        
        <div class="form-group">
            <label>Alimentos:</label>
            <div id="foods-container-${mealId}">
                <!-- Alimentos serão adicionados aqui -->
            </div>
            <button type="button" class="add-food" data-meal-id="${mealId}">+ Adicionar Alimento</button>
        </div>
        
        <div class="form-group">
            <label for="meal-notes-${mealId}">Observações:</label>
            <textarea id="meal-notes-${mealId}"></textarea>
        </div>
    `;
    
    container.appendChild(mealDiv);
    // Adicionar um alimento por padrão
    addFoodItem(mealId);
}

// Função para adicionar um alimento a uma refeição
function addFoodItem(mealId) {
    const container = document.getElementById(`foods-container-${mealId}`);
    const foodId = Date.now();
    
    const foodDiv = document.createElement('div');
    foodDiv.className = 'food-item';
    foodDiv.id = `food-${mealId}-${foodId}`;
    foodDiv.dataset.foodId = foodId;
    
    foodDiv.innerHTML = `
        <div class="food-input-group">
            <div>
                <input type="text" placeholder="Nome do alimento" class="food-name" required>
            </div>
            <div>
                <input type="text" placeholder="Quantidade" class="food-quantity" required>
            </div>
            <div>
                <input type="text" placeholder="Medida (g, ml, etc)" class="food-measure">
            </div>
            <div>
                <input type="number" placeholder="Calorias (kcal)" class="food-calories" min="0">
            </div>
            <div>
                <button type="button" class="remove-btn" data-meal-id="${mealId}" data-food-id="${foodId}">×</button>
            </div>
        </div>
    `;
    
    container.appendChild(foodDiv);
}

// Função para remover um alimento
function removeFoodItem(event) {
    const button = event.target;
    const mealId = button.getAttribute('data-meal-id');
    const foodId = button.getAttribute('data-food-id');
    const foodDiv = document.getElementById(`food-${mealId}-${foodId}`);
    if (foodDiv) {
        foodDiv.remove();
    }
}

// Função para remover uma refeição
function removeMeal(event) {
    const button = event.target;
    const mealId = button.getAttribute('data-meal-id');
    const mealDiv = document.getElementById(`meal-${mealId}`);
    if (mealDiv) {
        mealDiv.remove();
    }
}

// Carregar clientes (simulação)
function loadClients() {
    const clientSelect = document.getElementById('diet-client');
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

// Função para salvar o plano alimentar
function saveDietPlan(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const clientId = document.getElementById('diet-client').value;
    const planName = document.getElementById('diet-name').value;
    const duration = document.getElementById('diet-duration').value;
    const objective = document.getElementById('diet-objective').value;
    const caloricGoal = document.getElementById('caloric-goal').value;
    const notes = document.getElementById('diet-notes').value;
    
    // Coletar refeições
    const meals = [];
    const mealElements = document.querySelectorAll('.meal');
    
    mealElements.forEach(mealDiv => {
        const mealId = mealDiv.dataset.mealId;
        
        // Coletar alimentos da refeição
        const foods = [];
        const foodElements = mealDiv.querySelectorAll('.food-item');
        
        foodElements.forEach(foodDiv => {
            foods.push({
                name: foodDiv.querySelector('.food-name').value,
                quantity: foodDiv.querySelector('.food-quantity').value,
                measure: foodDiv.querySelector('.food-measure').value,
                calories: foodDiv.querySelector('.food-calories').value
            });
        });
        
        meals.push({
            type: document.getElementById(`meal-name-${mealId}`).value,
            time: document.getElementById(`meal-time-${mealId}`).value,
            foods,
            notes: document.getElementById(`meal-notes-${mealId}`).value
        });
    });
    
    // Criar objeto com todos os dados
    const dietPlan = {
        clientId,
        planName,
        duration,
        objective,
        caloricGoal,
        meals,
        notes,
        createdAt: new Date().toISOString()
    };
    
    // Aqui você enviaria os dados para o servidor
    console.log('Plano alimentar a ser salvo:', dietPlan);
    
    // Simulação de sucesso
    alert('Plano alimentar salvo com sucesso!');
    // event.target.reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    addMeal(); // Adicionar uma refeição por padrão
    
    // Botão para adicionar refeição
    document.getElementById('add-meal-btn').addEventListener('click', addMeal);
    
    // Form submission
    document.getElementById('diet-form').addEventListener('submit', saveDietPlan);
    
    // Delegation para os botões de remover
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            removeFoodItem(e);
        } else if (e.target.classList.contains('remove-meal')) {
            removeMeal(e);
        } else if (e.target.classList.contains('add-food')) {
            const mealId = e.target.getAttribute('data-meal-id');
            addFoodItem(mealId);
        }
    });
});