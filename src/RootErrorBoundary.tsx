import React, { type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 捕获子树渲染错误，避免整页空白且控制台难以关联到 UI。
 */
export class RootErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RootErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '1.5rem',
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 560,
            color: '#0f172a',
          }}
        >
          <h1 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>页面渲染出错</h1>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 12,
              background: '#f1f5f9',
              padding: '1rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ marginTop: '1rem', fontSize: 13, color: '#64748b' }}>
            请打开开发者工具（Console）查看完整堆栈，或尝试硬刷新（清除缓存）。
          </p>
        </div>
      );
    }
    return (this as React.Component<Props, State>).props.children;
  }
}
