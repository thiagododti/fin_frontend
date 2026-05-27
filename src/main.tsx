import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@/index.css';

import { router } from '@/routes/router';
import { AppProviders } from '@/providers/AppProviders';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppProviders>
        <RouterProvider router={router} />
    </AppProviders>,
);
