# 🎰 Food Casino Roulette App

A fun and interactive React Native Expo app that helps you decide what to eat using casino-style roulette wheels! Perfect for when you can't decide between cooking at home or going out to eat.

## 🎯 Features

### 🏠 Home Food Roulette
- Spin the wheel to randomly select what to cook at home
- Realistic casino-style wheel with physics animations
- Bouncing ball animation that lands on your food choice

### 🍽️ Restaurant Roulette  
- Separate wheel for choosing restaurants
- Same exciting casino animations and physics
- Perfect for deciding where to dine out

### ⚙️ Customizable Lists
- Add your own foods and restaurants
- Remove items you don't want
- Reset to default lists anytime
- Data persists between app sessions

### 🎨 Casino-Style Design
- Modern, professional casino aesthetic
- Rich color scheme (gold, red, green, black)
- Smooth animations and visual feedback
- Responsive design for all mobile devices
- Dark theme optimized for mobile viewing

## 🚀 Getting Started

### Prerequisites
- Node.js (14 or higher)
- npm or yarn
- Expo CLI
- For APK build: EAS CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd foodcasino
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use an emulator

### Building APK

To build an APK for Android:

1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build APK:
   ```bash
   eas build --platform android --profile development
   ```

## 📱 How to Use

### Home Foods Wheel
1. Go to the "Home Foods" tab
2. Tap "SPIN THE WHEEL!" to start the roulette
3. Watch the realistic ball bounce and spin
4. See your randomly selected food result
5. Tap "Spin Again" to try another spin

### Restaurant Wheel
1. Switch to the "Restaurants" tab  
2. Spin the wheel to choose a restaurant
3. Get your dining destination
4. Perfect for date nights or family outings

### Managing Items
1. Go to the "Manage" tab
2. Switch between "Home Foods" and "Restaurants"
3. Add new items with the "Add New" button
4. Remove items by tapping the trash icon
5. Reset all data to defaults if needed

## 🎮 Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform and build service
- **React Navigation** - Tab navigation
- **React Native Reanimated** - Smooth animations and physics
- **React Native SVG** - Crisp graphics for the roulette wheel
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Beautiful iconography

## 🎨 Design Philosophy

The app follows a casino aesthetic with:
- **Rich Color Palette**: Gold accents (#FFD700), deep blues (#1a1a2e, #16213e)
- **Casino Colors**: Traditional roulette red, black, and green segments
- **Smooth Animations**: Physics-based spinning and bouncing
- **Modern UI**: Clean, intuitive interface optimized for mobile
- **Responsive Design**: Works perfectly on all screen sizes

## 🔧 Project Structure

```
src/
├── components/
│   └── RouletteWheel.js    # Main roulette wheel component
├── screens/
│   ├── HomeRouletteScreen.js      # Home foods roulette
│   ├── RestaurantRouletteScreen.js # Restaurant roulette
│   └── ManageItemsScreen.js       # Manage foods/restaurants
├── styles/
│   └── globalStyles.js     # Global styles and theme
└── utils/
    └── StorageService.js   # Data persistence utilities
```

## 🎰 Roulette Physics

The app features realistic casino roulette physics:
- **Wheel Spinning**: Multiple rotations with gradually decreasing speed
- **Ball Animation**: Realistic bouncing and spiral movement
- **Landing Physics**: Ball settles on winning segment with spring animation
- **Visual Feedback**: Smooth transitions and highlighting

## 📱 Responsive Design

- Adapts to all mobile screen sizes
- Optimized roulette wheel sizing
- Touch-friendly button sizes
- Proper spacing and typography scaling
- Dark theme reduces eye strain

## 🔄 Future Enhancements

Potential future features:
- Sound effects for spinning and winning
- Haptic feedback on spin results
- Statistics tracking (most selected items)
- Custom categories beyond food/restaurants
- Social sharing of results
- Themed roulette wheels

## 🐛 Troubleshooting

### Common Issues

1. **App won't start**: Make sure all dependencies are installed with `npm install`
2. **Animations lag**: Try running on a physical device instead of emulator
3. **Data not saving**: Check AsyncStorage permissions on device
4. **Build issues**: Clear cache with `expo start --clear`

### Performance Tips

- The app is optimized for 60fps animations
- Uses native drivers where possible for smooth performance
- Minimal re-renders through proper state management
- Efficient SVG rendering for crisp graphics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository.

---

Made with ❤️ and a lot of ☕ - Enjoy your food decisions! 🎰🍕🍔
