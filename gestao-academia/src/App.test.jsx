import React from 'react';
import { render, screen } from '@testing-library/react';

test('smoke: testing environment works', () => {
  render(<h1>Aplicação</h1>);
  expect(screen.getByText(/aplicação/i)).toBeInTheDocument();
});
