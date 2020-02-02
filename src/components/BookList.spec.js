import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import BookList from './BookList';
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from 'react-router-dom';
import {useBookData} from '../utils/book-api.js';

jest.mock('../configuredDocumentClient');
jest.mock('../utils/book-api.js');

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
            },
            {
                bookId: 'xyz987',
                title: 'No Image Book',
                isbn: '00011122',
                shelf: 'Alpha',
                checkedOutBy: undefined
            }
        ];

        useBookData.mockImplementation((isbn) => {
            const returnMap = {
                '0201634554': {
                    cover: {
                        small: 'https://example.org/a-great-project.png'
                    }
                },
                '12323124': {
                    cover: {
                        small: 'https://example.org/senior-software-engineer.png'
                    }
                }
            }
            
            return returnMap[isbn];
        });

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
            books.forEach((book) => expect(rendered.container).toHaveTextContent(book.title));
        });

        it('should show that the book is available', () => {
            rendered.queryAllByTitle('Available').forEach((availableTag) => {
                expect(availableTag).toBeVisible();
            });
        });

        it('should automatically focus on the search box', () => {
            expect(rendered.getByPlaceholderText('Search')).toHaveFocus();
        });

        it('should properly render the images', () => {
            const greatProjectImage = rendered.getByTestId('0201634554-cover');
            const seniorSoftwareImage = rendered.getByTestId('12323124-cover');

            expect(greatProjectImage).toHaveAttribute('alt', 'Cover for A Great Project');
            expect(greatProjectImage).toHaveAttribute('src', 'https://example.org/a-great-project.png');

            expect(seniorSoftwareImage).toHaveAttribute('alt', 'Cover for The Senior Software Engineer');
            expect(seniorSoftwareImage).toHaveAttribute('src', 'https://example.org/senior-software-engineer.png');
        });

        it('should not render an image if one is not found', () => {
            expect(rendered.queryByTestId('00011122-cover')).not.toBeInTheDocument();
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

    describe('The user types into the search box', () => {
        let rendered;

        beforeEach(async () => {
            rendered = render(<BookList {...props} />, {wrapper: MemoryRouter});

            await wait(() =>  expect(rendered.container).not.toHaveTextContent('Loading...'));

            fireEvent.change(rendered.getByPlaceholderText('Search'), {
                target: {
                    value: 'project'
                }
            });
        });

        it('should show titles containing the entered text', () => {
            expect(rendered.getByText(books[0].title)).toBeVisible();
        });

        it('should not show books if their title does not contain the entered query', () => {
            expect(rendered.queryByText(books[1].title)).not.toBeInTheDocument();
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