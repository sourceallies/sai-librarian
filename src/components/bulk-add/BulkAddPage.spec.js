import React from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react';
import documentClient from '../../configuredDocumentClient';
import BulkAddPage from './BulkAddPage';
import ScannerInput from './ScannerInput';
import {getBookData} from '../../utils/book-api';

jest.mock('../../configuredDocumentClient');
jest.mock('./ScannerInput', () => jest.fn());
jest.mock('../../utils/book-api');

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

            getBookData.mockResolvedValue({
                title: 'Java'
            });

            await act(() =>  getScannerInputProps().onIsbnScanned('0201634554'));
            await wait();
        });

        it('should populate the ISBN field', () => {
            expect(rendered.getByLabelText('ISBN')).toHaveValue('0201634554');
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

        it('should not attempt to save', () => {
            expect(documentClient.put).not.toHaveBeenCalled();
        });
    });

    describe('User scans all pieces successfully', () => {
        beforeEach(async () => {
            getBookData.mockResolvedValue({
                title: 'Java'
            });

            fireEvent.change(rendered.getByLabelText('Shelf'), {target: {value: 'Alpha'}});
            await act(() => getScannerInputProps().onIsbnScanned('0201634554'));
            await act(() => getScannerInputProps().onIdScanned('abc123'));
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

    describe('User enters all pieces and clicks Save', () => {
        beforeEach(async () => {
            getBookData.mockResolvedValue({
                title: 'Java'
            });

            fireEvent.change(rendered.getByLabelText('Shelf'), {target: {value: 'Alpha'}});
            fireEvent.change(rendered.getByLabelText('ISBN'), {target: {value: '0201634554'}});
            fireEvent.change(rendered.getByLabelText('Id'), {target: {value: 'abc123'}});
            fireEvent.change(rendered.getByLabelText('Title'), {target: {value: 'Java'}});
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