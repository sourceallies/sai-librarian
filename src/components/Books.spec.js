import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import Books from './Books';

jest.mock('../configuredDocumentClient');

describe('Book detail page', () => {
    let props;
    let book;

    beforeEach(() => {
        props = {
            match: {
                params: {
                    id: 'abc123'
                }
            },
            user: {
                profile: {
                    name: 'Ben',
                    email: 'ben@sourceallies.com'
                }
            },
            history: {
                push: jest.fn()
            }
        };
        book = {
            bookId: 'abc123',
            title: 'A Great Project',
            isbn: '0201634554',
            shelf: 'Alpha',
            checkedOutBy: undefined
        };
        process.env.REACT_APP_BOOK_TABLE = 'books';
        documentClient.get.mockReturnValue({
            async promise() {
                await wait();
                return {
                    Item: book
                };
            }
        });
        documentClient.update.mockReturnValue({
            async promise() {
                await wait();
                return {
                    Attributes: {
                        checkedOutBy: book.checkedOutBy ? undefined : 'Ben'
                    }
                };
            }
        })
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

    describe('The book with the given Id does not exist', () => {
        let rendered;

        beforeEach(async () => {
            book = undefined;
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should navigate to the book create page', () => {
            expect(props.history.push).toHaveBeenCalledWith('/books/abc123/create');
        });
    });

    describe('The book fails to load', () => {
        let rendered;

        beforeEach(async () => {
            documentClient.get.mockReturnValue({
                async promise() {
                    await wait();
                    throw new Error('Error loading book');
                }
            });
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should not navigate the user', () => {
            expect(props.history.push).not.toHaveBeenCalled();
        });

        it('should show the error message', () => {
            expect(rendered.container).toHaveTextContent('Error loading book');
        });
    });

    describe('The book is loaded successfully and available', () => {
        let rendered;

        beforeEach(async () => {
            book.checkedOutBy = undefined;
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show the book title', () => {
            expect(rendered.container).toHaveTextContent('A Great Project');
        });

        it('should show the book isbn', () => {
            expect(rendered.container).toHaveTextContent('0201634554');
        });

        it('should show the book as available', () => {
            expect(rendered.container).toHaveTextContent('This book is available');
        });

        it('should show the shelf the book is on', () => {
            expect(rendered.container).toHaveTextContent('This book is located on shelf Alpha');
        });

        it('should have a checkout button', () => {
            expect(rendered.queryByText('Check Out')).toBeInTheDocument();
        });
    });

    describe('The user clicks the check out button', () => {
        let rendered;

        beforeEach(async () => {
            jest.spyOn(global.Date, 'now')
                .mockReturnValue(new Date('2019-05-14T11:01:58.135Z').valueOf());

            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
            fireEvent.click(rendered.getByText('Check Out'));
        });

        it('should submit an update to dynamo', () => {
            expect(documentClient.update).toHaveBeenCalledWith({
                TableName: 'books',
                Key: {
                    bookId: 'abc123'
                },
                UpdateExpression: "set checkedOutBy=:l, checkOutEvents=list_append(if_not_exists(checkOutEvents, :emptyList), :checkedOutEvents)",
                ExpressionAttributeValues: {
                    ':l': 'Ben',
                    ':emptyList': [],
                    ':checkedOutEvents': [
                            {
                            timestamp: '2019-05-14T11:01:58.135Z',
                            name: 'Ben',
                            email: 'ben@sourceallies.com'
                        }
                    ]
                },
                ReturnValues: 'UPDATED_NEW'
            });
        });

        it('should show the check out success message', () => wait(() => {
            expect(rendered.queryByText('Book successfully checked out')).toBeInTheDocument();
        }));

        it('should show the book is Unvailable', () => wait(() => {
            expect(rendered.container).toHaveTextContent('Currently checked out by Ben');
        }));

        it('should show the shelf the book', () => wait(() => {
            expect(rendered.container).toHaveTextContent('Return this book to shelf Alpha');
        }));

        it('should have a return button', () => wait(() => {
            expect(rendered.queryByText('Return')).toBeInTheDocument();
        }));
    });

    describe('The book is loaded successfully and is checked out', () => {
        let rendered;

        beforeEach(async () => {
            book.checkedOutBy = 'Ben';
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show the book title', () => {
            expect(rendered.container).toHaveTextContent('A Great Project');
        });

        it('should show the book isbn', () => {
            expect(rendered.container).toHaveTextContent('0201634554');
        });

        it('should show the book is not available', () => {
            expect(rendered.container).not.toHaveTextContent('This book is available');
        });

        it('should show the book is Unvailable', () => {
            expect(rendered.container).toHaveTextContent('Currently checked out by Ben');
        });

        it('should show the shelf the book', () => {
            expect(rendered.container).toHaveTextContent('Return this book to shelf Alpha');
        });

        it('should have a return button', () => {
            expect(rendered.queryByText('Return')).toBeInTheDocument();
        });
    });

    describe('The user clicks the return button', () => {
        let rendered;

        beforeEach(async () => {
            jest.spyOn(global.Date, 'now')
                .mockReturnValue(new Date('2019-05-14T11:01:58.135Z').valueOf());
            book.checkedOutBy = 'Ben';
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
            fireEvent.click(rendered.getByText('Return'));
        });

        it('should submit an update to dynamo', () => {
            expect(documentClient.update).toHaveBeenCalledWith({
                TableName: 'books',
                Key: {
                    bookId: 'abc123'
                },
                UpdateExpression: "set checkedOutBy=:l, returnEvents=list_append(if_not_exists(returnEvents, :emptyList), :returnEvents)",
                ExpressionAttributeValues: {
                    ':l': null,
                    ':emptyList': [],
                    ':returnEvents': [
                        {
                            timestamp: '2019-05-14T11:01:58.135Z',
                            name: 'Ben',
                            email: 'ben@sourceallies.com'
                        }
                    ]
                },
                ReturnValues: 'UPDATED_NEW'
            });
        });

        it('should show the check out success message', () => wait(() => {
            expect(rendered.queryByText('Book successfully returned')).toBeInTheDocument();
        }));

        it('should show the book as available', () => wait(() => {
            expect(rendered.container).toHaveTextContent('This book is available');
        }));

        it('should show the shelf the book is on', () => wait(() => {
            expect(rendered.container).toHaveTextContent('This book is located on shelf Alpha');
        }));

        it('should have a checkout button', () => wait(() => {
            expect(rendered.queryByText('Check Out')).toBeInTheDocument();
        }));
    });
});