import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../components/globals.main.css';

const root = document.createElement('div');
root.id = "root_extension";
document.body.prepend(root);

createRoot(root).render(<App root={root} />);