import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import BookCreate from './BookCreate';

jest.mock('../configuredDocumentClient');

describe('Book detail page', () => {
    let props;

    beforeEach(() => {
        props = {
            match: {
                params: {
                    id: 'abc123'
                }
            },
            history: {
                push: jest.fn()
            }
        };
        process.env.REACT_APP_BOOK_TABLE = 'books';
        documentClient.put.mockReturnValue({
            async promise() {
                await wait();
            }
        });
    });

    describe('The user enters all fields and submits the form', () => {
        let rendered;

        beforeEach(async () => {
            rendered = render(<BookCreate {...props} />);

            fireEvent.change(rendered.getByLabelText(/ISBN.*/), {target: {value: '0201634554'}});
            await wait(() => expect(rendered.getByLabelText(/ISBN.*/)).toHaveValue('0201634554'));

            fireEvent.change(rendered.getByLabelText(/Title.*/), {target: {value: 'A Great Project'}});
            await wait(() => expect(rendered.getByLabelText(/Title.*/)).toHaveValue('A Great Project'));

            fireEvent.change(rendered.getByLabelText(/Shelf.*/), {target: {value: 'Alpha'}});
            await wait(() => expect(rendered.getByLabelText(/Shelf.*/)).toHaveValue('Alpha'));

            fireEvent.click(rendered.getByText('Add book'));
            await wait();
        });

        it('should put the book to Dynamo DB', () => {
            expect(documentClient.put).toHaveBeenCalledWith({
                TableName: 'books',
                Item: {
                    bookId: 'abc123',
                    title: 'A Great Project',
                    isbn: '0201634554',
                    shelf: 'Alpha'
                }
            });
        });

        it('should navigate the user to the book detail page', () => {
            expect(props.history.push).toHaveBeenCalledWith('/books/abc123');
        });
    });
});