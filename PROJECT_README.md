# Psykie Web App - Project Setup

This is the web application for Psykie, built with React, Vite, TypeScript, and Tailwind CSS featuring a pastel pink design with 3D elements, glassmorphism, and cute animations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd /Users/johnenricosantiago/Documents/Psykie
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

## 🎨 Design Features

### Color Scheme
- **Primary**: Pastel Pink (#FFD1DC)
- **Accents**: Pastel Lavender, Peach, Mint
- **Background**: Gradient from Pastel Pink to Lavender

### Design Elements
- ✨ **Glassmorphism**: Frosted glass effect with blur
- 🔮 **Liquid Glass**: Animated gradient glass effect
- 🎯 **3D Elements**: Floating brain visualization using Three.js
- 🎈 **Cute Animations**: Smooth, playful animations with Framer Motion
- 💖 **Minimalistic**: Clean, modern interface

### Key Components

#### Navigation
- Responsive navigation bar with scroll effects
- Animated logo and menu items
- Glassmorphism background on scroll

#### Hero Section
- Animated background with floating circles
- Gradient text effects
- Interactive CTA buttons
- Scroll indicator

#### Mindy AI Assistant
- Interactive chat interface
- Animated avatar
- Message bubbles with smooth transitions
- Real-time response simulation

#### Feature Cards
- Glassmorphism cards with liquid glass effect
- Hover animations (3D tilt effect)
- Icon animations
- Gradient borders

#### 3D Visualizations
- Floating brain particle system
- Rotating orbital elements
- Sparkle effects
- Smooth camera movements

#### Statistics Section
- Animated counter numbers
- Glass cards with glow effects
- Responsive grid layout

## 📦 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **Icons**: Emoji + Custom SVG

## 📁 Project Structure

```
Psykie/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── .gitignore
```

## 🎯 Customization

### Changing Colors
Edit the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#FFF0F5',
    // ... add more shades
  },
  pastel: {
    pink: '#FFD1DC',
    lavender: '#E6E6FA',
    // ... add more pastel colors
  }
}
```

### Adding New Animations
Add new keyframes in `tailwind.config.js` or custom CSS in `index.css`:
```javascript
animation: {
  'new-animation': 'new-animation 3s ease-in-out infinite',
}
```

### 3D Components
Add new 3D elements using React Three Fiber in the App.tsx file:
```typescript
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌈 Design System

### Typography
- **Primary**: Inter (clean, modern sans-serif)
- **Display**: Playfair Display (elegant serif for headings)
- **Cute**: Comic Sans MS (for playful elements)

### Shadows
- `shadow-glass`: Soft glassmorphism shadow
- `shadow-glass-lg`: Larger glass effect
- `glow-pink`: Pink glow effect
- `glow-pink-lg`: Larger pink glow

### Transitions
All animations use smooth easing:
- Duration: 0.3s - 1s
- Easing: ease-out, ease-in-out
- Repeats: Infinite for decorative animations

## 🔧 Configuration

### Tailwind CSS
Custom theme extends default Tailwind with:
- Pastel color palette
- Custom animations
- Glassmorphism utilities
- 3D effects

### TypeScript
Strict mode enabled with:
- No implicit any
- Strict null checks
- ES2020 target

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Vercel
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

## 💡 Tips

- Use `npm run dev` for development with hot reloading
- Customize the Mindy chat component for actual AI integration
- Add more 3D elements by extending the Canvas components
- Use the liquid-glass class for glassmorphism effects
- Leverage Framer Motion's animation props for interactive elements

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)

---

**Built with ❤️ for Psychology Students and Professionals**
