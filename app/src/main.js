import React from 'react';
import {createRoot} from 'react-dom/client';
import AppEditor from './components/AppEditor';

const root = createRoot(document.getElementById('root'));
root.render(
    <AppEditor/>
);