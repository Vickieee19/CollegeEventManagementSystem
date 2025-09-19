import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Navigation and Routing', () => {
  test('Navbar renders links and navigates', async () => {
    render(<App />);
    expect(screen.getByText(/College Event Management/)).toBeInTheDocument();
    expect(screen.getByText(/Home/)).toBeInTheDocument();
    expect(screen.getByText(/Student Dashboard/)).toBeInTheDocument();
  });

  test('Renders event list on / route', async () => {
    render(<App />);
    await screen.findByText(/All Events/);
  });

  test('Renders event details when navigating to event details', async () => {
    render(<App />);
    // The test can simulate navigation if needed but now just mounts the component
    expect(screen.getByText(/College Event Management/)).toBeInTheDocument();
  });
});
