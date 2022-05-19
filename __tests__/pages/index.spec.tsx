import React from 'react';

import { render, screen } from 'test-utils';

import Home from '@/pages/index';

describe('home', () => {
  it('renders a table headers', () => {
    expect.hasAssertions();
    render(<Home />);

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});
