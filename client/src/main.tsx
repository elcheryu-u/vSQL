import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.tsx'
import { ConnectionProvider } from './context/ConnectionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider>
      <RouterProvider router={router} />
    </ConnectionProvider>
  </StrictMode>,
)
