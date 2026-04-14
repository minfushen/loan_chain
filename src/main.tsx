import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RootErrorBoundary } from './RootErrorBoundary';

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML =
    '<p style="margin:1.5rem;font-family:system-ui">未找到 #root 节点，请检查 index.html。</p>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <RootErrorBoundary>
        <TooltipProvider delay={300}>
          <App />
        </TooltipProvider>
      </RootErrorBoundary>
    </StrictMode>,
  );
}
