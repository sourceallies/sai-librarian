import React from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react';
import documentClient from '../../configuredDocumentClient';
import BulkAddPage from './BulkAddPage';
import ScannerInput from './ScannerInput';

jest.mock('../../configuredDocumentClient');
jest.mock('./ScannerInput', () => jest.fn());

describe('Bulk Add Page', () => {
    let rendered;

    function getScannerInputProps() {
        const calls = ScannerInput.mock.calls;
        return calls[calls.length - 1][0];
    }

    beforeEach(() => {
        process.env.REACT_APP_BOOK_TABLE = 'example-book-table';
        documentClient.put.mockReturnValue({
            promise: () => wait()
        });
        ScannerInput.mockReturnValue(<div />);

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
            }));

            await act(() =>  getScannerInputProps().onIsbnScanned('0201634554'));
            await wait();
        });

        it('should populate the ISBN field', () => {
            expect(rendered.getByLabelText('ISBN')).toHaveValue('0201634554');
        });

        it('should attempt to fetch the book title', () => {
            expect(fetch).toHaveBeenCalledWith('/api/books?bibkeys=ISBN%3A0201634554&jscmd=data&format=json', expect.anything());
        });

        it('should populate the book title', () => wait(() => {
            expect(rendered.getByLabelText('Title')).toHaveValue('Java');
        }));

        it('should not attempt to save', () => {
            expect(documentClient.put).not.toHaveBeenCalled();
        });
    });

    describe('User scans a book URL', () => {
        beforeEach(async () => {
            act(() => getScannerInputProps().onIdScanned('abc123'));
            await wait();
        });

        it('should populate the Id field', () => {
            expect(rendered.getByLabelText('Id')).toHaveValue('abc123');
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
            await act(() => getScannerInputProps().onIsbnScanned('0201634554'));
            act(() => getScannerInputProps().onIdScanned('abc123'));
            await wait(() => expect(rendered.getByLabelText('Title')).not.toHaveValue(''));
            fireEvent.click(rendered.getByText('Save'));
            await wait();
        });

        it('should submit the payload to dynamo', () => {
            expect(documentClient.put).toHaveBeenCalledWith(expect.objectContaining({
                Item: {
                    bookId: 'abc123',
                    isbn: '0201634554',
                    title: 'Java',
                    shelf: 'Alpha',
                    neckOfTheWoods: 'Library',
                    isAvailable: true
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