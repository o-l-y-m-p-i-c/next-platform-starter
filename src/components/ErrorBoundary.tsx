import React, { Component, ReactNode } from 'react';
import Box from '@mui/material/Box';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          flex={1}
          py={2}
        >
          Something went wrong.
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
