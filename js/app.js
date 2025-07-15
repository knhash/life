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

// The YAML data converted to JavaScript
const dataYML = `
- 1987-08-07:
    name: My parents eat scrambled eggs with honey mushrooms

- 1987-08-09:
    name: Some of that food
    desc: |
      ...becomes a sperm cell and, eventually, me.

      ![Me](assets/baby.jpg)

      My weight hasn't changed since.

- 1988-05-07:
    name: 'hello_world();'
    birthday: true
    desc: |
      I grew up in a tiny community (700 souls) in the mountains of southern Poland. 

      The place is called Kamionna, which means the *town of stones* in Polish. Ironically, the most common occupation (besides, unfortunately, alcoholism) is carpentry. Even the sculpted rays of light on the altar of our church are carved in wood.

      The region is known as the Island Mountains. It's an apt name, since they used to be an archipelago. 

      And you can still see that! In the morning the valleys are covered with mist, like a fluffy white sea, with only the tops of the mountains showing.

- 1989-05-10:
    name: 'my brother Marcin is born'

- 1989-06-06:
    name: I learn to talk

- 1989-11-02:
    name: I learn to walk

- 1991-02-15:
    name: 'my brother Jarek is born'

- 1992-06-01:
    name: 'I draw my first letter'
    desc: '## [R](https://sonnet.io/posts/face/)'

- 1993-02-01:
    name: My first glass of wine
    desc: |
      Left accidentally by my parents on the table.

      They found me climbing on furniture, huddled just under the ceiling.

- 1993-04-11:
    name: I see death for the first time

- 1993-07-03:
    name: 'I draw my first caricature'
    desc: "[here's how.](https://sonnet.io/posts/face/)"

- 1994-04-01:
    name: My great grandma dies
    desc: |
      She survived the Austro-Hungarian Empire, two World Wars and the Soviet Union.

      She was picking plums in our orchard till her 90s. 

      Then one day she fell asleep.

- 1994-09-01:
    name: 'First day of school'

- 1995-09-01:
    name: My first friend
    desc: |
      His first name is Jakub and his surname in English means "Little Darkness".

- 1994-09-08:
    name: I kick a rock on the way home
    desc: Ponder the nature of evil for the first time

- 1995-04-15:
    name: Mom moves abroad

- 1995-04-17:
    name: Diablo I comes out

- 1997-09-05:
    name: 'My first love'

- 1997-10-01:
    name: 'My first poem (poorly received)'
    desc: |
      It's a love poem, but it also contains references to Microsoft Windows 95. 

      I found the metaphor of window managers powerful.

- 1997-12-24:
    name: 'My first computer'
    desc: |
      Optimus, with P60, 8MB of RAM, windows 3.11. 
      I don't know why, but I still remember the serial number of the hard drive: Seagate ST3491A, 427.4 MB

- 1998-08-11:
    name: I cook for the first time!
    desc: Chicken thighs, grossly undercooked.

- 1998-08-16:
    name: My nanny teaches me about heavy metal

- 1998-09-07:
    name: 'My first computer program'
    desc: |
      It was a catalog of football players, listing their names, positions, clubs and talents. Written in [qbasic](https://archive.org/details/msdos_qbasic_megapack).

      I made a joke that Ronaldo's main talent was bladder control. Nothing against Ronaldo, but the program would've broken if I left the variable empty so I had to put something there.

- 1998-10-01:
    name: I play Diablo for the first time
    desc: |
      ![Two boys playing Diablo](assets/diablo.jpg)

      We drove 60km to the city to buy it in a shady bazaar.

- 1999-08-11:
    name: I see a website for the first time!
    desc: |
      Typed www.wurst.at in the locked browser window of a kiosk in Amadeus (an Austrian bookstore).

- 2000-09-01:
    name: 'I start middle school'

- 2001-03-15:
    name: '**Lateralus** comes out'
    desc: |
      From now on, every summer I'll spend half of my time in Saturn (an Austrian computer store) listening to music and trying to hack their internet kiosks.

      Listen [here](https://www.youtube.com/watch?v=Y7JG63IuaWs).

- 2002-02-16:
    name: My grandma dies
    desc: |
      She was in her 60s.

      She never had any grey hair or wrinkles. The only time I saw her not smiling was during the weeks before she passed away.

      (I was wondering why people say that smiling gives you wrinkles.)

- 2002-11-07:
    name: 'My teachers accuse me of running a cult'

- 2003-04-11:
    name: 'Sold my first website!'

- 2003-06-11:
    name: Photographed the first cemetery
    desc: Zentralfriedhof in Vienna

- 2003-07-05:
    name: First cigarette
    desc: |
      Overall rating: ★☆☆☆☆

      Would not recommend. It's a bit like an instagram account. Feels good for the first 5 minutes. Some people find it really hard to quit.

- 2004-09-01:
    name: 'Leaving home, moving to Krakow'

- 2004-11-01:
    name: My first RPG game
    desc: |
      It was Cyberpunk 2020. I introduced vampires to the game.

      The more experienced nerds in my group told me about Vampire: the Masquerade, which was the world I kept coming back to for the next 5 years.

- 2005-07-13:
    name: I join a Christian pilgrimage, it is strange
    desc: |
      Rating: ★★☆☆☆

      Nice people, terrible music, dubious game mechanics.

- 2006-01-12:
    name: Totentanz
    desc: A vampire-themed theatre group based in Krakow.

- 2006-03-24:
    name: Chief editor of Elysium
    desc: The biggest, and perhaps the edgiest Vampire-related publication in Poland at the time

- 2007-02-01:
    name: Started Fotoszopa.pl
    desc: |
      My first (legally recognized) company

- 2007-10-01:
    name: Started studying Linguistics and Psychology

- 2008-02-11:
    name: Adopted Maniek
    desc: The world's ugliest and sweetest cat who couldn't meow.

- 2008-10-01:
    name: Started Iranian Studies

- 2009-07-01:
    name: I live in the bushes, again

- 2011-04-24:
    name: Married to Kasia

- 2011-06-01:
    name: My parents get divorced
    desc: It's a happy day. Every divorce is a happy day here.

- 2011-12-01:
    name: Moved to Iran for a year

- 2011-12-06:
    name: Came back from Iran after 5 days

- 2011-12-18:
    name: Moved to Warsaw (my first team!)
    desc: Everyone is so much older than me. I buy thick glasses to look more serious.

- 2013-02-01:
    name: Move back to Krakow

- 2013-04-17:
    name: Met Peter
    desc: |
      during my first visit to London. 
      I didn't know it at the time, but he would become one of my best friends.

      Also, much, much later I realised that he was one of the people who taught me Flash a few years back via his [blog](https://web.archive.org/web/20071018024916/http://www.peterjoel.com/blog/)!

- 2013-05-10:
    name: Moved to London
    desc: to a serious fintech job

- 2013-06-10:
    name: I start doodling during boring work meetings

- 2013-09-01:
    name: CTO at Contentment
    desc: less serious startup job

- 2014-02-10:
    name: Move to Shoreditch

- 2015-08-25:
    name: Luna

- 2015-09-27:
    name: 10000 days

- 2015-12-28:
    name: ❤️
    desc: My heart dances, [December becomes April](https://www.youtube.com/watch?v=-LgYzva-xq8)

- 2016-04-22:
    name: Storienteer
    desc: Inaugurated with [Rainbotron](https://sonnet.io/projects#:~:text=VIEW%20CODE-,Rainbotron,-April%202016)

- 2016-06-27:
    name: Divorce party!
    desc: I'm lucky enough to gain a second family but never lose it

- 2016-07-02:
    name: Luna and I move in together

- 2016-07-10:
    name: Werework
    desc: |
      I was a host and co-founder of Werework—a creative tech speakeasy based in London.

      We'd meet (almost!) every full moon to drink, eat, talk, and play with digital experiments.

- 2017-02-17:
    name: First failed business

- 2017-07-17:
    name: A friend I didn't see as such dies

- 2017-07-19:
    name: I'm depressed (but don't know it yet)

- 2018-01-01:
    name: Sonnet

- 2019-11-17:
    name: I'm depressed (I realise that)

- 2019-12-20:
    name: Ensō
    desc: https://enso.sonnet.io

- 2020-07-02:
    name: Typeform

- 2020-08-01:
    name: Luna and I leave London, move to Porto

- 2020-08-17:
    name: First Come and Say Hi call
    desc: |
      By pure chance the first person to call me is one of my idols and someone whose work I followed more than a decade earlier.

      He can't afford to have a home, or even a bed to sleep in every night, and at the same time he works on making the web a place where people can be closer to each other.

- 2020-09-11:
    name: Making fig jam, therapy

- 2021-11-02:
    name: Potato.horse
    desc: |
      It's [here](https://potato.horse)
      Every time I attended a useless management meeting, a part of me would die. So I would take it out and put it in a tiny JPG file.

- 2021-11-11:
    name: Wavepaths

- 2022-10-16:
    name: Mango!
    desc: |
      Half Portuguese-Podengo, half New-Romantic edgelord. Picked up from a shelter in Porto.

- 2022-10-24:
    name: Learning, making toys

- 2024-10-14:
    name: Bye bye cigarettes

- 2030-10-24:
    name: 🐉 hic sunt dracones 🌊

- 2045-10-24:
    name: Life is Elsewhen
    desc: But will continue below

- 2056-04-05:
    name: 'I die (according to a prophecy)'
    desc: |
      The prophet was my ex-partner. I'll err on the side of caution.

      I hope it happens in the morning.

- 2056-04-08:
    name: "I'm buried"

- 2056-04-13:
    name: '🌳'

- 2056-08-13:
    name: "It's mushroom season!"

- 2056-10-13:
    name: "A honey mushroom grows, feeds of what's left from me"

- 2056-10-15:
    name: '2 tourists pass by and pick the mushroom'

- 2056-10-17:
    name: 'They make scrambled eggs with it'
    desc: It's quite delicious. Use plenty of butter and don't worry too much about overcooking them (they're quite moist).

- 2056-10-19:
    name: 'They make love'

- 2056-11-02:
    name: her heart starts beating

- 2057-07-07:
    name: 'helloWorld();'
`;

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
