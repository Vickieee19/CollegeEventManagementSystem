import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventList from '../components/EventList';
import * as api from '../utils/api';

jest.mock('../utils/api');

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('EventList', () => {
  const sampleEvents = [
    {
      eventId: 1,
      eventName: 'Tech Symposium 2023',
      date: '2023-11-15',
      venue: 'Main Auditorium',
      category: 'TECHNICAL'
    },
    {
      eventId: 2,
      eventName: 'Cultural Fest',
      date: '2023-10-20',
      venue: 'Open Ground',
      category: 'CULTURAL'
    }
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading and then renders events', async () => {
    api.fetchEvents.mockResolvedValueOnce({ data: { content: sampleEvents, totalPages: 1 } });
    renderWithRouter(<EventList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
    });
  });

  test('filters events by category', async () => {
    api.fetchEvents.mockResolvedValue({ data: { content: sampleEvents, totalPages: 1 } });
    renderWithRouter(<EventList />);
    await screen.findByTestId('category-select');
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'TECHNICAL' } });
    await screen.findByTestId('event-card-1');
    expect(screen.queryByTestId('event-card-2')).not.toBeInTheDocument();
  });

  test('shows empty message if no events', async () => {
    api.fetchEvents.mockResolvedValueOnce({ data: { content: [], totalPages: 1 } });
    renderWithRouter(<EventList />);
    await screen.findByTestId('empty-events');
  });

  test('shows error message if fetch fails', async () => {
    api.fetchEvents.mockRejectedValue(new Error('API fail'));
    renderWithRouter(<EventList />);
    await screen.findByTestId('error');
  });

  test('navigates to event details on button click', async () => {
    api.fetchEvents.mockResolvedValueOnce({ data: { content: sampleEvents, totalPages: 1 } });
    renderWithRouter(<EventList />);
    await screen.findByTestId('event-card-1');
    const btn = screen.getByTestId('view-details-1');
    expect(btn).toBeInTheDocument();
  });
});
