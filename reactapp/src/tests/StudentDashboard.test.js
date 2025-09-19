import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentDashboard from '../components/StudentDashboard';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('StudentDashboard', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const registrations = [
    { registrationId: 12, event: { eventName: 'Event 1', date: '2024-01-01', venue: 'Auditorium' } },
    { registrationId: 13, event: { eventName: 'Event 2', date: '2024-01-02', venue: 'Hall' } },
  ];

  test('loads and shows student registrations', async () => {
    api.getStudentRegistrations.mockResolvedValueOnce({ data: registrations });
    render(<StudentDashboard />);
    fireEvent.change(screen.getByTestId('student-id-input'), { target: { value: 'S500' } });
    fireEvent.click(screen.getByTestId('load-registrations'));
    await screen.findByTestId('dashboard-registration-12');
    expect(screen.getByTestId('dashboard-registration-13')).toBeInTheDocument();
  });

  test('shows empty message if no registrations', async () => {
    api.getStudentRegistrations.mockResolvedValueOnce({ data: [] });
    render(<StudentDashboard />);
    fireEvent.change(screen.getByTestId('student-id-input'), { target: { value: 'S501' } });
    fireEvent.click(screen.getByTestId('load-registrations'));
    await screen.findByTestId('dashboard-empty');
  });

  test('shows loading indicator', async () => {
    api.getStudentRegistrations.mockResolvedValueOnce({ data: registrations });
    render(<StudentDashboard />);
    fireEvent.change(screen.getByTestId('student-id-input'), { target: { value: 'S502' } });
    fireEvent.click(screen.getByTestId('load-registrations'));
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
    await screen.findByTestId('dashboard-registration-12');
  });

  test('shows error message if API fails', async () => {
    api.getStudentRegistrations.mockRejectedValueOnce({ response: { data: { message: 'Student not found' } } });
    render(<StudentDashboard />);
    fireEvent.change(screen.getByTestId('student-id-input'), { target: { value: 'S503' } });
    fireEvent.click(screen.getByTestId('load-registrations'));
    await waitFor(() => expect(screen.getByTestId('dashboard-error')).toHaveTextContent('Student not found'));
  });
});
