import { render, screen } from '@testing-library/react';
import Clients from '../Clients';
import React from 'react';

describe('Clients Page', () => {
  it('renders loading state', () => {
    render(<Clients />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
