import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import React from 'react';

describe('AuthContext', () => {
  it('renders children', () => {
    render(<AuthProvider>hello</AuthProvider>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
