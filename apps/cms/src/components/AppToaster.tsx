import { Toaster } from 'sonner';
import { useTheme } from '../theme/ThemeContext';

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      duration={4500}
      toastOptions={{
        className: 'cms-toast',
      }}
    />
  );
}
