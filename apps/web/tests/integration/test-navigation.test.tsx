/**
 * @fileoverview Navigation Integration Tests
 * @description Tests the navigation components including Header and responsive behavior
 */

import Header from '@/app/components/Header';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js dynamic imports
vi.mock('next/dynamic', () => ({
  default: vi.fn(() => {
    // Return a mock ThemeSwitcher component
    const MockThemeSwitcher = () => (
      <button
        type="button"
        data-testid="theme-switcher"
        aria-label="Toggle theme"
        onClick={() => {}}
      >
        <svg data-testid="sun-icon" />
      </button>
    );
    return MockThemeSwitcher;
  }),
}));

// Mock the MountainIcon component
vi.mock('@/app/components/icons/MountainIcon', () => ({
  default: vi
    .fn()
    .mockImplementation(({ className }: { className?: string }) => (
      <svg
        className={className}
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="mountain-icon"
      >
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    )),
}));

describe('Navigation Integration', () => {
  describe('Header Component', () => {
    it('should render header with all navigation elements', () => {
      render(<Header />);

      // Check header structure
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Check logo is present
      const logo = screen.getByTestId('mountain-icon');
      expect(logo).toBeInTheDocument();

      // Check screen reader text for logo
      expect(screen.getByText('Acme Inc')).toHaveClass('sr-only');
    });

    it('should have proper header layout and styling', () => {
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

    it('should render theme switcher component', () => {
      render(<Header />);

      // Theme switcher should be rendered
      const themeSwitcher = screen.getByTestId('theme-switcher');
      expect(themeSwitcher).toBeInTheDocument();
    });

    it('should handle theme switcher interactions', () => {
      render(<Header />);

      const themeButton = screen.getByTestId('theme-switcher');

      // Click the theme button
      fireEvent.click(themeButton);

      // The component should still be present after interaction
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Responsive Navigation', () => {
    it('should have responsive padding for different screen sizes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');

      // Check responsive classes
      expect(header).toHaveClass('px-4'); // Mobile padding
      expect(header).toHaveClass('lg:px-6'); // Desktop padding
    });

    it('should maintain layout integrity across screen sizes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');

      // Check flexbox layout classes
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });

  describe('Logo Integration', () => {
    it('should render logo with proper accessibility attributes', () => {
      render(<Header />);

      const logo = screen.getByTestId('mountain-icon');
      expect(logo).toBeInTheDocument();
      // Logo should be an SVG element
      expect(logo.tagName).toBe('svg');
    });

    it('should have proper logo dimensions', () => {
      render(<Header />);

      const logo = screen.getByTestId('mountain-icon');
      // Logo should have some size-related attributes or classes
      expect(logo).toHaveAttribute('width');
      expect(logo).toHaveAttribute('height');
    });

    it('should be properly positioned in header layout', () => {
      render(<Header />);

      const logoContainer = screen.getByTestId('mountain-icon').parentElement;
      // Container should have flexbox classes for proper positioning
      expect(logoContainer).toHaveClass('flex');
    });
  });

  describe('Navigation Accessibility', () => {
    it('should have proper semantic navigation structure', () => {
      render(<Header />);

      // Header should have banner role
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should provide screen reader context for navigation', () => {
      render(<Header />);

      // Check for screen reader only text
      expect(screen.getByText('Acme Inc')).toHaveClass('sr-only');
    });

    it('should have focusable navigation elements', () => {
      render(<Header />);

      // Theme switcher should be focusable
      const themeButton = screen.getByTestId('theme-switcher');
      expect(themeButton).toHaveAttribute('aria-label', 'Toggle theme');
    });
  });

  describe('Theme Switcher Integration', () => {
    it('should integrate theme switcher with proper button attributes', () => {
      render(<Header />);

      const themeButton = screen.getByTestId('theme-switcher');

      // Check button attributes
      expect(themeButton).toHaveAttribute('type', 'button');
      expect(themeButton).toHaveAttribute('aria-label', 'Toggle theme');
    });

    it('should render theme icon within switcher', () => {
      render(<Header />);

      // Check for sun icon (default theme)
      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });
  });
});
