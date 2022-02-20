import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// Import your own reducer
import userReducer from '../redux/userSlice';
import authReducer from '../redux/authSlice';

function render(
    ui,
    {
        preloadedState,
        store = configureStore({
            reducer: {
                user: userReducer,
                auth: authReducer,
            },
            preloadedState: {
                auth: {
                  username: 'ncthanh'
                },
                user: {},
            },
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
