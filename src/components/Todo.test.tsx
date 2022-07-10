import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';

describe('Todo App', () => {
    it('shows the correct title', () => {
        render(<Todo />);
        const linkElement = screen.getByText(/My Todos/i);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toBeDefined();
        expect(linkElement).toBeVisible();
    });
    it('show the input fields for a new todo item', async () => {
        render(<Todo />)
        const nameLabelRef = screen.getByLabelText(/Name/i);
        expect(nameLabelRef).toBeDefined();
        expect(nameLabelRef).toBeInTheDocument();
        expect(nameLabelRef).toBeVisible();

        const nameInputRef = screen.getByPlaceholderText(/Enter Name/i);
        expect(nameInputRef).toBeDefined();
        expect(nameInputRef).toBeInTheDocument();
        expect(nameInputRef).toBeVisible();

        userEvent.type(nameInputRef, 'New todo')
        expect(nameInputRef).toHaveValue('New todo')
    });
})
