// src/Main.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from './pages/Main'; // Adjust the import path if needed

test('renders Main component', () => {
  render(<Main />);
  const mainElement = screen.getByText(/Main/i);
  expect(mainElement).toBeInTheDocument();
});
