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

        it('should fetch books from the table', () => wait(() => {
            expect(documentClient.scan).toHaveBeenCalledWith(expect.objectContaining({
                TableName: 'books'
            }));
        }));
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
            expect(rendered.queryByTitle('Available')).toBeVisible();
        });
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

    describe('Dynamo response has an LastEvaluatedKey indicating more records are available', () => {
        let rendered;

        beforeEach(() => {
            documentClient.scan.mockReturnValueOnce({
                async promise() {
                    await wait();
                    return {
                        Items: [
                            {
                                bookId: 'first1',
                                title: 'First page Book'
                            }
                        ],
                        LastEvaluatedKey: {foo: 'bar'}
                    };
                }
            });
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});
        });

        it('should show the books that have loaded', () => wait(() => {
            expect(rendered.container).toHaveTextContent('First page Book');
        }));

        it('should fetch the next page of books', () => wait( () => {
            expect(documentClient.scan).toHaveBeenCalledWith({
                TableName: 'books',
                ExclusiveStartKey: {foo: 'bar'}
            });
        }));

        it('should show the loading indicator', async () => {
            await wait();
            expect(rendered.container).toHaveTextContent('Loading...');
        });
    });

    describe('The second page of results is loaded from Dynamo', () => {
        let rendered;

        beforeEach(async () => {
            documentClient.scan.mockReturnValueOnce({
                async promise() {
                    return {
                        Items: [
                            {
                                bookId: 'first1',
                                title: 'First page Book'
                            }
                        ],
                        LastEvaluatedKey: {foo: 'bar'}
                    };
                }
            });
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});
            await wait();
            await wait();
        });

        it('should not show the loading indicator', () => {
            expect(rendered.container).not.toHaveTextContent('Loading...');
        });

        it('should show the books from the first page', () => {
            expect(rendered.container).toHaveTextContent('First page Book');
        });

        it('should show the book from the second page', () => {
            expect(rendered.container).toHaveTextContent('A Great Project');
        });
    });
});