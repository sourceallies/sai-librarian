import React from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import Books from './Books';

jest.mock('../configuredDocumentClient');

describe('Book detail page', () => {
    let props;

    beforeEach(() => {
        props = {
            match: {
                params: {
                    id: 'abc123'
                }
            }
        };
        documentClient.get.mockReturnValue({
            async promise() {
                await wait();
                return {
                    Item: {
                        bookId: 'abc123',
                        title: 'A Great Project',
                    }
                };
            }
        });
    });

    describe('Book is loading', () => {
        let rendered;

        beforeEach(() => {
            rendered = render(<Books {...props} />);
        });

        it('should show the loading indicator', () => {
            expect(rendered.container).toHaveTextContent('Loading...');
        });
    });

    describe('The book is loaded successfully', () => {
        let rendered;

        beforeEach(async () => {
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show the book title', () => {
            expect(rendered.container).toHaveTextContent('A Great Project');
        });

    });
});