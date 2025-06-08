document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentDate = new Date();
    let currentView = 'day';
    let professionals = {
        personal: [
            { id: 1, name: "Carlos Silva", specialty: "Musculação" },
            { id: 2, name: "Ana Souza", specialty: "Crossfit" },
            { id: 3, name: "Ricardo Santos", specialty: "Funcional" }
        ],
        nutritionist: [
            { id: 4, name: "Dra. Juliana Almeida", specialty: "Nutrição Esportiva" },
            { id: 5, name: "Dr. Marcelo Costa", specialty: "Nutrição Clínica" }
        ]
    };
    
    let clients = [
        { id: 1, name: "João da Silva" },
        { id: 2, name: "Maria Oliveira" },
        { id: 3, name: "Carlos Pereira" },
        { id: 4, name: "Ana Souza" },
        { id: 5, name: "Pedro Costa" }
    ];
    
    let schedules = [
        {
            id: 1,
            clientId: 1,
            professionalId: 1,
            type: "personal",
            date: "2023-11-20",
            time: "09:00",
            duration: 60,
            status: "scheduled",
            notes: "Treino de adaptação"
        },
        {
            id: 2,
            clientId: 2,
            professionalId: 4,
            type: "nutritionist",
            date: "2023-11-20",
            time: "10:30",
            duration: 45,
            status: "scheduled",
            notes: "Primeira consulta"
        },
        {
            id: 3,
            clientId: 3,
            professionalId: 2,
            type: "personal",
            date: "2023-11-20",
            time: "14:00",
            duration: 60,
            status: "completed",
            notes: "Treino de força"
        }
    ];
    
    // Elementos do DOM
    const scheduleList = document.getElementById('schedule-list');
    const currentDateElement = document.getElementById('current-date');
    const currentViewTitle = document.getElementById('current-view-title');
    const professionalTypeSelect = document.getElementById('professional-type');
    const professionalSelect = document.getElementById('professional-select');
    const statusFilter = document.getElementById('status-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const newScheduleBtn = document.getElementById('new-schedule');
    const viewCalendarBtn = document.getElementById('view-calendar');
    const prevDateBtn = document.getElementById('prev-date');
    const nextDateBtn = document.getElementById('next-date');
    const dayViewBtn = document.getElementById('day-view');
    const weekViewBtn = document.getElementById('week-view');
    const monthViewBtn = document.getElementById('month-view');
    const scheduleModal = document.getElementById('schedule-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.cancel-modal');
    const newScheduleForm = document.getElementById('new-schedule-form');
    const scheduleClientSelect = document.getElementById('schedule-client');
    const scheduleTypeSelect = document.getElementById('schedule-type');
    const scheduleProfessionalSelect = document.getElementById('schedule-professional');
    const scheduleDateInput = document.getElementById('schedule-date');
    const scheduleTimeInput = document.getElementById('schedule-time');
    
    // Inicialização
    initSelects();
    updateDateDisplay();
    renderSchedules();
    setupEventListeners();
    
    // Funções de inicialização
    function initSelects() {
        // Popular select de clientes (modal)
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            scheduleClientSelect.appendChild(option);
        });
        
        // Popular select de profissionais (filtro)
        const allPros = [...professionals.personal, ...professionals.nutritionist];
        allPros.forEach(pro => {
            const option = document.createElement('option');
            option.value = pro.id;
            option.textContent = pro.name;
            professionalSelect.appendChild(option);
        });
        
        // Definir data atual no modal
        const today = new Date().toISOString().split('T')[0];
        scheduleDateInput.value = today;
        scheduleDateInput.min = today;
    }
    
    function setupEventListeners() {
        // Navegação de data
        prevDateBtn.addEventListener('click', () => {
            changeDate(-1);
        });
        
        nextDateBtn.addEventListener('click', () => {
            changeDate(1);
        });
        
        // Troca de visualização
        dayViewBtn.addEventListener('click', () => {
            setCurrentView('day');
        });
        
        weekViewBtn.addEventListener('click', () => {
            setCurrentView('week');
        });
        
        monthViewBtn.addEventListener('click', () => {
            setCurrentView('month');
        });
        
        // Filtros
        applyFiltersBtn.addEventListener('click', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Modal
        newScheduleBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        cancelModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === scheduleModal) {
                closeModal();
            }
        });
        
        // Formulário
        scheduleTypeSelect.addEventListener('change', updateProfessionalSelect);
        newScheduleForm.addEventListener('submit', handleNewSchedule);
        
        // Visualização de calendário
        viewCalendarBtn.addEventListener('click', () => {
            window.location.href = 'calendar-view.html';
        });
    }
    
    // Funções de visualização
    function updateDateDisplay() {
        const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        
        currentDateElement.textContent = currentDate.toLocaleDateString('pt-BR', options);
        
        switch(currentView) {
            case 'day':
                currentViewTitle.textContent = 'Agendamentos do Dia';
                break;
            case 'week':
                currentViewTitle.textContent = `Agendamentos da Semana (${getWeekRange()})`;
                break;
            case 'month':
                currentViewTitle.textContent = `Agendamentos do Mês (${currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})`;
                break;
        }
    }
    
    function getWeekRange() {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} a ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`;
    }
    
    function changeDate(days) {
        if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + days);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + (days * 7));
        } else if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + days);
        }
        
        updateDateDisplay();
        renderSchedules();
    }
    
    function setCurrentView(view) {
        currentView = view;
        
        // Atualizar botões ativos
        dayViewBtn.classList.remove('active');
        weekViewBtn.classList.remove('active');
        monthViewBtn.classList.remove('active');
        
        if (view === 'day') dayViewBtn.classList.add('active');
        else if (view === 'week') weekViewBtn.classList.add('active');
        else if (view === 'month') monthViewBtn.classList.add('active');
        
        updateDateDisplay();
        renderSchedules();
    }
    
    // Funções de renderização
    function renderSchedules() {
        // Filtrar agendamentos com base na data e visualização atual
        let filteredSchedules = filterSchedulesByDate();
        
        // Aplicar filtros adicionais
        const professionalType = professionalTypeSelect.value;
        const professionalId = professionalSelect.value;
        const status = statusFilter.value;
        
        if (professionalType !== 'all') {
            filteredSchedules = filteredSchedules.filter(s => s.type === professionalType);
        }
        
        if (professionalId !== 'all') {
            filteredSchedules = filteredSchedules.filter(s => s.professionalId == professionalId);
        }
        
        if (status !== 'all') {
            filteredSchedules = filteredSchedules.filter(s => s.status === status);
        }
        
        // Ordenar por horário
        filteredSchedules.sort((a, b) => a.time.localeCompare(b.time));
        
        // Renderizar
        scheduleList.innerHTML = '';
        
        if (filteredSchedules.length === 0) {
            scheduleList.innerHTML = '<div class="no-schedules">Nenhum agendamento encontrado</div>';
            return;
        }
        
        filteredSchedules.forEach(schedule => {
            const client = clients.find(c => c.id === schedule.clientId);
            const professional = [...professionals.personal, ...professionals.nutritionist].find(p => p.id === schedule.professionalId);
            
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            
            // Formatar hora de início e fim
            const startTime = schedule.time;
            const endTime = calculateEndTime(startTime, schedule.duration);
            
            scheduleItem.innerHTML = `
                <div class="schedule-item-header">
                    <span class="schedule-time">${startTime} - ${endTime}</span>
                    <span class="schedule-status status-${schedule.status}">
                        ${getStatusText(schedule.status)}
                    </span>
                </div>
                <div class="schedule-client">${client.name}</div>
                <div class="schedule-professional">Com: ${professional.name}</div>
                <span class="schedule-type type-${schedule.type}">
                    ${schedule.type === 'personal' ? 'Treino' : 'Consulta'}
                </span>
                ${schedule.notes ? `<div class="schedule-notes">${schedule.notes}</div>` : ''}
                <div class="schedule-actions">
                    ${schedule.status === 'scheduled' ? `
                        <button class="action-btn complete-btn" data-id="${schedule.id}">
                            <i class="fas fa-check"></i> Concluir
                        </button>
                        <button class="action-btn cancel-btn" data-id="${schedule.id}">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    ` : ''}
                    <button class="action-btn edit-btn" data-id="${schedule.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            `;
            
            scheduleList.appendChild(scheduleItem);
        });
        
        // Adicionar event listeners aos botões
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', completeSchedule);
        });
        
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', cancelSchedule);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editSchedule);
        });
    }
    
    function filterSchedulesByDate() {
        if (currentView === 'day') {
            const dateStr = formatDate(currentDate);
            return schedules.filter(s => s.date === dateStr);
        } else if (currentView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return schedules.filter(s => {
                const scheduleDate = new Date(s.date);
                return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
            });
        } else if (currentView === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            return schedules.filter(s => {
                const scheduleDate = new Date(s.date);
                return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month;
            });
        }
        
        return [];
    }
    
    // Funções de manipulação de agendamentos
    function openModal() {
        scheduleModal.style.display = 'block';
    }
    
    function closeModal() {
        scheduleModal.style.display = 'none';
        newScheduleForm.reset();
        scheduleProfessionalSelect.disabled = true;
    }
    
    function updateProfessionalSelect() {
        const type = scheduleTypeSelect.value;
        scheduleProfessionalSelect.innerHTML = '<option value="">Selecione um profissional</option>';
        scheduleProfessionalSelect.disabled = !type;
        
        if (type) {
            const pros = type === 'personal' ? professionals.personal : professionals.nutritionist;
            
            pros.forEach(pro => {
                const option = document.createElement('option');
                option.value = pro.id;
                option.textContent = pro.name;
                scheduleProfessionalSelect.appendChild(option);
            });
        }
    }
    
    function handleNewSchedule(e) {
        e.preventDefault();
        
        const newSchedule = {
            id: schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1,
            clientId: parseInt(scheduleClientSelect.value),
            professionalId: parseInt(scheduleProfessionalSelect.value),
            type: scheduleTypeSelect.value,
            date: scheduleDateInput.value,
            time: scheduleTimeInput.value,
            duration: parseInt(scheduleDurationSelect.value),
            status: "scheduled",
            notes: scheduleNotes.value
        };
        
        // Validar conflitos de horário
        if (hasScheduleConflict(newSchedule)) {
            alert('Conflito de horário! Já existe um agendamento para este profissional no horário selecionado.');
            return;
        }
        
        schedules.push(newSchedule);
        renderSchedules();
        closeModal();
        
        alert('Agendamento criado com sucesso!');
    }
    
    function hasScheduleConflict(newSchedule) {
        const newStart = new Date(`${newSchedule.date}T${newSchedule.time}`);
        const newEnd = new Date(newStart.getTime() + newSchedule.duration * 60000);
        
        return schedules.some(s => {
            if (s.professionalId !== newSchedule.professionalId || s.status === 'canceled') {
                return false;
            }
            
            const existingStart = new Date(`${s.date}T${s.time}`);
            const existingEnd = new Date(existingStart.getTime() + s.duration * 60000);
            
            return (newStart >= existingStart && newStart < existingEnd) ||
                   (newEnd > existingStart && newEnd <= existingEnd) ||
                   (newStart <= existingStart && newEnd >= existingEnd);
        });
    }
    
    function completeSchedule(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const schedule = schedules.find(s => s.id === id);
        
        if (schedule) {
            schedule.status = 'completed';
            renderSchedules();
        }
    }
    
    function cancelSchedule(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const schedule = schedules.find(s => s.id === id);
        
        if (schedule && confirm('Tem certeza que deseja cancelar este agendamento?')) {
            schedule.status = 'canceled';
            renderSchedules();
        }
    }
    
    function editSchedule(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const schedule = schedules.find(s => s.id === id);
        
        if (schedule) {
            // Preencher formulário com dados do agendamento
            scheduleClientSelect.value = schedule.clientId;
            scheduleTypeSelect.value = schedule.type;
            updateProfessionalSelect();
            scheduleProfessionalSelect.value = schedule.professionalId;
            scheduleDateInput.value = schedule.date;
            scheduleTimeInput.value = schedule.time;
            scheduleDurationSelect.value = schedule.duration;
            scheduleNotes.value = schedule.notes || '';
            
            // Abrir modal
            openModal();
            
            // Alterar comportamento do formulário para edição
            newScheduleForm.onsubmit = function(e) {
                e.preventDefault();
                
                // Atualizar agendamento
                schedule.clientId = parseInt(scheduleClientSelect.value);
                schedule.professionalId = parseInt(scheduleProfessionalSelect.value);
                schedule.type = scheduleTypeSelect.value;
                schedule.date = scheduleDateInput.value;
                schedule.time = scheduleTimeInputInput.value;
                schedule.duration = parseInt(scheduleDurationSelect.value);
                schedule.notes = scheduleNotes.value;
                
                renderSchedules();
                closeModal();
                
                alert('Agendamento atualizado com sucesso!');
            };
        }
    }
    
    // Funções auxiliares
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    function calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
    
    function getStatusText(status) {
        const statusTexts = {
            scheduled: 'Agendado',
            completed: 'Realizado',
            canceled: 'Cancelado'
        };
        
        return statusTexts[status] || status;
    }
    
    function applyFilters() {
        renderSchedules();
    }
    
    function resetFilters() {
        professionalTypeSelect.value = 'all';
        professionalSelect.value = 'all';
        statusFilter.value = 'all';
        renderSchedules();
    }
});