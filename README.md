# Life

A life timeline visualization in pure HTML, CSS, and JavaScript.

## About

This application visualizes a life as a timeline of days, with interactive events, milestone markers, and descriptions. Originally built with Svelte, it has been converted to vanilla web technologies for simplicity and broader compatibility.

## Features

## Features

- **Timeline visualization** with life events
- **Interactive event descriptions** with markdown support
- **Birthday markers** and anniversary tracking
- **"Today" marker** with animated heart
- **Future/past day differentiation**
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

### Adding Life Events

Edit the `dataYML` variable in `js/app.js`:

```javascript
const dataYML = `
- 2025-07-15:
    name: 'Your new event'
    desc: |
      Description with **markdown** support.
      
      ![Image](assets/your-image.jpg)
`;
```

### Modifying Styles

Edit `css/styles.css` to customize:
- Colors (CSS custom properties at the top)
- Typography
- Layout and spacing
- Animations

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
