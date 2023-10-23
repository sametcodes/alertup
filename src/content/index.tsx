import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import RootContext from '@/utils/context';
import { Toaster } from '@/components/ui/toaster';
import '../components/globals.main.css';

const root = document.createElement('div');
root.id = "root_extension"
document.body.prepend(root);

createRoot(root).render(
    <RootContext value={root}>
        <App />
        <Toaster />
    </RootContext>
);