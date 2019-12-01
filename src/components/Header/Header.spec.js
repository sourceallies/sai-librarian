import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Header from './index';

describe('Header', () => {
    let history;

    beforeEach(() => {
        history = createMemoryHistory();
    });

    describe('Initial render', () => {
        let rendered;

        beforeEach(() => {
            rendered = render(<Router history={history}><Header /></Router>);
        });

        it('should have the library logo', () => {
            expect(rendered.getByAltText('Library Logo')).toBeVisible();
        });
    });

    describe('user clicks on the logo', () => {
        let rendered;

        beforeEach(() => {
            history.replace('/some-page');
            rendered = render(<Router history={history}><Header /></Router>);
            fireEvent.click(rendered.getByAltText('Library Logo'));
        });

        it('should navate to the root of the app', () => wait(() => {
            expect(history.location.pathname).toBe("/");
        }));
    });
});