prompt("Enter Your I'd")
        // Define holidays for each month (fixed syntax)
        const holidaysList = {
            0: [
                {date: 1, name: "New Year Day"},
                {date: 13, name: "Lohri"}
            ],
            2: [
                {date: 8, name: "Maha Shivratri"},
                {date: 25, name: "Holi"}
            ],
            3: [
                {date: 10, name: "Eid-ul-Fitr"}
            ],
            6: [
                {date: 17, name: "Muharram"}
            ],
            7: [
                {date: 19, name: "Raksha Bandhan"},
                {date: 26, name: "Janmasthami"}
            ],
            9: [
                {date: 12, name: "Dusshera"},
                {date: 29, name: "Diwali-Break"},
                {date: 30, name: "Diwali-Break"},
                {date: 31, name: "Diwali-Break"}
            ],
            10: [
                {date: 1, name: "Diwali-Break"},
                {date: 2, name: "Diwali-Break"}
            ],
            11: [
                {date: 25, name: "Christmas"}
            ]
        };

        // Initialize the month select dropdown
        function initializeMonthSelect() {
            const monthSelect = document.getElementById('monthSelect');
            const months = moment.months();
            monthSelect.innerHTML = ''; // Clear existing options
            months.forEach((month, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = month;
                if (index === moment().month()) {
                    option.selected = true;
                }
                monthSelect.appendChild(option);
            });
        }

        // Check if a date is a holiday
        function isHoliday(date) {
            const month = date.month();
            const day = date.date();
            
            if (holidaysList[month]) {
                const holiday = holidaysList[month].find(h => h.date === day);
                if (holiday) {
                    return holiday.name;
                }
            }
            
            // Check for Sunday
            if (date.day() === 0) {
                return "Sunday";
            }
            
            return null;
        }

        // Generate sample daily records
        function generateDailyRecords(month) {
            const year = moment().year();
            const daysInMonth = moment(`${year}-${month + 1}`, 'YYYY-M').daysInMonth();
            const records = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const date = moment(`${year}-${month + 1}-${day}`, 'YYYY-M-D');
                const holidayName = isHoliday(date);
                
                records.push({
                    date: date.format('YYYY-MM-DD'),
                    day: date.format('dddd'),
                    status: holidayName ? 'Holiday' : Math.random() > 0.1 ? 'Present' : 'Absent',
                    comments: holidayName || ''
                });
            }

            return records;
        }

        // Update the attendance table
        function updateAttendance() {
            const viewType = document.getElementById('viewType').value;
            const selectedMonth = parseInt(document.getElementById('monthSelect').value);
            const records = generateDailyRecords(selectedMonth);
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            let displayRecords = records;
            if (viewType === 'weekly') {
                const currentDate = moment();
                const startOfWeek = currentDate.clone().startOf('week');
                const endOfWeek = currentDate.clone().endOf('week');
                displayRecords = records.filter(record => {
                    const recordDate = moment(record.date);
                    return recordDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
                });
            }

            displayRecords.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${moment(record.date).format('DD MMM YYYY')}</td>
                    <td>${record.day}</td>
                    <td class="${record.status.toLowerCase()}">${record.status}</td>
                    <td>${record.comments}</td>
                `;
                tableBody.appendChild(row);
            });

            // Update statistics
            const totalDays = displayRecords.length;
            const holidays = displayRecords.filter(r => r.status === 'Holiday').length;
            const workingDays = totalDays - holidays;
            const presentDays = displayRecords.filter(r => r.status === 'Present').length;
            const absentDays = displayRecords.filter(r => r.status === 'Absent').length;
            const attendanceRate = ((presentDays / workingDays) * 100).toFixed(1);

            document.getElementById('workingDays').textContent = workingDays;
            document.getElementById('presentDays').textContent = presentDays;
            document.getElementById('absentDays').textContent = absentDays;
            document.getElementById('holidayDays').textContent = holidays;
            document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
        }

        // Initialize the page
        initializeMonthSelect();
        updateAttendance();