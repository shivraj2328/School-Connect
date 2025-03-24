/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    textDim: '#6B7280',
    primary: '#3B82F6',
    error: '#EF4444',
    border: '#E5E7EB',
    inputBg: '#F9FAFB',
    success: '#10B981'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    textDim: '#9BA1A6',
    primary: '#3B82F6',
    error: '#EF4444',
    border: '#27272A',
    inputBg: '#27272A',
    success: '#10B981'
  },
};
