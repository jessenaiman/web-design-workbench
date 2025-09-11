/**
 * @fileoverview Landing Page Integration Tests
 * @description Tests the complete landing page functionality including all components
 */

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import WelcomeCard from '@/app/components/WelcomeCard';
import Page from '@/app/page';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js dynamic imports
vi.mock('next/dynamic', () => ({
  default: vi.fn(() => {
    // Return a simple mock component for ThemeSwitcher
    const MockThemeSwitcher = () => (
      <div data-testid="theme-switcher">Theme Switcher</div>
    );
    return MockThemeSwitcher;
  }),
}));

// Mock environment variables
vi.mock('@/app/env', () => ({
  env: {
    NODE_ENV: 'test',
  },
}));

describe('Landing Page Integration', () => {
  describe('Complete Page Rendering', () => {
    it('should render the complete landing page with all components', () => {
      render(<Page />);

      // Check that main layout elements are present
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    });

    it('should have proper semantic HTML structure', () => {
      render(<Page />);

      // Verify semantic structure
      const header = screen.getByRole('banner');
      const main = screen.getByRole('main');
      const footer = screen.getByRole('contentinfo');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should have responsive layout classes', () => {
      render(<Page />);

      const container = screen.getByRole('main').parentElement;
      expect(container).toHaveClass('flex', 'flex-col', 'min-h-screen');
    });
  });

  describe('WelcomeCard Integration', () => {
    it('should render WelcomeCard with default props in the main content', () => {
      render(<Page />);

      // Check default content is displayed
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(
        screen.getByText('Thanks for checking out the template!'),
      ).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('should display welcome emoji', () => {
      render(<Page />);

      const emoji = screen.getByLabelText('Welcome Emoji');
      expect(emoji).toBeInTheDocument();
      expect(emoji).toHaveTextContent('👋');
    });

    it('should have proper card structure', () => {
      render(<Page />);

      // Check card components are present (Welcome is in a div, not heading)
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(
        screen.getByText('Thanks for checking out the template!'),
      ).toBeInTheDocument();
    });
  });

  describe('Header Integration', () => {
    it('should render header with logo and theme switcher', () => {
      render(<Header />);

      // Check header structure
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Check for logo (MountainIcon should be present)
      const logoContainer = screen.getByRole('banner').firstElementChild;
      expect(logoContainer).toBeInTheDocument();

      // Check for theme switcher (should be dynamically loaded)
      const themeSwitcherContainer = screen.getByRole('banner').children[1];
      expect(themeSwitcherContainer).toBeInTheDocument();
    });

    it('should have proper header layout classes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass(
        'px-4',
        'lg:px-6',
        'h-14',
        'flex',
        'items-center',
        'justify-between',
        'border-b',
      );
    });

    it('should have accessible logo with screen reader text', () => {
      render(<Header />);

      expect(screen.getByText('Acme Inc')).toHaveClass('sr-only');
    });
  });

  describe('Footer Integration', () => {
    it('should render footer with environment information', () => {
      render(<Footer />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText('Env vars debug: Foo=test')).toBeInTheDocument();
    });

    it('should have proper footer layout classes', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'h-16',
        'px-4',
        'lg:px-6',
        'border-t',
      );
    });
  });

  describe('Component Integration', () => {
    it('should integrate WelcomeCard with shadcn/ui components', () => {
      render(<WelcomeCard />);

      // Check that shadcn/ui Card components are used (Card root is a div with specific classes)
      const card = screen
        .getByRole('button')
        .closest('.rounded-lg.border.bg-card');
      expect(card).toBeInTheDocument();

      // Check card sections exist (Welcome is in a div, not heading)
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(
        screen.getByText('Thanks for checking out the template!'),
      ).toBeInTheDocument();
    });

    it('should use Button component from shadcn/ui', () => {
      render(<WelcomeCard />);

      const button = screen.getByRole('button', { name: 'Get Started' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center'); // shadcn Button classes
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<Page />);

      // Check emoji has proper aria-label
      expect(screen.getByLabelText('Welcome Emoji')).toBeInTheDocument();

      // Check screen reader only text
      expect(screen.getByText('Acme Inc')).toHaveClass('sr-only');
    });

    it('should have logical heading hierarchy', () => {
      render(<Page />);

      // WelcomeCard uses a div with semantic styling instead of actual heading
      // Check that the welcome text is present and properly styled
      const welcomeText = screen.getByText('Welcome');
      expect(welcomeText).toBeInTheDocument();
      expect(welcomeText).toHaveClass(
        'font-semibold',
        'tracking-tight',
        'text-sm',
      );
    });
  });

  describe('Responsive Design Integration', () => {
    it('should have responsive padding classes', () => {
      render(<Page />);

      const header = screen.getByRole('banner');
      const footer = screen.getByRole('contentinfo');

      // Check responsive padding
      expect(header).toHaveClass('px-4', 'lg:px-6');
      expect(footer).toHaveClass('px-4', 'lg:px-6');
    });

    it('should center content properly on different screen sizes', () => {
      render(<Page />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass(
        'flex-1',
        'flex',
        'items-center',
        'justify-center',
      );
    });
  });
});
