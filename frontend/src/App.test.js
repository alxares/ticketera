import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the sidebar', () => {
    render(<App />);
    const sidebarElement = screen.getByRole('navigation'); // Asegúrate de que el Sidebar tenga un role adecuado
    expect(sidebarElement).toBeInTheDocument();
  });

  test('renders the topbar', () => {
    render(<App />);
    const topbarElement = screen.getByText(/Dashboard/i); // Busca el texto "Dashboard" en el Topbar
    expect(topbarElement).toBeInTheDocument();
  });

  test('renders the notification component', () => {
    render(<App />);
    const notificationElement = screen.getByText(/Notification/i); // Ajusta según el contenido de Notification
    expect(notificationElement).toBeInTheDocument();
  });

  test('renders the routes', () => {
    render(<App />);
    const contentElement = screen.getByRole('main'); // Asegúrate de que el contenido principal tenga un role adecuado
    expect(contentElement).toBeInTheDocument();
  });
});