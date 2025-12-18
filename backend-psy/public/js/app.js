document.addEventListener('DOMContentLoaded', function() {
    console.log('Psychologist API loaded');
    
    const cards = document.querySelectorAll('.endpoint-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    checkApiHealth();
    
    document.querySelectorAll('.endpoint-path').forEach(path => {
        path.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const original = this.textContent;
                this.textContent = 'Скопировано!';
                this.style.backgroundColor = '#4caf50';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = original;
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }, 2000);
            });
        });
    });

    function updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow'
            });
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
});

async function checkApiHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        const statusElement = document.querySelector('.status-badge');
        if (statusElement && data.status === 'healthy') {
            statusElement.textContent = '✅ API работает нормально';
            statusElement.style.backgroundColor = '#4caf50';
        }

        if (data.database) {
            const dbInfo = document.getElementById('database-info');
            if (dbInfo) {
                if (data.database.connected) {
                    dbInfo.innerHTML = `
                        <div class="info-label">База данных</div>
                        <div class="info-value">✅ ${data.database.name}</div>
                    `;
                } else {
                    dbInfo.innerHTML = `
                        <div class="info-label">База данных</div>
                        <div class="info-value">❌ Не подключена</div>
                    `;
                }
            }
        }
        
    } catch (error) {
        console.error('API health check failed:', error);
        const statusElement = document.querySelector('.status-badge');
        if (statusElement) {
            statusElement.textContent = '❌ API недоступен';
            statusElement.style.backgroundColor = '#f44336';
        }
    }
}

async function sendTestAppointment() {
    const testData = {
        name: 'Тестовый пользователь',
        email: 'test@example.com',
        phone: '+7 (999) 000-00-00',
        message: 'Это тестовая заявка на консультацию',
        service_type: 'individual',
        cookie_consent: true
    };
    
    try {
        const response = await fetch('/api/v1/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка при отправке тестовой заявки');
    }
}