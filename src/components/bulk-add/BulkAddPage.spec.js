import React from 'react';
import { render, wait, fireEvent, waitForDomChange } from '@testing-library/react';
import documentClient from '../../configuredDocumentClient';
import BulkAddPage from './BulkAddPage';

jest.mock('../../configuredDocumentClient');

describe('Bulk Add Page', () => {
    let rendered;

    function getScannerInput() {
        return rendered.getByLabelText('Scanner Input');
    }

    beforeEach(() => {
        process.env.REACT_APP_BOOK_TABLE = 'example-book-table';
        documentClient.put.mockReturnValue({
            promise: () => wait()
        });

        rendered = render(<BulkAddPage/>);
    });

    describe('Initial Render', () => {

    });

    describe('User scans an ISBN', () => {
        beforeEach(async () => {
            fetch.mockResponse(JSON.stringify({
                'ISBN:0201634554': {
                    title: 'Java'
                }
            }))

            fireEvent.change(getScannerInput(), {target: {value: '0201634554'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter'});
            await wait();
        });

        it('should populate the ISBN field', () => {
            expect(rendered.getByLabelText('ISBN')).toHaveValue('0201634554');
        });

        it('should clear the scanner input', () => {
            expect(getScannerInput()).toHaveValue('');
        });

        it('should attempt to fetch the book title', () => {
            expect(fetch).toHaveBeenCalledWith('/api/books?bibkeys=ISBN%3A0201634554&jscmd=data&format=json', expect.anything());
        });

        it('should not attempt to save', () => {
            expect(documentClient.put).not.toHaveBeenCalled();
        });
    });

    describe('User enters a partial ISBN', () => {
        beforeEach(async () => {
            fireEvent.change(getScannerInput(), {target: {value: '020163'}});
            await wait();
        });

        it('should not populate the ISBN field', () => {
            expect(rendered.getByLabelText('ISBN')).toHaveValue('');
        });

        it('should populate the scanner input', () => {
            expect(getScannerInput()).toHaveValue('020163');
        });

        it('should not attempt to fetch the book title', () => {
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should not attempt to save', () => {
            expect(documentClient.put).not.toHaveBeenCalled();
        });
    });

    describe('User scans a book URL', () => {
        beforeEach(async () => {
            fireEvent.change(getScannerInput(), {target: {value: 'http://localhost/books/abc123'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter'});
            await wait();
        });

        it('should populate the Id field', () => {
            expect(rendered.getByLabelText('Id')).toHaveValue('abc123');
        });

        it('should clear the scanner input', () => {
            expect(getScannerInput()).toHaveValue('');
        });

        it('should not attempt to fetch the book title', () => {
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should not attempt to save', () => {
            expect(documentClient.put).not.toHaveBeenCalled();
        });
    });

    describe('User scans all pieces successfully', () => {
        beforeEach(async () => {
            fetch.mockResponse(JSON.stringify({
                'ISBN:0201634554': {
                    title: 'Java'
                }
            }));

            fireEvent.change(rendered.getByLabelText('Shelf'), {target: {value: 'Alpha'}});
            await wait();
            fireEvent.change(getScannerInput(), {target: {value: '0201634554'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter'});
            await wait();
            fireEvent.change(getScannerInput(), {target: {value: 'http://localhost/books/abc123'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter'});
            await wait();
            fireEvent.click(rendered.getByText('Save'));
            await wait();
        });

        it('should submit the payload to dynamo', () => {
            expect(documentClient.put).toHaveBeenCalledWith(expect.objectContaining({
                Item: {
                    id: 'abc123',
                    isbn: '0201634554',
                    title: 'Java',
                    shelf: 'Alpha'
                }
            }));
        });

        it('should clear out the title field', () => {
            expect(rendered.getByLabelText('Title')).toHaveValue('');
        });

        it('should clear out the isbn field', () => {
            expect(rendered.getByLabelText('ISBN')).toHaveValue('');
        });

        it('should clear out the Id field', () => {
            expect(rendered.getByLabelText('Id')).toHaveValue('');
        });

        it('should not clear out the shelf field', () => {
            expect(rendered.getByLabelText('Shelf')).toHaveValue('Alpha');
        });

        it('should display the id in the recently added list', () => {
            expect(rendered.getByRole('table')).toHaveTextContent('abc123');
        });

        it('should display the isbn in the recently added list', () => {
            expect(rendered.getByRole('table')).toHaveTextContent('0201634554');
        });

        it('should display the title in the recently added list', () => {
            expect(rendered.getByRole('table')).toHaveTextContent('Java');
        });

        it('should display the shelf in the recently added list', () => {
            expect(rendered.getByRole('table')).toHaveTextContent('Alpha');
        });
    });
});