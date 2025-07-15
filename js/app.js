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
const getDayID = (date) => date.toISOString().split('T')[0];

const ONE_DAY = 24 * 60 * 60 * 1000;

const getNumberOfDaysBetweenDates = (from, to) =>
    Math.round((to.getTime() - from.getTime()) / ONE_DAY);

const getBirthdays = (birthdayDayID, to, today) => {
    const todayID = getDayID(today);
    const birthdayDate = new Date(birthdayDayID);
    const result = [];

    let startDate = new Date(birthdayDate.getTime());
    startDate.setFullYear(startDate.getFullYear() + 1);
    let years = 1;

    while (startDate.getTime() < to.getTime()) {
        const start = getDayID(startDate);
        if (start !== todayID) {
            const marker = {
                type: 'marker',
                markerType: 'birthday',
                start: getDayID(startDate),
                name: years.toString()
            };

            result.push([new Date(startDate), marker]);
        }
        startDate.setFullYear(startDate.getFullYear() + 1);
        years++;
    }

    return result;
};

const calculateDays = ({ from, to, events = {}, today }) => {
    const eventsArr = Object.entries(events);
    const renderableEvents = eventsArr.map(([dateStr, dayMeta]) => {
        const date = new Date(dateStr);
        const day = {
            ...dayMeta,
            start: getDayID(date),
            type: 'event'
        };
        return [date, day];
    });

    const renderableToday = {
        start: getDayID(today),
        type: 'marker',
        markerType: 'today'
    };

    renderableEvents.push([today, renderableToday]);

    const birthday = eventsArr.find(([_, { birthday }]) => birthday);
    const birthdayMarkers = birthday ? getBirthdays(birthday[0], to, today) : [];
    renderableEvents.push(...birthdayMarkers);

    renderableEvents.sort((eventA, eventB) => eventA[0].getTime() - eventB[0].getTime());

    const maybeLastEvent = renderableEvents[renderableEvents.length - 1];

    if (typeof maybeLastEvent === 'undefined')
        return [
            {
                type: 'uneventful',
                start: getDayID(from),
                duration: getNumberOfDaysBetweenDates(from, to)
            }
        ];

    const shouldAddDaysAfter = getNumberOfDaysBetweenDates(new Date(maybeLastEvent[0]), to) > 0;

    const dayRecordDates = renderableEvents.reduce(
        (all, [currDate, curr]) => {
            const daysBefore = getNumberOfDaysBetweenDates(all.lastDate, currDate);

            const event = curr;

            if (!(daysBefore > 0))
                return {
                    lastDate: new Date(currDate.getTime() + ONE_DAY),
                    days: [...all.days, event]
                };

            const uneventful = {
                type: 'uneventful',
                start: getDayID(all.lastDate),
                duration: daysBefore
            };

            return {
                lastDate: new Date(currDate.getTime() + ONE_DAY),
                days: [...all.days, uneventful, event]
            };
        },
        { lastDate: new Date(from), days: [] }
    );

    if (!shouldAddDaysAfter) return dayRecordDates.days;

    const daysAfter = {
        type: 'uneventful',
        start: getDayID(new Date(maybeLastEvent[0].getTime() + ONE_DAY)),
        duration: getNumberOfDaysBetweenDates(maybeLastEvent[0], to)
    };

    return [...dayRecordDates.days, daysAfter];
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

const createTooltip = (event, targetElement) => {
    // Clear any existing timeout
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    const date = new Date(event.start);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateStr = new Intl.DateTimeFormat('en-US', options).format(date);
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${dateStr}</div>
        <div class="tooltip-content md-content">${renderMarkdown(event.desc)}</div>
    `;
    
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
        currentTooltip = createTooltip(event, targetElement);
        tooltipTimeout = null;
    }, 200); // Reduced delay for better responsiveness
};

// Mobile popup functionality
let currentMobilePopup = null;

const createMobilePopup = (event) => {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'mobile-popup';
    
    const date = new Date(event.start);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateStr = new Intl.DateTimeFormat('en-US', options).format(date);
    
    popup.innerHTML = `
        <button class="mobile-popup-close">&times;</button>
        <div class="mobile-popup-title">${dateStr}</div>
        <div class="mobile-popup-content md-content">${renderMarkdown(event.desc)}</div>
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

const createEventElement = (event) => {
    const button = document.createElement('button');
    button.className = 'is-event';
    button.id = event.start;
    
    if (event.desc) {
        button.classList.add('has-description');
        
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
                    createMobilePopup(event);
                    trackEvent(`select:${event.name}`);
                }
            });
            
            // Fallback click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                createMobilePopup(event);
                trackEvent(`select:${event.name}`);
            });
        } else {
            // Desktop: hover for tooltip, click for full modal
            let isHovering = false;
            
            button.addEventListener('mouseenter', () => {
                isHovering = true;
                showTooltipWithDelay(event, button);
            });
            
            button.addEventListener('mouseleave', () => {
                isHovering = false;
                // Add small delay before hiding to prevent flicker when moving between elements
                setTimeout(() => {
                    if (!isHovering) {
                        hideTooltip();
                    }
                }, 100);
            });
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                hideTooltip(true); // Hide tooltip immediately when clicking
                showDescription(event);
                trackEvent(`select:${event.name}`);
            });
        }
    }
    
    button.innerHTML = renderMarkdown(event.name, true);
    return button;
};

const createLifeElement = (day) => {
    const span = document.createElement('span');
    span.className = 'is-life';
    
    const isFuture = new Date(day.start).getTime() > new Date().getTime();
    if (isFuture) {
        span.classList.add('is-future');
    }
    
    const text = Array(day.duration).fill('·').join('​');
    span.textContent = text;
    
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
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    title.textContent = new Intl.DateTimeFormat('en-US', options).format(date);
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
        
        const myDays = ymlRecords.reduce((acc, val) => {
            const ymlDate = Object.keys(val)[0];
            const date = new Date(ymlDate);
            const dateKey = getDayID(date);
            
            return { ...acc, [dateKey]: val[ymlDate] };
        }, {});
        
        return { myDays };
    } catch (error) {
        console.error('Error loading data:', error);
        return { myDays: {} };
    }
};

// Main rendering function
const renderDays = (renderableDays) => {
    const container = document.getElementById('days-container');
    container.innerHTML = '';
    
    renderableDays.forEach(day => {
        let element;
        
        if (day.type === 'event') {
            element = createEventElement(day);
        } else if (day.type === 'marker') {
            element = createMarkerElement(day);
        } else {
            element = createLifeElement(day);
        }
        
        container.appendChild(element);
    });
};

// Initialize the application
const init = async () => {
    const startDate = new Date('1987-06-07');
    const today = new Date();
    const endDate = new Date('2057-07-08');
    
    const data = await loadData();
    
    const renderableDays = calculateDays({
        from: startDate,
        to: endDate,
        events: data.myDays,
        today
    });
    
    renderDays(renderableDays);
    
    // Set up modal event listeners
    const modal = document.getElementById('description-modal');
    modal.addEventListener('click', hideDescription);
    
    // Set up global event listeners for tooltips and mobile popups
    document.addEventListener('click', (e) => {
        // Hide tooltip when clicking outside
        if (!e.target.closest('.is-event.has-description')) {
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
