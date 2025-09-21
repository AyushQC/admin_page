# College API Admin Panel

A modern, responsive admin panel for managing colleges through the College API. Built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Secure Authentication**: HTTP Basic Auth integration with your API
- **College Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Search & Filter**: Search colleges by name, address, or programs; filter by district
- **Excel Export**: Download college data as Excel files
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization with your API
- **Modern UI**: Clean, professional interface with Font Awesome icons

## 📁 Project Structure

```
college-admin/
├── index.html          # Main admin interface
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── server.js           # Local development server
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## 🔧 Setup & Installation

### Option 1: Direct File Access
1. Simply open `index.html` in your web browser
2. The admin panel will connect directly to your deployed API

### Option 2: Local Development Server
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   npm start
   ```

3. Open your browser to: `http://localhost:3000`

## 🔐 Login Credentials

Use the same credentials configured in your API's `.env` file:
- **Username**: `admin` (or your custom username)
- **Password**: Your secure password from the API

## 🏥 API Integration

The admin panel is configured to work with your deployed API:
- **API URL**: `https://collegeapi-mnni.onrender.com`
- **Authentication**: HTTP Basic Auth
- **CORS**: Enabled for cross-origin requests

## 📋 Features Overview

### 🔍 College List View
- View all colleges in card format
- Search by college name, address, or programs
- Filter by district
- Real-time filtering and search
- Edit and delete actions for each college

### ➕ Add/Edit College Form
- **Basic Information**: Name, district, address
- **Location**: Google Maps links and embed URLs
- **Contact Details**: Phone, email, website
- **Programs**: Multiple programs with cutoffs, eligibility, and medium
- **Facilities**: Checklist of available amenities
- **Validation**: Required field validation and data formatting

### 📊 Export Functionality
- Download all college data as Excel file
- Includes all college information in structured format
- One-click export with authentication

### 🎨 UI Features
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Visual feedback during API calls
- **Success/Error Messages**: Toast notifications for user feedback
- **Form Validation**: Client-side validation with error messages
- **Confirmation Dialogs**: Safety confirmations for delete operations

## 🛠 Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Font Awesome**: Professional icons
- **Responsive Design**: Mobile-first approach

### API Integration
- **Fetch API**: Modern promise-based HTTP requests
- **Authentication**: Base64 encoded Basic Auth headers
- **Error Handling**: Comprehensive error catching and user feedback
- **Local Storage**: Persistent login sessions

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🔒 Security Features

- ✅ **Secure Authentication**: HTTP Basic Auth with API
- ✅ **Input Validation**: Client-side and server-side validation
- ✅ **CORS Handling**: Proper cross-origin request handling
- ✅ **Session Management**: Secure credential storage
- ✅ **Error Handling**: Safe error messages without sensitive data

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Compact, touch-friendly interface

## 🚀 Deployment Options

### GitHub Pages (Recommended) 🌟
**Free hosting with automatic updates!**
- **Setup**: See `DEPLOYMENT.md` for complete guide
- **URL**: `https://username.github.io/repo-name`
- **Auto-deploy**: Push code → Automatic deployment
- **Cost**: Completely free
- **HTTPS**: Included automatically

### Other Static Hosting
- **Netlify**: Drag and drop the files
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Static website hosting

### Node.js Hosting (Optional)
For local development only:
- **Local**: `npm start` for development
- **Heroku**: Node.js buildpack
- **Railway**: Node.js deployment

## 🔧 Customization

### Changing API URL
Edit `script.js` line 2:
```javascript
const API_BASE_URL = 'your-new-api-url';
```

### Styling Customization
- Modify `styles.css` for custom styling
- Change color scheme by updating CSS variables
- Add custom fonts or icons

### Adding Features
- Extend `script.js` for additional functionality
- Add new form fields in `index.html`
- Create additional API integrations

## 📖 Usage Guide

### 1. Login
- Enter your admin credentials
- Credentials are validated against your API
- Session is saved for convenience

### 2. View Colleges
- Browse all colleges in the list view
- Use search to find specific colleges
- Filter by district for focused viewing

### 3. Add New College
- Click "Add College" in navigation
- Fill out the comprehensive form
- Add multiple programs with details
- Select applicable facilities
- Submit to create the college

### 4. Edit College
- Click "Edit" on any college card
- Form pre-populates with existing data
- Make changes and save
- Changes are immediately reflected

### 5. Delete College
- Click "Delete" on college card
- Confirm the deletion action
- College is permanently removed

### 6. Export Data
- Click "Export Excel" in header
- File downloads automatically
- Contains all college data in spreadsheet format

## 🐛 Troubleshooting

### Common Issues

1. **Login Failed**
   - Check username/password with API settings
   - Verify API is running and accessible

2. **CORS Errors**
   - Ensure your API has CORS enabled
   - Check browser console for specific errors

3. **Loading Issues**
   - Check internet connection
   - Verify API URL is correct
   - Check browser console for errors

### Debug Mode
Open browser console (F12) to see detailed error messages and API responses.

## 📞 Support

For issues related to:
- **Admin Panel**: Check browser console and network tab
- **API Integration**: Verify API endpoints and authentication
- **Deployment**: Check hosting service documentation

## 🔄 Updates

To update the admin panel:
1. Download the latest files
2. Replace existing files
3. Clear browser cache
4. Re-login if needed

---

**Built with ❤️ for efficient college management**
