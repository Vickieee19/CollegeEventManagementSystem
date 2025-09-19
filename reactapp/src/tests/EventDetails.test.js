import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EventDetails from '../components/EventDetails';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('EventDetails', () => {
  const event = {
    eventId: 12,
    eventName: 'Test Event',
    description: 'Details',
    date: '2023-12-10',
    time: '15:00',
    venue: 'Hall 42',
    capacity: 5,
    category: 'TECHNICAL'
  };

  function renderComponent(eventId = 12) {
    return render(
      <MemoryRouter initialEntries={[`/events/${eventId}`]}>
        <Routes>
          <Route path="/events/:eventId" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });




  test('disables registration button when full', async () => {
    api.fetchEventById.mockResolvedValueOnce({ data: event });
    api.getEventRegistrations.mockResolvedValueOnce({ data: [{},{},{},{},{}] });
    renderComponent();
    await waitFor(() => expect(screen.getByTestId('register-btn')).toBeDisabled());
  });

  test('registers student successfully', async () => {
    api.fetchEventById.mockResolvedValueOnce({ data: event });
    api.getEventRegistrations.mockResolvedValueOnce({ data: [] });
    api.registerForEvent.mockResolvedValueOnce({});
    renderComponent();
    await screen.findByTestId('register-btn');
    fireEvent.change(screen.getByTestId('student-id-input'), { target: { value: 'S200' } });
    fireEvent.click(screen.getByTestId('register-btn'));
    await screen.findByTestId('success-msg');
  });

  
});
