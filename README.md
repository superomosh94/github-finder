```markdown
# GitHub Explorer 🔍

A powerful, feature-rich web application for exploring GitHub profiles and repositories with an intuitive interface and advanced filtering capabilities.

![GitHub Explorer](https://img.shields.io/badge/GitHub-Explorer-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔍 Smart Search & Discovery
- **User Search**: Find any GitHub user by username
- **Quick Suggestions**: Pre-loaded popular profiles (Microsoft, Facebook, Google, Torvalds)
- **Search History**: Automatically saves your last 5 searches with one-click access
- **Real-time Validation**: Instant feedback and error handling

### 👤 Rich Profile Display
- **Profile Overview**: Avatar, bio, location, company, and social links
- **GitHub Stats**: Public repositories, followers, following counts
- **Join Date**: Account creation date
- **Direct Links**: Quick access to GitHub profile and personal websites

### 📊 Advanced Repository Explorer
- **Table View**: Clean, space-efficient display of all repositories
- **Smart Sorting**: Sort by name, stars, forks, or last update
- **Advanced Filtering**:
  - **Text Search**: Search within repository names, descriptions, and languages
  - **Language Filter**: Filter by programming language (auto-detected)
  - **Star Filter**: Minimum star count requirements
  - **Content Filters**: Show only repos with descriptions or live websites
- **Pagination**: Navigate large repository collections easily
- **Real-time Updates**: Live filtering and sorting

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Smooth animations during data fetching
- **Error Handling**: User-friendly error messages
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, professional design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd github-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Development Mode (with auto-restart)
```bash
npm install -g nodemon
npm run dev
```

## 📁 Project Structure

```
github-explorer/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
├── .gitignore            # Git ignore rules
└── public/               # Frontend files
    ├── index.html        # Main HTML file
    ├── style.css         # Styles and responsive design
    └── script.js         # Frontend JavaScript with all features
```

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: GitHub REST API
- **Storage**: Browser localStorage for search history
- **Styling**: Custom CSS with modern design principles

## 🔧 API Routes

- `GET /api/user/:username` - Fetch GitHub user data
- `GET /api/user/:username/repos` - Fetch user repositories (with pagination)

## 🎯 How to Use

1. **Search for a User**
   - Enter a GitHub username in the search box
   - Click "Explore" or press Enter
   - Use quick suggestions or search history for fast access

2. **Explore Profile**
   - View user avatar, bio, and statistics
   - Check location, company, and social links
   - Click "View Profile on GitHub" to visit their profile

3. **Browse Repositories**
   - View all repositories in a clean table format
   - Use column headers to sort by different criteria
   - Apply filters to find specific repositories
   - Use pagination to navigate through large collections

4. **Advanced Filtering**
   - **Search**: Type to filter by name, description, or language
   - **Language**: Select specific programming languages
   - **Stars**: Set minimum star requirements
   - **Content**: Filter by description presence or live demo availability
   - **Clear**: Reset all filters with one click

## 🌟 Features in Detail

### Search History
- Automatically saves your last 5 searches
- Click on history items to quickly search again
- Persistent across browser sessions
- Clear history with the "Clear History" button

### Repository Table
- **Repository**: Name with direct GitHub link + live demo icon if available
- **Description**: Truncated with full text on hover
- **Stars**: Formatted count with star icon
- **Forks**: Formatted count with fork icon
- **Language**: Color-coded tags for easy scanning
- **Updated**: Date with full timestamp on hover

### Smart Filtering
- **Real-time Search**: Instant filtering as you type
- **Language Detection**: Auto-populated from user's repositories
- **Combined Filters**: Use multiple filters together
- **Results Counter**: Shows filtered/total repository count

### Responsive Design
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted interface with touch-friendly elements
- **Mobile**: Streamlined experience with vertical layout

## 📦 Deployment

### Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Other Platforms
The app can be deployed to:
- **Render**
- **Vercel**
- **Railway**
- **DigitalOcean App Platform**
- **Netlify** (with serverless functions)

## 🐛 Troubleshooting

### Common Issues

1. **User Not Found**
   - Check the username spelling
   - Ensure the user exists on GitHub
   - Verify internet connection

2. **Rate Limiting**
   - GitHub API has rate limits
   - The app includes proper error handling
   - Wait a few minutes if you hit limits

3. **Loading Issues**
   - Check browser console for errors
   - Verify all files are properly served
   - Ensure Node.js server is running

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the project**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple devices and browsers
- Update documentation for new features

## 🚧 Future Enhancements

- [ ] **Repository Statistics**: Charts and graphs for repo data
- [ ] **User Comparisons**: Compare multiple GitHub users
- [ ] **Advanced Analytics**: Code frequency, commit history
- [ ] **Export Options**: Export repository data to CSV/JSON
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Repository Bookmarks**: Save favorite repositories
- [ ] **Organization Support**: Browse GitHub organizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for providing the excellent REST API
- **Express.js** team for the robust web framework
- **Open Source Community** for inspiration and best practices

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with detailed information

---

**Happy Exploring!** 👨‍💻👩‍💻

*Discover amazing developers and their incredible projects with GitHub Explorer.*
```