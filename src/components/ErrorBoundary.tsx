import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    // Check if error is from a browser extension (obfuscated variables)
    const isExtensionError = 
      error.message.includes('_0x') ||
      error.stack?.includes('webkit-masked-url') ||
      error.stack?.includes('chrome-extension') ||
      error.stack?.includes('moz-extension');
    
    // Only suppress extension errors, re-throw real app errors
    if (isExtensionError) {
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const isExtensionError = 
      error.message.includes('_0x') ||
      error.stack?.includes('webkit-masked-url') ||
      error.stack?.includes('chrome-extension') ||
      error.stack?.includes('moz-extension');

    if (!isExtensionError) {
      console.error('App Error:', error, info);
    }
    // Extension errors are silently ignored
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
