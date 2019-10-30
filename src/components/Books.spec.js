import React from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react';
import documentClient from '../configuredDocumentClient';
import Books from './Books';
import configuredDocumentClient from '../configuredDocumentClient';

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
                    name: 'Ben'
                }
            }
        };
        book = {
            bookId: 'abc123',
            title: 'A Great Project',
            isbn: '0201634554',
            isAvailable: true
        };
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
                return {};
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

    describe('The book is loaded successfully and available', () => {
        let rendered;

        beforeEach(async () => {
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
            expect(rendered.container).toHaveTextContent('Available');
        });

        it('should have a checkout button', () => {
            expect(rendered.queryByText('Check Out')).toBeInTheDocument();
        });
    });

    describe('The user clicks the check out button', () => {
        let rendered;

        beforeEach(async () => {
            process.env.REACT_APP_BOOK_TABLE = 'books';
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
            fireEvent.click(rendered.getByText('Check Out'));
        });

        it('should submit an update to dynamo', () => {
            expect(configuredDocumentClient.update).toHaveBeenCalledWith({
                TableName: 'books',
                Key: {
                    bookId: 'abc123'
                },
                UpdateExpression: "set isAvailable=:a, neckOfTheWoods=:l",
                ExpressionAttributeValues: {
                    ':a': false,
                    ':l': 'Ben'
                },
                ReturnValues: 'UPDATED_NEW'
            });
        });

        it('should show the check out success message', () => wait(() => {
            expect(rendered.queryByText('You have checked out A Great Project')).toBeInTheDocument();
        }));
    });

    describe('The book is loaded successfully and is checked out', () => {
        let rendered;

        beforeEach(async () => {
            book.isAvailable = false;
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
        });

        it('should show the book is not available', () => {
            expect(rendered.container).not.toHaveTextContent('Available');
        });

        it('should show the book is Unvailable', () => {
            expect(rendered.container).toHaveTextContent('Unvailable');
        });

        it('should have a return button', () => {
            expect(rendered.queryByText('Return')).toBeInTheDocument();
        });
    });

    describe('The user clicks the return button', () => {
        let rendered;

        beforeEach(async () => {
            book.isAvailable = false;
            book.neckOfTheWoods = 'Ben';
            process.env.REACT_APP_BOOK_TABLE = 'books';
            rendered = render(<Books {...props} />);
            await wait(() => expect(rendered.container).not.toHaveTextContent('Loading...'));
            fireEvent.click(rendered.getByText('Return'));
        });

        it('should submit an update to dynamo', () => {
            expect(configuredDocumentClient.update).toHaveBeenCalledWith({
                TableName: 'books',
                Key: {
                    bookId: 'abc123'
                },
                UpdateExpression: "set isAvailable=:a, neckOfTheWoods=:l",
                ExpressionAttributeValues: {
                    ':a': true,
                    ':l': 'Library'
                },
                ReturnValues: 'UPDATED_NEW'
            });
        });

        it.only('should show the return success message', () => wait(() => {
            rendered.debug();
            expect(rendered.queryByText('A Great Project has been returned')).toBeInTheDocument();
        }));
    });
});