# Life in Weeks

A life timeline visualization in pure HTML, CSS, and JavaScript.

## About

This application visualizes a life as a timeline of weeks, with interactive events, milestone markers, and descriptions. Originally built with Svelte and later converted to vanilla web technologies for simplicity and broader compatibility.

The application features a beautiful pine green color scheme that creates a calming, natural aesthetic while maintaining excellent readability and contrast.

## Features

## Features

- **Timeline visualization** with life events organized by weeks
- **Interactive event descriptions** with markdown support
- **Birthday markers** and anniversary tracking
- **"Today" marker** with animated heart
- **Future/past week differentiation**
- **Week number display** (ISO 8601 standard)
- **Modal popups** for detailed event information
- **Responsive design** for all screen sizes
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

The application uses a pine green color palette defined by CSS custom properties in `css/styles.css`:

```css
--color-bg: #f4f9f4;        /* Light pine green background */
--color-bg-fade: #f4f9f4ee; /* Background with transparency */
--color-text: #2d4a2d;      /* Dark pine green text */
--color-life: #6b8e6b;      /* Medium pine green for life dots */
--color-future: #c8dac8;    /* Light pine green for future weeks */
--color-link: rgb(34, 102, 68); /* Deep pine green for links */
```

To customize colors, simply modify these variables at the top of the CSS file.

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
```

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
