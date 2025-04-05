
// Holiday list definition
const holidays = {
    0: [{ date: 1, name: "New Year Day" }, { date: 13, name: "Lohri" }],
    2: [{ date: 8, name: "Maha Shivratri" }, { date: 25, name: "Holi" }],
    3: [{ date: 10, name: "Eid-ul-Fitr" }],
    6: [{ date: 17, name: "Muharram" }],
    7: [{ date: 19, name: "Raksha Bandhan" }, { date: 26, name: "Janmasthami" }],
    9: [{ date: 12, name: "Dusshera" }, { date: 29, name: "Diwali-Break" }, 
        { date: 30, name: "Diwali-Break" }, { date: 31, name: "Diwali-Break" }],
    10: [{ date: 1, name: "Diwali-Break" }, { date: 2, name: "Diwali-Break" }],
    11: [{ date: 25, name: "Christmas" }]
};

// Core daily activities
const coreActivities = [
    {
        type: 'lecture',
        icon: '📚',
        title: 'Morning Lecture',
        description: 'Regular morning lecture session',
        time: '09:30'
    },
    {
        type: 'meeting',
        icon: '👥',
        title: 'Department Meeting',
        description: 'Daily faculty coordination meeting',
        time: '11:00'
    },
    {
        type: 'lecture',
        icon: '📚',
        title: 'Afternoon Lecture',
        description: 'Regular afternoon lecture session',
        time: '14:00'
    },
    {
        type: 'submission',
        icon: '📝',
        title: 'Daily Reports',
        description: 'Submit daily progress report and attendance',
        time: '16:00'
    }
];

// Variable activities pool
const variableActivities = [
    {
        type: 'exam',
        icon: '✍️',
        title: 'Student Assessment',
        description: 'Conducting regular assessment tests',
        time: '12:30'
    },
    {
        type: 'event',
        icon: '🔬',
        title: 'Lab Session',
        description: 'Practical laboratory work',
        time: '15:00'
    },
    {
        type: 'meeting',
        icon: '🎯',
        title: 'Research Meeting',
        description: 'Research progress discussion',
        time: '13:30'
    },
    {
        type: 'event',
        icon: '📊',
        title: 'Project Review',
        description: 'Student project evaluation',
        time: '15:30'
    }
];

// Check if a date is a holiday
function isHoliday(date) {
    // Check for Sunday
    if (date.getDay() === 0) return "Sunday";
    
    // Check for holidays
    const monthHolidays = holidays[date.getMonth()];
    if (monthHolidays) {
        const holiday = monthHolidays.find(h => h.date === date.getDate());
        return holiday ? holiday.name : false;
    }
    return false;
}

// Generate activities for a working day
function generateDailyActivities(date) {
    let activities = [...coreActivities];
    
    // Add 1-2 random variable activities based on the day of the week
    const dayOfWeek = date.getDay();
    const numExtra = dayOfWeek === 1 || dayOfWeek === 4 ? 2 : 1;
    const shuffled = [...variableActivities].sort(() => 0.5 - Math.random());
    activities = activities.concat(shuffled.slice(0, numExtra));
    
    return activities.sort((a, b) => a.time.localeCompare(b.time));
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Render a single activity card
function renderDateCard(date) {
    const holidayName = isHoliday(date);
    const dateCard = document.createElement('div');
    dateCard.className = 'date-card';

    if (holidayName) {
        dateCard.innerHTML = `
            <div class="date-header holiday">
                <h2>${formatDate(date)}</h2>
                <p>${holidayName}</p>
            </div>
        `;
        return dateCard;
    }

    const activities = generateDailyActivities(date);
    dateCard.innerHTML = `
        <div class="date-header">
            <h2>${formatDate(date)}</h2>
            <p>${activities.length} Activities</p>
        </div>
        <div class="activity-list">
            ${activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon activity-type-${activity.type}">
                        ${activity.icon}
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-description">${activity.description}</div>
                    </div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `).join('')}
        </div>
    `;

    return dateCard;
}

// Initialize the page
let displayDays = 10;
function initializePage() {
    const container = document.getElementById('activitiesContainer');
    container.innerHTML = '';

    for (let i = 0; i < displayDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        container.appendChild(renderDateCard(date));
    }
}

// Load more days
function loadMoreDays() {
    displayDays += 5;
    initializePage();
}


initializePage();