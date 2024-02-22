import React from 'react';
import ReactDOM from 'react-dom/client';
import { SurrealClient, SurrealProvider } from '../../src';
import App from './App';
import './index.css';

const client = new SurrealClient();
client.connect('ws://localhost:8000/rpc', {
    namespace: 'test',
    database: 'test',
    auth: {
        username: 'root',
        password: 'root',
    },
});

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <React.StrictMode>
        <SurrealProvider client={client}>
            <App />
        </SurrealProvider>
    </React.StrictMode>
);