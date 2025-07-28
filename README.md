# SafeTravels - LGBTQIA+ Travel Safety App

A cross-platform mobile application built with React Native that helps LGBTQIA+ travelers assess safety conditions in different countries around the world.

## Features

### 🎨 **Beautiful Login Page**
- Rainbow gradient "Safe Travels" title with cursive font
- Clean, modern login form with rounded corners and shadows
- Smooth animations and loading states

### 🌍 **Interactive Globe**
- 2D interactive globe representation
- Tap to select countries with visual feedback
- Pan gestures for globe interaction
- Color-coded country markers based on safety levels

### 🔍 **Smart Search**
- Real-time search functionality
- Search for countries by name
- Dropdown results with easy selection

### 📊 **Country Safety Ratings**
- Four-tier safety rating system:
  - 🟢 **Safe** (Green) - Generally safe with strong protections
  - 🟡 **Varies By Location** (Yellow) - Safety depends on specific regions
  - 🟠 **Avoid** (Orange) - Significant risks and restrictions
  - 🔴 **Dangerous** (Red) - Extremely dangerous, avoid travel

### 📰 **Latest News**
- Curated LGBTQIA+ news for each country
- Recent developments in rights and protections
- Source attribution and publication dates

## Project Structure

```
SafeTravels/
├── App.js                          # Main app component with navigation
├── package.json                    # Dependencies and scripts
├── app.json                       # Expo configuration
├── babel.config.js                # Babel configuration
├── components/
│   ├── LoginPage.js               # Login screen with rainbow title
│   ├── HomePage.js                # Interactive globe and search
│   ├── CountryModal.js            # Country detail modal with tabs
│   ├── SafetyRatingTab.js         # Safety rating information
│   └── NewsTab.js                 # News stories for each country
├── assets/
│   └── fonts/                     # Custom fonts (Dancing Script)
└── README.md                      # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafeTravels
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Download Fonts**
   - Download Dancing Script fonts from [Google Fonts](https://fonts.google.com/specimen/Dancing+Script)
   - Place the `.ttf` files in `assets/fonts/`:
     - `DancingScript-Regular.ttf`
     - `DancingScript-Bold.ttf`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS Simulator
- `npm run android` - Run on Android Emulator
- `npm run web` - Run in web browser

## Mock Data

The app uses comprehensive mock data for demonstration:

### Countries Available
- Canada (Safe)
- Uganda (Dangerous)
- Brazil (Varies By Location)
- Russia (Avoid)
- Australia (Safe)
- Japan (Safe)
- Germany (Safe)
- South Africa (Varies By Location)

### Safety Information
Each country includes:
- Safety rating with color coding
- Detailed description
- Key points about legal status
- Current conditions

### News Stories
Each country has 3 recent news stories covering:
- Legal developments
- Social progress
- Current events
- Community updates

## Technical Features

### State Management
- React hooks (`useState`, `useEffect`)
- Local state for UI interactions
- Mock data simulation with loading states

### Navigation
- React Navigation v6
- Stack navigation between screens
- Modal presentation for country details

### Animations
- React Native Reanimated
- Pan gesture handling for globe interaction
- Smooth transitions and loading animations

### Styling
- React Native StyleSheet
- Responsive design for different screen sizes
- Shadow effects and rounded corners
- Color-coded safety indicators

## Error Handling

- Input validation for login form
- Loading states for data fetching
- Fallback content for missing data
- Graceful error messages

## Future Enhancements

- Real API integration for live data
- User accounts and preferences
- Offline data storage
- Push notifications for safety alerts
- Community reviews and ratings
- Travel planning features
- Emergency contact information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a frontend demonstration app. All data is mock data and should not be used for actual travel planning. Always research current conditions and consult official sources before traveling. 