// calendar.js
export class Calendar {
    constructor(startDate) {
        console.log('Calendar initializing with start date:', startDate);
        this.CONFIG = {
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            startYear: 2022,
            endYear: new Date().getFullYear()
        };

        this.state = {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            monthToggle: 'hide',
            yearToggle: 'hide'
        };

        this.startDate = startDate;
        this.elements = {};
        this.initialize();
    }

    initialize() {
        // Get DOM elements
        console.log('Getting DOM elements...');
        this.elements = {
            curMonth: document.getElementById('curMonth'),
            curYear: document.getElementById('curYear'),
            months: document.getElementById('months'),
            years: document.getElementById('years'),
            calendarDays: document.getElementById('calendarDays')
        };

        // Set initial display
        this.elements.curMonth.innerHTML = this.CONFIG.months[this.state.month];
        this.elements.curYear.innerHTML = this.state.year;

        // Set up event listeners
        this.setupEventListeners();

        // Load initial calendar data
        this.loadCalendarMonths();
        this.loadCalendarYears();
        this.loadCalendarDays();
    }

    setupEventListeners() {
        // Month click handler
        this.elements.curMonth.addEventListener('click', () => {
            this.elements.years.style.display = 'none';
            this.state.yearToggle = 'hide';

            if (this.state.monthToggle === 'show') {
                this.state.monthToggle = 'hide';
                this.elements.months.style.display = 'none';
            } else {
                this.state.monthToggle = 'show';
                this.elements.months.style.display = 'block';
            }
        });

        // Year click handler
        this.elements.curYear.addEventListener('click', () => {
            this.elements.months.style.display = 'none';
            this.state.monthToggle = 'hide';

            if (this.state.yearToggle === 'show') {
                this.state.yearToggle = 'hide';
                this.elements.years.style.display = 'none';
            } else {
                this.state.yearToggle = 'show';
                this.elements.years.style.display = 'block';
            }
        });
    }

    loadCalendarMonths() {
        this.elements.months.innerHTML = '';  // Clear existing months

        this.CONFIG.months.forEach((monthName, index) => {
            const monthElement = document.createElement("div");
            monthElement.innerHTML = monthName;
            monthElement.classList.add("dropdown-item");

            monthElement.onclick = () => {
                this.state.month = index;
                this.elements.curMonth.innerHTML = this.CONFIG.months[this.state.month];
                this.loadCalendarDays();
                this.elements.months.style.display = 'none';
                this.state.monthToggle = 'hide';
            };

            this.elements.months.appendChild(monthElement);
        });
    }

    loadCalendarYears() {
        this.elements.years.innerHTML = '';  // Clear existing years

        for (let year = this.CONFIG.startYear; year <= this.CONFIG.endYear; year++) {
            const yearElement = document.createElement("div");
            yearElement.innerHTML = year;
            yearElement.classList.add("dropdown-item");

            yearElement.onclick = () => {
                this.state.year = year;
                this.elements.curYear.innerHTML = year;
                this.loadCalendarDays();
                this.elements.years.style.display = 'none';
                this.state.yearToggle = 'hide';
            };

            this.elements.years.appendChild(yearElement);
        }
    }

    loadCalendarDays() {
        this.elements.calendarDays.innerHTML = '';  // Clear existing days

        const tmpDate = new Date(this.state.year, this.state.month, 0);
        const numDays = this.daysInMonth(this.state.month, this.state.year);
        const dayOfWeek = tmpDate.getDay();

        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);

        // Add blank days at start of month
        for (let i = 0; i <= dayOfWeek; i++) {
            const blankDay = document.createElement("div");
            blankDay.classList.add("day", "blank");
            this.elements.calendarDays.appendChild(blankDay);
        }

        // Add days of the month
        for (let i = 0; i < numDays; i++) {
            const dayNum = i + 1;
            const dayElement = this.createDayElement(dayNum, nowDate);
            this.elements.calendarDays.appendChild(dayElement);
        }

        // Add clear div at the end
        const clear = document.createElement("div");
        clear.className = "clear";
        this.elements.calendarDays.appendChild(clear);
    }

    createDayElement(dayNum, nowDate) {
        const dayElement = document.createElement("div");
        dayElement.id = "calendarday_" + (dayNum - 1);
        dayElement.classList.add('day');

        const dateString = dayNum.toString().padStart(2, "0") + ' ' +
            this.CONFIG.months[this.state.month] + ' ' +
            this.state.year;

        const thisDate = new Date(dateString);

        // Add today highlight if applicable
        if (thisDate.getTime() === nowDate.getTime()) {
            dayElement.classList.add('todayDay');
        }

        dayElement.innerHTML = dayNum;
        dayElement.dataset.day = dayNum;

        // Make past dates clickable
        if (thisDate.getTime() <= nowDate.getTime() &&
            thisDate.getTime() >= this.startDate.getTime()) {
            dayElement.classList.add('dayUnderline');
            dayElement.addEventListener('click', () => {
                const dateQuery = dayNum.toString().padStart(2, "0") + ' ' +
                    this.CONFIG.months[this.state.month] + ' ' +
                    this.state.year;
                window.location.href = window.location.protocol + "//" +
                    window.location.host +
                    window.location.pathname +
                    '?day=' + dateQuery;
            });
        }

        return dayElement;
    }

    daysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
}