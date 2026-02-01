# Max Verstappen Portfolio - React Version

## Performance Optimizations

This React version includes aggressive performance optimizations:

### ✅ Implemented Optimizations:
1. **FPS Throttling** - Limited to 60 FPS for blob cursor, 30 FPS for waves
2. **Reduced Wave Complexity** - Only 2 layers, larger step size (10px)
3. **Frame Skipping** - Waves render every 2 frames
4. **Passive Event Listeners** - Better browser performance
5. **Optimized Blob Cursor** - Custom implementation with minimal re-renders
6. **Will-change CSS** - GPU acceleration hints
7. **RequestAnimationFrame** - Proper frame timing
8. **Reduced Blur Effects** - Lower filterStdDeviation for better GPU performance

### 🎨 Features:
- Custom BlobCursor component with purple color scheme
- Image reveal effect on hover
- Animated wave background
- Responsive design
- Social media links

## Setup

### Required Files:
You need to add these image files to the `public/` folder:
- `max.webp` - Main photo of Max Verstappen
- `helm.webp` - Photo with helmet for reveal effect

### Install & Run:
```bash
npm install
npm run dev
```

## Performance Notes

If you're still experiencing high CPU usage on M4:
1. The blur effects in BlobCursor can be disabled by setting `useFilter={false}`
2. Wave animation can be disabled by commenting out the canvas rendering
3. Reduce `trailCount` in BlobCursor from 3 to 1 or 2

## Build for Production:
```bash
npm run build
npm run preview
```
