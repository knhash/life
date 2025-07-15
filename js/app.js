// Configure marked for markdown parsing
marked.setOptions({
    mangle: false,
    headerIds: false
});

// Custom renderer for links
marked.use({
    renderer: {
        link(href, title, text) {
            const isRemoteURL = href && href.startsWith('http');
            if (isRemoteURL) {
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
            const maybeTitleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${maybeTitleAttr}>${text}</a>`;
        }
    }
});

// Data will be loaded from external YAML file

// Utility functions
const getWeekID = (date) => {
    // Get the Monday of the week for the given date
    const d = new Date(date);
    const day = d.getDay() || 7; // Convert Sunday from 0 to 7
    d.setDate(d.getDate() - day + 1); // Move to Monday
    return d.toISOString().split('T')[0];
};

const getWeekNumber = (date) => {
    // Get ISO week number (1-53)
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
};

const getOverallWeekNumber = (date, startDate) => {
    // Calculate overall week number from the start date
    const weeksDiff = getNumberOfWeeksBetweenDates(startDate, date);
    return weeksDiff + 1; // +1 because we want to start counting from week 1, not 0
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const getNumberOfWeeksBetweenDates = (from, to) =>
    Math.round((to.getTime() - from.getTime()) / ONE_WEEK);

const getBirthdays = (birthdayWeekID, to, today) => {
    const todayID = getWeekID(today);
    const birthdayDate = new Date(birthdayWeekID);
    const result = [];

    let startDate = new Date(birthdayDate.getTime());
    startDate.setFullYear(startDate.getFullYear() + 1);
    let years = 1;

    while (startDate.getTime() < to.getTime()) {
        const start = getWeekID(startDate);
        if (start !== todayID) {
            const marker = {
                type: 'marker',
                markerType: 'birthday',
                start: getWeekID(startDate),
                name: years.toString()
            };

            result.push([new Date(startDate), marker]);
        }
        startDate.setFullYear(startDate.getFullYear() + 1);
        years++;
    }

    return result;
};

const calculateWeeks = ({ from, to, events = {}, today }) => {
    const eventsArr = Object.entries(events);
    const renderableEvents = eventsArr.map(([dateStr, weekMeta]) => {
        const date = new Date(dateStr);
        const week = {
            ...weekMeta,
            start: getWeekID(date),
            type: 'event'
        };
        return [date, week];
    });

    const renderableToday = {
        start: getWeekID(today),
        type: 'marker',
        markerType: 'today'
    };

    renderableEvents.push([today, renderableToday]);

    // Birthday markers removed for brick wall effect

    renderableEvents.sort((eventA, eventB) => eventA[0].getTime() - eventB[0].getTime());

    const maybeLastEvent = renderableEvents[renderableEvents.length - 1];

    if (typeof maybeLastEvent === 'undefined')
        return [
            {
                type: 'uneventful',
                start: getWeekID(from),
                duration: getNumberOfWeeksBetweenDates(from, to)
            }
        ];

    const shouldAddWeeksAfter = getNumberOfWeeksBetweenDates(new Date(maybeLastEvent[0]), to) > 0;

    const weekRecordDates = renderableEvents.reduce(
        (all, [currDate, curr]) => {
            const weeksBefore = getNumberOfWeeksBetweenDates(all.lastDate, currDate);

            const event = curr;

            if (!(weeksBefore > 0))
                return {
                    lastDate: new Date(currDate.getTime() + ONE_WEEK),
                    weeks: [...all.weeks, event]
                };

            const uneventful = {
                type: 'uneventful',
                start: getWeekID(all.lastDate),
                duration: weeksBefore
            };

            return {
                lastDate: new Date(currDate.getTime() + ONE_WEEK),
                weeks: [...all.weeks, uneventful, event]
            };
        },
        { lastDate: new Date(from), weeks: [] }
    );

    if (!shouldAddWeeksAfter) return weekRecordDates.weeks;

    const weeksAfter = {
        type: 'uneventful',
        start: getWeekID(new Date(maybeLastEvent[0].getTime() + ONE_WEEK)),
        duration: getNumberOfWeeksBetweenDates(maybeLastEvent[0], to)
    };

    return [...weekRecordDates.weeks, weeksAfter];
};

// Tracking function
const trackEvent = (eventName) => {
    if (localStorage['sonnet::debug']) {
        console.log(`[track] ${eventName}`);
        return;
    }

    if (window.umami?.trackEvent) {
        window.umami.trackEvent(eventName);
        return;
    }
};

// Rendering functions
const renderMarkdown = (content, inline = false) => {
    if (inline) {
        return marked.parseInline(content);
    } else {
        return marked.parse(content);
    }
};

// Device detection
const isMobile = () => {
    // Check for touch capability and hover support
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    // If no hover support or has touch, consider it mobile
    return !hasHover || hasTouch;
};

// Tooltip functionality
let currentTooltip = null;
let tooltipTimeout = null;

const createTooltip = (event, targetElement, overallWeekNumber) => {
    // Clear any existing timeout
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    
    // Debug logging
    if (localStorage['sonnet::debug']) {
        console.log('Creating tooltip for event:', event);
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    const date = new Date(event.start);
    const year = date.getFullYear();
    const dateStr = overallWeekNumber ? `Week ${overallWeekNumber}, ${year}` : `Week ${getWeekNumber(date)}, ${year}`;
    
    const tooltipContent = (event.desc && event.desc.trim()) ? 
        `<div class="tooltip-content md-content">${renderMarkdown(event.desc)}</div>` : 
        '';
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${dateStr}</div>
        <div class="tooltip-name">${renderMarkdown(event.name || 'Unnamed Event', true)}</div>
        ${tooltipContent}
    `;
    
    // Debug logging
    if (localStorage['sonnet::debug']) {
        console.log('Tooltip HTML:', tooltip.innerHTML);
        console.log('Target element:', targetElement);
    }
    
    // Add to body first to measure dimensions
    tooltip.style.visibility = 'hidden';
    tooltip.style.position = 'absolute';
    tooltip.style.top = '-9999px';
    document.body.appendChild(tooltip);
    
    // Get dimensions
    const tooltipRect = tooltip.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Calculate initial position (centered above target)
    let left = targetRect.left + scrollLeft + (targetRect.width / 2) - (tooltipRect.width / 2);
    let top = targetRect.top + scrollTop - tooltipRect.height - 12;
    let showBelow = false;
    
    // Horizontal adjustments
    const padding = 15;
    if (left < padding + scrollLeft) {
        left = padding + scrollLeft;
    } else if (left + tooltipRect.width > viewportWidth + scrollLeft - padding) {
        left = viewportWidth + scrollLeft - tooltipRect.width - padding;
    }
    
    // Vertical adjustments
    if (top < padding + scrollTop) {
        // Not enough space above, show below
        top = targetRect.bottom + scrollTop + 12;
        showBelow = true;
        
        // Check if it fits below
        if (top + tooltipRect.height > viewportHeight + scrollTop - padding) {
            // Not enough space below either, position optimally
            if (targetRect.top + scrollTop > viewportHeight / 2 + scrollTop) {
                // Target is in lower half, try to show above
                top = Math.max(padding + scrollTop, targetRect.top + scrollTop - tooltipRect.height - 12);
            } else {
                // Target is in upper half, show below with best fit
                top = Math.min(targetRect.bottom + scrollTop + 12, 
                              viewportHeight + scrollTop - tooltipRect.height - padding);
            }
        }
    }
    
    // Final boundary check
    if (top < scrollTop + padding) {
        top = scrollTop + padding;
    }
    if (top + tooltipRect.height > viewportHeight + scrollTop - padding) {
        top = viewportHeight + scrollTop - tooltipRect.height - padding;
    }
    
    // Apply final position
    tooltip.style.visibility = 'visible';
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    // Show tooltip with animation
    requestAnimationFrame(() => {
        tooltip.classList.add('show');
        if (localStorage['sonnet::debug']) {
            console.log('Tooltip shown, classes:', tooltip.className);
            console.log('Tooltip position:', tooltip.style.left, tooltip.style.top);
        }
    });
    
    return tooltip;
};

const hideTooltip = (immediate = false) => {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    
    if (currentTooltip) {
        if (immediate) {
            if (currentTooltip.parentNode) {
                currentTooltip.parentNode.removeChild(currentTooltip);
            }
            currentTooltip = null;
        } else {
            currentTooltip.classList.remove('show');
            const tooltipToRemove = currentTooltip;
            currentTooltip = null;
            
            setTimeout(() => {
                if (tooltipToRemove && tooltipToRemove.parentNode) {
                    tooltipToRemove.parentNode.removeChild(tooltipToRemove);
                }
            }, 200);
        }
    }
};

const showTooltipWithDelay = (event, targetElement) => {
    // Clear any existing timeout
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
    }
    
    // Hide current tooltip immediately if switching between elements
    if (currentTooltip) {
        hideTooltip(true);
    }
    
    // Remove any orphaned tooltips
    const existingTooltips = document.querySelectorAll('.tooltip');
    existingTooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    });
    
    // Show new tooltip after delay
    tooltipTimeout = setTimeout(() => {
        try {
            const weekNumber = targetElement.dataset.weekNumber;
            currentTooltip = createTooltip(event, targetElement, weekNumber);
            tooltipTimeout = null;
        } catch (error) {
            console.error('Error creating tooltip:', error, event);
            tooltipTimeout = null;
        }
    }, 150); // Slightly reduced delay for better responsiveness
};

// Mobile popup functionality
let currentMobilePopup = null;

const createMobilePopup = (event, overallWeekNumber) => {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'mobile-popup';
    
    const date = new Date(event.start);
    const year = date.getFullYear();
    const dateStr = overallWeekNumber ? `Week ${overallWeekNumber}, ${year}` : `Week ${getWeekNumber(date)}, ${year}`;
    
    const popupContent = (event.desc && event.desc.trim()) ? 
        `<div class="mobile-popup-content md-content">${renderMarkdown(event.desc)}</div>` : 
        '';
    
    popup.innerHTML = `
        <button class="mobile-popup-close">&times;</button>
        <div class="mobile-popup-title">${dateStr}</div>
        <div class="mobile-popup-name">${renderMarkdown(event.name || 'Unnamed Event', true)}</div>
        ${popupContent}
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Show with animation
    requestAnimationFrame(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
    });
    
    // Close handlers
    const close = () => {
        hideMobilePopup();
    };
    
    overlay.addEventListener('click', close);
    popup.querySelector('.mobile-popup-close').addEventListener('click', close);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    currentMobilePopup = { overlay, popup };
    return currentMobilePopup;
};

const hideMobilePopup = () => {
    if (currentMobilePopup) {
        currentMobilePopup.overlay.classList.remove('show');
        currentMobilePopup.popup.classList.remove('show');
        
        setTimeout(() => {
            if (currentMobilePopup) {
                if (currentMobilePopup.overlay.parentNode) {
                    currentMobilePopup.overlay.parentNode.removeChild(currentMobilePopup.overlay);
                }
                if (currentMobilePopup.popup.parentNode) {
                    currentMobilePopup.popup.parentNode.removeChild(currentMobilePopup.popup);
                }
                currentMobilePopup = null;
            }
            document.body.style.overflow = '';
        }, 200);
    }
};

const createEventElement = (event, position, isEvenRow, weekNumber) => {
    const button = document.createElement('button');
    button.className = 'is-event brick-2x1'; // Events are always 2x1
    button.id = event.start;
    button.innerHTML = weekNumber; // Display the overall week number
    button.dataset.weekNumber = weekNumber; // Store week number for tooltip
    
    // Debug: log event details
    if (localStorage['sonnet::debug']) {
        console.log('Creating event element:', event);
        console.log('Week number:', weekNumber);
        console.log('Position:', position, 'IsEvenRow:', isEvenRow);
        console.log('Is mobile device:', isMobile());
        console.log('Has touch:', ('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        console.log('Has hover:', window.matchMedia('(hover: hover)').matches);
    }
    
    // Add hover functionality for all events
    if (isMobile()) {
        // Mobile: click for popup
        let touchStartTime = 0;
        
        button.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 500) { // Quick tap
                const weekNumber = button.dataset.weekNumber;
                createMobilePopup(event, weekNumber);
                trackEvent(`select:${event.name}`);
            }
        });
        
        // Fallback click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const weekNumber = button.dataset.weekNumber;
            createMobilePopup(event, weekNumber);
            trackEvent(`select:${event.name}`);
        });
    } else {
        // Desktop: hover for tooltip for all events
        let isHovering = false;
        
        if (localStorage['sonnet::debug']) {
            console.log('Adding desktop hover events for:', event.name);
        }
        
        button.addEventListener('mouseenter', () => {
            isHovering = true;
            if (localStorage['sonnet::debug']) {
                console.log('Mouse enter on event:', event.name);
            }
            showTooltipWithDelay(event, button);
        });
        
        button.addEventListener('mouseleave', () => {
            isHovering = false;
            if (localStorage['sonnet::debug']) {
                console.log('Mouse leave on event:', event.name);
            }
            // Add small delay before hiding to prevent flicker when moving between elements
            setTimeout(() => {
                if (!isHovering) {
                    hideTooltip();
                }
            }, 100);
        });
        
        // Also add mouseover and mouseout as fallbacks
        button.addEventListener('mouseover', () => {
            if (localStorage['sonnet::debug']) {
                console.log('Mouse over on event:', event.name);
            }
        });
        
        button.addEventListener('mouseout', () => {
            if (localStorage['sonnet::debug']) {
                console.log('Mouse out on event:', event.name);
            }
        });
        
        // Only add click handler for events with descriptions
        if (event.desc && event.desc.trim()) {
            button.classList.add('has-description');
            button.addEventListener('click', (e) => {
                e.preventDefault();
                hideTooltip(true); // Hide tooltip immediately when clicking
                showDescription(event);
                trackEvent(`select:${event.name}`);
            });
        }
    }
    
    return button;
};

const createLifeElement = (week, position, isEvenRow, startWeekNumber, startDate) => {
    const span = document.createElement('span');
    span.className = 'is-life';
    
    const isFuture = new Date(week.start).getTime() > new Date().getTime();
    if (isFuture) {
        span.classList.add('is-future');
    }
    
    // Create CSS-based squares - all life squares are 1x1
    for (let i = 0; i < week.duration; i++) {
        const square = document.createElement('span');
        square.className = 'life-square'; // All life squares are 1x1
        span.appendChild(square);
    }
    
    return span;
};

const createMarkerElement = (marker) => {
    const span = document.createElement('span');
    span.className = 'marker';
    
    if (marker.markerType === 'birthday') {
        span.className += ' birthday';
        span.textContent = `(${marker.name})`;
    } else if (marker.markerType === 'today') {
        span.className += ' today';
        span.id = '#today';
    }
    
    return span;
};

// Modal functionality
const showDescription = (event) => {
    const modal = document.getElementById('description-modal');
    const title = document.getElementById('description-title');
    const body = document.getElementById('description-body');
    
    const date = new Date(event.start);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const dateStr = `Week ${weekNumber}, ${year}`;
    
    title.textContent = dateStr;
    body.innerHTML = renderMarkdown(event.desc);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

const hideDescription = () => {
    const modal = document.getElementById('description-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
};

// Load and render the data
const loadData = async () => {
    try {
        // Fetch the YAML data from external file
        const response = await fetch('data.yml');
        if (!response.ok) {
            throw new Error(`Failed to fetch data.yml: ${response.status}`);
        }
        const dataYML = await response.text();
        
        // Parse the YAML data
        const ymlRecords = jsyaml.load(dataYML);
        
        const myWeeks = ymlRecords.reduce((acc, val) => {
            const ymlDate = Object.keys(val)[0];
            const date = new Date(ymlDate);
            const dateKey = getWeekID(date);
            
            return { ...acc, [dateKey]: val[ymlDate] };
        }, {});
        
        return { myWeeks };
    } catch (error) {
        console.error('Error loading data:', error);
        return { myWeeks: {} };
    }
};

// Main rendering function
const renderWeeks = (renderableWeeks, startDate) => {
    const container = document.getElementById('weeks-container');
    container.innerHTML = '';
    
    let currentPosition = 0; // Track horizontal position for staggered pattern
    let rowStartPosition = 0; // Track where each row starts for alternating pattern
    let isEvenRow = true; // Track if we're on an even or odd row
    let currentWeekNumber = 1; // Track overall week number
    
    renderableWeeks.forEach(week => {
        let element;
        
        if (week.type === 'event') {
            element = createEventElement(week, currentPosition, isEvenRow, currentWeekNumber);
            // Events are always 1x1, so increment by 1
            currentPosition += 1;
            currentWeekNumber += 1;
        } else if (week.type === 'uneventful') {
            element = createLifeElement(week, currentPosition, isEvenRow, currentWeekNumber, startDate);
            // Life elements can have multiple weeks, so increment by duration
            currentPosition += week.duration;
            currentWeekNumber += week.duration;
        } else {
            // Handle other types (markers, etc.)
            element = createLifeElement(week, currentPosition, isEvenRow, currentWeekNumber, startDate);
            currentPosition += 1;
            currentWeekNumber += 1;
        }
        
        container.appendChild(element);
        
        // Check if we've reached the end of a row (approximately 52 weeks)
        if (currentPosition - rowStartPosition >= 52) {
            isEvenRow = !isEvenRow;
            rowStartPosition = currentPosition;
        }
    });
};

// Initialize the application
const init = async () => {
    // Align start date to a Monday (beginning of week)
    const originalStart = new Date('1987-06-07');
    const startDate = new Date(getWeekID(originalStart));
    const today = new Date();
    // Align end date to a Sunday (end of week)
    const originalEnd = new Date('2057-07-08');
    const endWeekStart = new Date(getWeekID(originalEnd));
    const endDate = new Date(endWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    const data = await loadData();
    
    const renderableWeeks = calculateWeeks({
        from: startDate,
        to: endDate,
        events: data.myWeeks,
        today
    });
    
    renderWeeks(renderableWeeks, startDate);
    
    // Set up modal event listeners
    const modal = document.getElementById('description-modal');
    modal.addEventListener('click', hideDescription);
    
    // Set up global event listeners for tooltips and mobile popups
    document.addEventListener('click', (e) => {
        // Hide tooltip when clicking outside
        if (!e.target.closest('.is-event')) {
            hideTooltip(true);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideTooltip(true);
            hideMobilePopup();
            hideDescription();
        }
    });
    
    // Hide tooltips on scroll with throttling
    let scrollTimeout = null;
    document.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Hide immediately for better UX
        hideTooltip(true);
        
        // Prevent rapid calls
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
        }, 50);
    }, { passive: true });
    
    // Hide tooltips on window resize
    window.addEventListener('resize', () => {
        hideTooltip(true);
    }, { passive: true });
    
    // Set up intersection observer for end of content tracking
    setupEndOfContentTracking();
};

const setupEndOfContentTracking = () => {
    const loadedAt = Date.now();
    const minimumTimeOnPage = 1000;
    
    const lastEl = document.querySelector('#end-of-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (Date.now() - loadedAt < minimumTimeOnPage) return;
            trackEvent('reach:end');
            observer.disconnect();
        });
    });
    
    if (lastEl) {
        observer.observe(lastEl);
    }
};

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
