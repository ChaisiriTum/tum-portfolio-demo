// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerServiceWorker } from './register-sw';
import './styles.css';

ReactDOM.render(<App />, document.getElementById('root'));

// register SW (non-blocking)
registerServiceWorker();
