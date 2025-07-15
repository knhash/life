# Life in Weeks

A life timeline visualization in pure HTML, CSS, and JavaScript.

## About

This application visualizes a life as a timeline of weeks, with interactive events, milestone markers, and descriptions. Originally built with Svelte and later converted to vanilla web technologies for simplicity and broader compatibility.

The application features a beautiful pine green color scheme that creates a calming, natural aesthetic while maintaining excellent readability and contrast.

## Features

- **Brick wall timeline visualization** with life events organized by weeks
- **Decade-based color coding** with pastel colors representing different life stages
- **Age-specific visual progression** from childhood (yellow) through old age (gray)
- **Interactive event bricks** with hover tooltips on desktop and tap popups on mobile
- **Enhanced borders** with darker 2px borders for better brick definition
- **100-year lifespan view** spanning from birth to century mark
- **Overall week numbering** counting sequentially from Week 1 of life
- **Responsive tooltip system** with improved reliability for rapid navigation
- **Birthday markers** and anniversary tracking
- **"Today" marker** with animated heart
- **Future/past week differentiation** with decade-appropriate styling
- **Modal popups** for detailed event information with markdown support
- **Responsive design** for all screen sizes with device-specific interactions
- **No build process** required - just serve the files

## Technology Stack

- **HTML** (`index.html`) - Page structure and metadata
- **CSS** (`css/styles.css`) - All styling and animations
- **JavaScript** (`js/app.js`) - Core functionality and data processing
- **External Libraries**:
  - marked.js (v5.1.1) - Markdown parsing
  - js-yaml (v4.1.0) - YAML data parsing

## File Structure

```
├── index.html              # Main HTML file
├── data.yml               # Life events data (YAML format)
├── package.json           # Optional npm configuration  
├── README.md              # This file
├── css/
│   └── styles.css         # All styles
├── js/
│   ├── app.js            # Main application logic
│   ├── marked.min.js     # Markdown parsing library
│   └── js-yaml.min.js    # YAML parsing library
└── assets/
    ├── *.jpg             # Life event images
    ├── *.webp            # Background images
    └── favicon.png       # Site icon
```

## Quick Start

1. **Clone or download** this repository
2. **Serve the files** using any web server:

   **Option 1: Python (recommended)**
   ```bash
   python3 -m http.server 8080
   ```

   **Option 2: Node.js**
   ```bash
   npx http-server . -p 8080
   ```

   **Option 3: Any web server**
   - Copy files to your web server directory
   - Access `index.html`

3. **Open** http://localhost:8080 in your browser

## Customization

### Color Scheme

The application uses a decade-based pastel color system that represents different stages of life, defined by CSS custom properties in `css/styles.css`:

**Base Colors:**
```css
--color-bg: #f4f9f4;        /* Light pine green background */
--color-bg-fade: #f4f9f4ee; /* Background with transparency */
--color-text: #2d4a2d;      /* Dark pine green text */
--color-life: #6b8e6b;      /* Medium pine green for life dots */
--color-future: #c8dac8;    /* Light pine green for future weeks */
--color-link: rgb(34, 102, 68); /* Deep pine green for links */
```

**Decade Colors (Age-Based):**
```css
--decade-0s: #ffeaa7;     /* 0-9 years - Pastel yellow (childhood) */
--decade-10s: #a29bfe;    /* 10-19 years - Pastel purple (teens) */
--decade-20s: #74b9ff;    /* 20-29 years - Pastel blue (twenties) */
--decade-30s: #fd79a8;    /* 30-39 years - Pastel pink (thirties) */
--decade-40s: #fdcb6e;    /* 40-49 years - Pastel orange (forties) */
--decade-50s: #6c5ce7;    /* 50-59 years - Pastel purple (fifties) */
--decade-60s: #00b894;    /* 60-69 years - Pastel teal (sixties) */
--decade-70s: #e84393;    /* 70-79 years - Pastel magenta (seventies) */
--decade-80s: #b2bec3;    /* 80-89 years - Pastel gray (eighties) */
--decade-future: #ddd;    /* 90+ years - Light gray (future) */
```

Each decade features matching darker borders for enhanced definition and visual clarity. Event bricks display full opacity colors while life squares show subtle translucent versions.

### Adding Life Events

Edit the `data.yml` file in the root directory. Events are grouped by the week they fall in:

```yaml
- 2025-07-15:
    name: 'Your new event'
    desc: |
      Description with **markdown** support.
      
      This event will appear in Week 29, 2025.
      
      ![Image](assets/your-image.jpg)
```

**Note**: Events that fall within the same week (Monday-Sunday) will be grouped together and display the same week number.

### Modifying Styles

Edit `css/styles.css` to customize:
- **Colors**: Modify CSS custom properties for theme changes
- **Typography**: Font families, sizes, and spacing
- **Layout**: Grid, spacing, and responsive breakpoints
- **Animations**: Heart animation and transitions
- **Background**: Clean solid color (background images removed for minimalist design)

### Adding Images

1. Add image files to the `assets/` directory
2. Reference them in event descriptions: `![Alt text](assets/filename.jpg)`

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS custom properties (variables)
- Intersection Observer API

## Development

No build process required! Simply:
1. Edit files directly
2. Refresh browser to see changes
3. Deploy by copying files to any web server

## License

MIT - Feel free to fork and modify for your own life timeline.

## Credits

Originally inspired by Buster Benson's [Life in Weeks](https://busterbenson.com/life-in-weeks).

Later created by [@rafalpast](https://sonnet.io).

Now modified by [@knhash](https://knhash.in).

## Recent Changes

### v5.2 - Font Size Standardization & Mobile Modal Improvements (July 2025)

- **Comprehensive font size standardization**: Converted all inconsistent font sizes (px, mixed rem/em values) to use a unified `rem`-based system
- **CSS custom property scale**: Implemented standardized font size variables:
  - `--font-size-small: 1.125rem` (18px) - Small text and tooltips
  - `--font-size-base: 1.25rem` (20px) - Body text and standard elements
  - `--font-size-medium: 1.5rem` (24px) - Modal titles and subheadings
  - `--font-size-large: 2rem` (32px) - Header text
  - `--font-size-xl: 3rem` (48px) - Close buttons and large icons
  - `--font-size-xxl: 4rem` (64px) - Main title and heart animation
- **Improved modal readability**: Significantly increased font sizes in mobile popups and tooltips with `!important` declarations to override conflicting styles
- **Enhanced markdown content styling**: Applied consistent typography to all markdown-rendered content in modals
- **Optimized layout width**: Reduced max content width from 140ch (2240px) to 80rem (1280px) for better readability and modern web standards
- **Responsive header padding**: Improved horizontal spacing that scales properly with the larger font sizes:
  - Mobile: 2rem padding (doubled from 1rem)
  - 600px+: 5rem padding
  - 1200px+: 6rem padding (new breakpoint)
- **Accessibility improvements**: All font sizes now respect user browser preferences and scale appropriately
- **Maintainability**: Centralized font sizing system makes future adjustments much easier

### v5.1 - Enhanced Layout & Sticky Header (July 2025)

- **Full-width brick wall timeline**: Extended the weeks container to use the full viewport width while keeping header and text content constrained for optimal readability
- **Sticky header with full-width background**: Implemented a sticky header that spans the entire viewport width but maintains constrained text content aligned with the body
- **Responsive padding system**: Added intelligent padding that scales with viewport size using `max()` functions to ensure proper spacing on all screen sizes
- **Improved visual hierarchy**: Clear separation between constrained text content and full-width interactive timeline
- **Better space utilization**: Timeline now spreads out more effectively across wide screens while maintaining appropriate margins
- **Backdrop blur effects**: Added subtle backdrop filtering to the sticky header for enhanced visual depth
- **Responsive breakpoints**: Comprehensive media queries ensure optimal layout across mobile, tablet, and desktop devices

### v5.0 - Decade-Based Pastel Design & 100-Year Lifespan (July 2025)

- **Age-based decade visualization**: Implemented decade-based color coding for life stages (0-9, 10-19, 20-29, etc.)
- **Pastel color scheme**: Replaced gradients with clean pastel colors for each decade of life
- **Enhanced borders**: Added darker, more prominent 2px borders to all bricks for better definition
- **100-year lifespan**: Extended timeline to exactly 100 years from birth date (1988-2088)
- **Improved tooltip responsiveness**: Fixed critical bug where rapidly moving between events would prevent tooltips from showing
- **Decade-specific styling**: Each life decade has unique pastel background and darker border colors:
  - **0-9 years**: Pastel yellow with gold border (childhood)
  - **10-19 years**: Pastel purple with purple border (teens)
  - **20-29 years**: Pastel blue with blue border (twenties)
  - **30-39 years**: Pastel pink with magenta border (thirties)
  - **40-49 years**: Pastel orange with orange border (forties)
  - **50-59 years**: Pastel purple with purple border (fifties)
  - **60-69 years**: Pastel teal with teal border (sixties)
  - **70-79 years**: Pastel magenta with red border (seventies)
  - **80-89 years**: Pastel gray with gray border (eighties)
  - **90+ years**: Light gray for future decades
- **Life square styling**: Non-event weeks display subtle translucent versions of decade colors
- **Optimized interaction**: Eliminated problematic timeout delays in mouse event handling for more reliable tooltip display

### v4.0 - Brick Wall Visualization (July 2025)

- **Complete visual redesign**: Transformed from text-based timeline to interactive brick wall visualization
- **Brick-based layout**: Events displayed as 2x1 green bricks, non-event weeks as 1x1 empty squares
- **Overall week numbering**: Week numbers now count sequentially from birth (Week 1, 2, 3...) instead of calendar weeks
- **Enhanced tooltips**: Desktop hover tooltips show week number, event name, and description with improved positioning
- **Mobile popup system**: Touch-friendly popups for mobile devices with overlay and smooth animations
- **CSS grid styling**: Precise brick dimensions (64px×32px base, 130px×32px for events) with consistent spacing
- **Typography improvements**: Monospace font with optimized size (16px), weight (300), and letter-spacing
- **Interactive hover effects**: Color transitions and shadow effects for better user feedback
- **Responsive design**: Automatic device detection for mobile vs desktop interaction patterns
- **Debug mode**: Built-in logging system for development and troubleshooting

### v3.0 - Weeks Instead of Days (July 2025)

- **Week-based timeline**: Converted from daily to weekly visualization for a more condensed lifetime view
- **Week number display**: Events now show "Week X, YYYY" format using ISO 8601 standard
- **Monday-Sunday weeks**: Aligned to standard business week format starting on Monday
- **Grouped events**: Events within the same week are now grouped together
- **Improved date handling**: All date calculations updated to work with week boundaries
- **Container updates**: Updated HTML structure and CSS classes from "days" to "weeks"

### v2.1 - External Data File (July 2025)

- **Data externalization**: Moved life events data from JavaScript to external `data.yml` file
- **Easier editing**: Life events can now be edited directly from the root directory
- **Better separation**: Cleaner code structure with data separated from logic
- **Maintained compatibility**: No changes to YAML format or functionality

### v2.0 - Pine Green Theme (July 2025)

- **Complete color scheme overhaul**: Migrated from pink theme to calming pine green palette
- **Removed background images**: Simplified design with clean solid background for better focus on content
- **Enhanced accessibility**: Improved color contrast and readability
- **CSS custom properties**: All colors now use CSS variables for easy customization
- **Event highlighting**: Updated event backgrounds and hover states to match new theme
