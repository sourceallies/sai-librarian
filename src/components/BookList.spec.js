import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import BookList from './BookList';
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from 'react-router-dom';

jest.mock('../configuredDocumentClient');

describe('Book list page', () => {
    let props;
    let books;

    beforeEach(() => {
        props = {
            history: {
                push: jest.fn()
            }
        };
        books = [
            {
                bookId: 'abc123',
                title: 'A Great Project',
                isbn: '0201634554',
                shelf: 'Alpha',
                checkedOutBy: undefined
            },
            {
                bookId: 'def456',
                title: 'The Senior Software Engineer',
                isbn: '12323124',
                shelf: 'Alpha',
                checkedOutBy: undefined
            }
        ];
        process.env.REACT_APP_BOOK_TABLE = 'books';
        documentClient.scan.mockReturnValue({
            async promise() {
                await wait();
                return {
                    Items: books
                };
            }
        });
    });

    describe('Books are loading', () => {
        let rendered;

        beforeEach(() => {
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});
        });

        it('should show the loading indicator', () => {
            expect(rendered.container).toHaveTextContent('Loading...');
        });
    });

    describe('Books have successfully loaded', () => {
        let rendered;

        beforeEach(async () => {
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});
            await wait(() =>  expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show the book title', () => {
            expect(rendered.container).toHaveTextContent('A Great Project');
        });

        it('should show that the book is available', () => {
            rendered.queryAllByTitle('Available').forEach((availableTag) => {
                expect(availableTag).toBeVisible();
            });
        });

        it('should let a user filter for books by title', async () => {
            fireEvent.change(rendered.getByPlaceholderText('Search'), {
                target: {
                    value: 'the'
                }
            });

            await wait(() => {
                expect(rendered.getByText('The Senior Software Engineer')).toBeVisible();
                expect(rendered.queryByText('A Great Project')).not.toBeInTheDocument();
            });

            fireEvent.change(rendered.getByPlaceholderText('Search'), {
                target: {
                    value: 'project'
                }
            });

            await wait(() => {
                expect(rendered.getByText('A Great Project')).toBeVisible();
                expect(rendered.queryByText('The Senior Software Engineer')).not.toBeInTheDocument();
            })
        })
    });

    describe('Books are unavailable', () => {
        let rendered;

        beforeEach(async () => {
            books[0].checkedOutBy = 'Ben';
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});
            await wait(() =>  expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show that the book is not available', () => {
            expect(rendered.queryByTitle('Not Available')).toBeVisible();
        });
    });

    describe('The user clicks on the book', () => {
        let rendered;
        let history;

        beforeEach(async () => {
            books[0].checkedOutBy = 'Ben';
            history = createMemoryHistory();
            rendered = render(<Router history={history}><BookList {...props} /></Router>);
            await wait(() =>  expect(rendered.container).not.toHaveTextContent('Loading...'));
            fireEvent.click(rendered.getByText('A Great Project'));
        });

        it('should navigate the user to the book detail page', () => {
            expect(history.location.pathname).toEqual('/books/abc123');
        });
    });
});