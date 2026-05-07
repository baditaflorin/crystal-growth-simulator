import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders project links, version, and presets', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /crystal growth simulator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /star/i })).toHaveAttribute(
      'href',
      'https://github.com/baditaflorin/crystal-growth-simulator'
    );
    expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute(
      'href',
      'https://www.paypal.com/paypalme/florinbadita'
    );
    expect(screen.getByRole('tab', { name: /snow/i })).toBeInTheDocument();
    expect(screen.getByText(/commit/i)).toBeInTheDocument();
  });
});
