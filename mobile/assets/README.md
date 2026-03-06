# Assets

This directory contains app assets like icons and splash screens.

## Required Files

To run the app, you'll need to add the following image files:

- `icon.png` - App icon (1024x1024px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `splash.png` - Splash screen (1284x2778px recommended)
- `favicon.png` - Web favicon (48x48px)

## Generating Assets

You can use the following tools to generate app icons:

- [Expo Icon Generator](https://icon.kitchen/)
- [App Icon Generator](https://appicon.co/)

Or use a solid color placeholder for development:

```bash
# Create simple placeholder icons (requires ImageMagick)
convert -size 1024x1024 xc:#C4A57B icon.png
convert -size 1024x1024 xc:#C4A57B adaptive-icon.png
convert -size 1284x2778 xc:#C4A57B splash.png
convert -size 48x48 xc:#C4A57B favicon.png
```

## Design Guidelines

Follow the Swipely glitch museum aesthetic:
- Background: #C4A57B (muddy yellow)
- Accent: #7FCDFF (ice blue)
- Action: #FF4757 (bright red)
