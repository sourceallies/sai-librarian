import {getBookData} from './book-api';

describe('getBookData', () => {
    beforeEach(() => {
        fetchMock.mockResponse(JSON.stringify({
            'ISBN:0201634554': {
                title: 'Java'
            }
        }));
    })

    it('should fetch with the appropriate url search params', async () => {
        await getBookData('0201634554');

        expect(fetchMock).toHaveBeenCalledWith('/api/books?bibkeys=ISBN%3A0201634554&jscmd=data&format=json', expect.anything());
    });

    describe('when the book is found', () => {
        it('should return the body element corresponding to the isbn requested', async () => {
            const response = await getBookData('0201634554');

            expect(response.title).toBe('Java');
        });
    });

    describe('when the book is not found', () => {
        it('should return an empty object', async () => {
            fetchMock.mockResponse('', {status: 404})
            const response = await getBookData('0201634554');

            expect(response).toEqual({});
        });
    });

    describe('when the book api returns an unexpected error', () => {
        it('should throw an error with that status code', async () => {
            fetchMock.mockResponse('', {status: 401});

            await expect(getBookData('0201634554')).rejects.toThrow('Error: 401');
        });
    });
});