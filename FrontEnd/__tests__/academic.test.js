// __tests__/ProjectSearch.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Import required functions
import ProjectSearch from '../components/ProjectSearch'; // Adjust the path as needed

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        project_id: 1,
        title: 'Project A',
        industry: 'IT & Computer Science',
        discipline: 'Artificial Intelligence',
        duration: '4 Weeks',
        location_type: 'Online (Remote)',
        description: 'Project Objectives: Build an AI application.',
        publish_date: '2024-01-01',
        size: 'Small',
        Industry: { organisation: 'Tech Corp' }
      },
      // Add more mock projects if necessary
    ]),
  })
);

describe('ProjectSearch Component', () => {
  beforeEach(() => {
    render(<ProjectSearch />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search bar and header', () => {
    expect(screen.getByPlaceholderText('Keywords')).toBeInTheDocument();
    expect(screen.getByText(/any industry/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  test('fetches and displays projects', async () => {
    // Wait for projects to load
    await waitFor(() => expect(screen.getByText('Project A')).toBeInTheDocument());

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('IT & Computer Science - Artificial Intelligence')).toBeInTheDocument();
  });

  test('filters projects based on keywords', async () => {
    await waitFor(() => expect(screen.getByText('Project A')).toBeInTheDocument());

    // Type a keyword in the search bar
    fireEvent.change(screen.getByPlaceholderText('Keywords'), { target: { value: 'AI' } });
    fireEvent.click(screen.getByText(/search/i));

    expect(screen.getByText('Project A')).toBeInTheDocument();
  });

  test('shows no projects found when filter does not match', async () => {
    await waitFor(() => expect(screen.getByText('Project A')).toBeInTheDocument());

    // Type a keyword that doesn't match any projects
    fireEvent.change(screen.getByPlaceholderText('Keywords'), { target: { value: 'Nonexistent Project' } });
    fireEvent.click(screen.getByText(/search/i));

    expect(screen.getByText(/no matching projects found/i)).toBeInTheDocument();
  });
});
