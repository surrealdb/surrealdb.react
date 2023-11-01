import React from 'react';
import ReactDOM from 'react-dom/client';
import { SurrealClient, SurrealProvider } from '../../src';
import App from './App.tsx';

const client = new SurrealClient();
client.connect('ws://localhost:8000/rpc', {
    namespace: 'test',
    database: 'test',
    auth: {
        username: 'root',
        password: 'root',
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SurrealProvider client={client}>
            <App />
        </SurrealProvider>
    </React.StrictMode>
);
