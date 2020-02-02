import { renderHook } from '@testing-library/react-hooks'
import {getBookData} from './book-api';
import {useBookData} from './useBookData';

jest.mock('./book-api');

describe('useBookData', () => {
    it('should not attempt to fetch the book data if an isbn is not provided', () => {
        const {result} = renderHook(() => useBookData());

        expect(getBookData).not.toHaveBeenCalled();
        expect(result.current).toEqual({});
    });

    it('should fetch the book from the book api if an isbn is provided', async () => {
        getBookData.mockResolvedValue({
            title: 'Java'
        })

        const {result, waitForNextUpdate} = renderHook(() => useBookData('0201634554'));

        await waitForNextUpdate();

        expect(getBookData).toHaveBeenCalledWith('0201634554');
        expect(result.current.title).toEqual('Java');
    });

    it('should not overwrite the empty object upon error', async () => {
        getBookData.mockRejectedValue({
            error: 'Not found'
        });

        const {result} = renderHook(() => useBookData('0201634554'));

        expect(getBookData).toHaveBeenCalledWith('0201634554');
        expect(result.current).toEqual({});
    });
});
