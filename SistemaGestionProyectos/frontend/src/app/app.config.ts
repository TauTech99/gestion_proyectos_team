import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth-interceptor';

const MidnightAmber = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03'
    },
    colorScheme: {
      dark: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#0D0D1A',
          hoverColor: '{primary.400}',
          activeColor: '{primary.600}'
        },
        highlight: {
          background: 'rgba(245, 158, 11, 0.16)',
          focusBackground: 'rgba(245, 158, 11, 0.24)',
          color: '{primary.300}',
          focusColor: '{primary.200}'
        },
        surface: {
          0:   '#FFFFFF',
          50:  '#F4F4F7',
          100: '#E4E4EC',
          200: '#C8C8D6',
          300: '#A1A1B5',
          400: '#7A7A92',
          500: '#5A5A75',
          600: '#3A3A5C',
          700: '#2A2A45',
          800: '#22223C',
          900: '#1A1A2E',
          950: '#0D0D1A'
        },
        formField: {
          background: '#22223C',
          disabledBackground: '#1A1A2E',
          filledBackground: '#22223C',
          filledHoverBackground: '#2A2A45',
          filledFocusBackground: '#2A2A45',
          borderColor: '#2A2A45',
          hoverBorderColor: '#3A3A5C',
          focusBorderColor: '{primary.500}',
          invalidBorderColor: '#FB7185',
          color: '#F4F4F7',
          disabledColor: '#A1A1B5',
          placeholderColor: '#7A7A92',
          floatLabelColor: '#A1A1B5',
          floatLabelFocusColor: '{primary.400}',
          floatLabelInvalidColor: '#FB7185',
          iconColor: '#A1A1B5',
          focusRing: {
            color: '{primary.500}',
            width: '2px',
            style: 'solid',
            shadow: 'none'
          }
        },
        content: {
          background: '#1A1A2E',
          hoverBackground: '#22223C',
          borderColor: '#2A2A45',
          color: '#F4F4F7',
          hoverColor: '#FFFFFF'
        },
        overlay: {
          select: {
            background: '#1A1A2E',
            borderColor: '#2A2A45',
            color: '#F4F4F7'
          },
          popover: {
            background: '#1A1A2E',
            borderColor: '#2A2A45',
            color: '#F4F4F7'
          },
          modal: {
            background: '#1A1A2E',
            borderColor: '#2A2A45',
            color: '#F4F4F7'
          }
        },
        text: {
          color: '#F4F4F7',
          hoverColor: '#FFFFFF',
          mutedColor: '#A1A1B5',
          hoverMutedColor: '#C8C8D6'
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: MidnightAmber,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
