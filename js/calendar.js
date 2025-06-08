document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentDate = new Date();
    let selectedEvent = null;
    
    // Dados mockados (seriam substituídos por chamadas API em produção)
    const professionals = {
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
    
    const clients = [
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
            date: formatDate(new Date()),
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
            date: formatDate(new Date()),
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
            date: formatDate(new Date(new Date().setDate(new Date().getDate() + 1))),
            time: "14:00",
            duration: 60,
            status: "scheduled",
            notes: "Treino de força"
        },
        {
            id: 4,
            clientId: 4,
            professionalId: 5,
            type: "nutritionist",
            date: formatDate(new Date(new Date().setDate(new Date().getDate() + 3))),
            time: "11:00",
            duration: 30,
            status: "scheduled",
            notes: "Acompanhamento"
        }
    ];
    
    // Elementos do DOM
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const backToSchedulesBtn = document.getElementById('back-to-schedules');
    const professionalFilter = document.getElementById('professional-filter');
    const eventModal = document.getElementById('event-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtn2 = document.getElementById('close-modal');
    const eventModalTitle = document.getElementById('event-modal-title');
    const eventClient = document.getElementById('event-client');
    const eventProfessional = document.getElementById('event-professional');
    const eventTime = document.getElementById('event-time');
    const eventType = document.getElementById('event-type');
    const eventNotes = document.getElementById('event-notes');
    const eventStatus = document.getElementById('event-status');
    const completeEventBtn = document.getElementById('complete-event');
    const cancelEventBtn = document.getElementById('cancel-event');
    const editEventBtn = document.getElementById('edit-event');
    
    // Inicialização
    renderCalendar();
    setupEventListeners();
    
    // Funções de renderização
    function renderCalendar() {
        // Limpar calendário
        calendarDays.innerHTML = '';
        
        // Atualizar título do mês
        currentMonthElement.textContent = currentDate.toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Obter primeiro dia do mês e último dia do mês
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(), 
            currentDate.getMonth(), 
            1
        );
        
        const lastDayOfMonth = new Date(
            currentDate.getFullYear(), 
            currentDate.getMonth() + 1, 
            0
        );
        
        // Dias da semana do primeiro dia (0-6, onde 0 é domingo)
        const startDay = firstDayOfMonth.getDay();
        
        // Dias do mês anterior para preencher o calendário
        const prevMonthLastDay = new Date(
            currentDate.getFullYear(), 
            currentDate.getMonth(), 
            0
        ).getDate();
        
        // Dias do próximo mês para preencher o calendário
        const daysInMonth = lastDayOfMonth.getDate();
        
        // Criar dias do calendário
        let day = 1;
        let nextMonthDay = 1;
        const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7;
        
        for (let i = 0; i < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (i < startDay) {
                // Dias do mês anterior
                const prevDay = prevMonthLastDay - (startDay - i - 1);
                dayElement.innerHTML = `<div class="calendar-day-number">${prevDay}</div>`;
                dayElement.classList.add('empty');
            } else if (day <= daysInMonth) {
                // Dias do mês atual
                const dateStr = formatDate(new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                ));
                
                dayElement.innerHTML = `<div class="calendar-day-number">${day}</div>`;
                
                // Verificar se é hoje
                const today = new Date();
                if (
                    currentDate.getFullYear() === today.getFullYear() &&
                    currentDate.getMonth() === today.getMonth() &&
                    day === today.getDate()
                ) {
                    dayElement.classList.add('today');
                }
                
                // Adicionar eventos para este dia
                renderEventsForDay(dayElement, dateStr);
                
                day++;
            } else {
                // Dias do próximo mês
                dayElement.innerHTML = `<div class="calendar-day-number">${nextMonthDay}</div>`;
                dayElement.classList.add('empty');
                nextMonthDay++;
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    function renderEventsForDay(dayElement, dateStr) {
        // Filtrar eventos por dia e tipo de profissional
        const professionalType = professionalFilter.value;
        
        let dayEvents = schedules.filter(event => event.date === dateStr);
        
        if (professionalType !== 'all') {
            dayEvents = dayEvents.filter(event => event.type === professionalType);
        }
        
        // Ordenar por horário
        dayEvents.sort((a, b) => a.time.localeCompare(b.time));
        
        // Limitar a 3 eventos por dia (com opção de "ver mais")
        const maxEvents = 3;
        const hasMoreEvents = dayEvents.length > maxEvents;
        const eventsToShow = hasMoreEvents ? dayEvents.slice(0, maxEvents) : dayEvents;
        
        // Adicionar eventos ao dia
        eventsToShow.forEach(event => {
            const client = clients.find(c => c.id === event.clientId);
            const professional = [...professionals.personal, ...professionals.nutritionist]
                .find(p => p.id === event.professionalId);
            
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event ${event.type} ${event.status}`;
            eventElement.textContent = `${event.time} - ${client.name.substring(0, 10)}${client.name.length > 10 ? '...' : ''}`;
            eventElement.setAttribute('data-event-id', event.id);
            
            dayElement.appendChild(eventElement);
        });
        
        // Adicionar "ver mais" se necessário
        if (hasMoreEvents) {
            const moreEventsElement = document.createElement('div');
            moreEventsElement.className = 'calendar-event more-events';
            moreEventsElement.textContent = `+${dayEvents.length - maxEvents} mais`;
            moreEventsElement.setAttribute('data-date', dateStr);
            
            dayElement.appendChild(moreEventsElement);
        }
    }
    
    // Funções auxiliares
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    function showEventDetails(eventId) {
        const event = schedules.find(e => e.id === eventId);
        if (!event) return;
        
        selectedEvent = event;
        
        const client = clients.find(c => c.id === event.clientId);
        const professional = [...professionals.personal, ...professionals.nutritionist]
            .find(p => p.id === event.professionalId);
        
        // Preencher modal com detalhes do evento
        eventModalTitle.textContent = event.type === 'personal' ? 'Detalhes do Treino' : 'Detalhes da Consulta';
        eventClient.textContent = client.name;
        eventProfessional.textContent = `${professional.name} (${professional.specialty})`;
        eventTime.textContent = `${event.time} - ${calculateEndTime(event.time, event.duration)}`;
        eventType.textContent = event.type === 'personal' ? 'Treino com Personal' : 'Consulta Nutricional';
        eventNotes.textContent = event.notes || 'Nenhuma observação';
        
        // Status
        const statusTexts = {
            scheduled: 'Agendado',
            completed: 'Realizado',
            canceled: 'Cancelado'
        };
        eventStatus.textContent = statusTexts[event.status] || event.status;
        
        // Mostrar/ocultar botões baseado no status
        completeEventBtn.style.display = event.status === 'scheduled' ? 'flex' : 'none';
        cancelEventBtn.style.display = event.status === 'scheduled' ? 'flex' : 'none';
        
        // Mostrar modal
        eventModal.style.display = 'block';
    }
    
    function calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Navegação do calendário
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            renderCalendar();
        });
        
        // Filtros
        professionalFilter.addEventListener('change', renderCalendar);
        
        // Voltar para lista de agendamentos
        backToSchedulesBtn.addEventListener('click', () => {
            window.location.href = 'scheduling.html';
        });
        
        // Modal
        closeModalBtn.addEventListener('click', () => {
            eventModal.style.display = 'none';
        });
        
        closeModalBtn2.addEventListener('click', () => {
            eventModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                eventModal.style.display = 'none';
            }
        });
        
        // Ações do evento
        completeEventBtn.addEventListener('click', () => {
            if (selectedEvent) {
                selectedEvent.status = 'completed';
                renderCalendar();
                eventModal.style.display = 'none';
            }
        });
        
        cancelEventBtn.addEventListener('click', () => {
            if (selectedEvent && confirm('Tem certeza que deseja cancelar este agendamento?')) {
                selectedEvent.status = 'canceled';
                renderCalendar();
                eventModal.style.display = 'none';
            }
        });
        
        editEventBtn.addEventListener('click', () => {
            if (selectedEvent) {
                // Redirecionar para a página de agendamento com o ID para edição
                window.location.href = `scheduling.html?edit=${selectedEvent.id}`;
            }
        });
        
        // Delegation para eventos de clique nos dias/eventos
        calendarDays.addEventListener('click', (e) => {
            const eventElement = e.target.closest('.calendar-event');
            if (!eventElement) return;
            
            if (eventElement.classList.contains('more-events')) {
                // Mostrar modal com todos os eventos do dia
                const dateStr = eventElement.getAttribute('data-date');
                showAllEventsForDay(dateStr);
            } else {
                // Mostrar detalhes do evento específico
                const eventId = parseInt(eventElement.getAttribute('data-event-id'));
                showEventDetails(eventId);
            }
        });
    }
    
    function showAllEventsForDay(dateStr) {
        // Implementar modal com lista completa de eventos para o dia
        alert(`Mostrar todos os eventos para ${dateStr}`);
    }
});