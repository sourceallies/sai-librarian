import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import ScannerInput from './ScannerInput';

describe('Scanner Input', () => {
    let rendered;
    let onIsbnScanned;
    let onIdScanned;

    function getScannerInput() {
        return rendered.getByRole('textbox');
    }

    beforeEach(() => {
        onIsbnScanned = jest.fn();
        onIdScanned = jest.fn();
        rendered = render(<ScannerInput onIsbnScanned={onIsbnScanned} onIdScanned={onIdScanned} />);
    });

    describe('User scans an ISBN', () => {
        beforeEach(async () => {
            fireEvent.change(getScannerInput(), {target: {value: '0201634554'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter', code: 13, charCode: 13});
            await wait();
        });

        it('should fire an ISBN event', () => {
            expect(onIsbnScanned).toHaveBeenCalledWith('0201634554');
        });

        it('should not fire an Id event', () => {
            expect(onIdScanned).not.toHaveBeenCalled();
        });

        it('should clear the scanner input', () => {
            expect(getScannerInput()).toHaveValue('');
        });
    });

    describe('User enters a partial ISBN', () => {
        beforeEach(async () => {
            fireEvent.change(getScannerInput(), {target: {value: '020163'}});
            await wait();
        });

        it('should not fire an ISBN event', () => {
            expect(onIsbnScanned).not.toHaveBeenCalled();
        });

        it('should populate the scanner input', () => {
            expect(getScannerInput()).toHaveValue('020163');
        });
    });

    describe('User scans a book URL', () => {
        beforeEach(async () => {
            fireEvent.change(getScannerInput(), {target: {value: 'http://localhost/books/abc123'}});
            fireEvent.keyPress(getScannerInput(), {key: 'Enter', code: 13, charCode: 13});
            await wait();
        });

        it('should fire an Id event', () => {
            expect(onIdScanned).toHaveBeenCalledWith('abc123');
        });

        it('should clear the scanner input', () => {
            expect(getScannerInput()).toHaveValue('');
        });

        it('should not fire an ISBN event', () => {
            expect(onIsbnScanned).not.toHaveBeenCalled();
        });
    });
});