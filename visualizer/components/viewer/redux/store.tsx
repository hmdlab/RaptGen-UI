import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import inputDataReducer from './input';
import selexReducer from './selex';
import measuredDataReducer from './measured';
import gmmConfigReducer from './gmm'
import decodeDataReducer from './decoded'

export const store = configureStore({
    reducer: {
        selexData: selexReducer,
        measuredData: measuredDataReducer,
        inputData: inputDataReducer,
        gmmData: gmmConfigReducer,
        decodeData: decodeDataReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>