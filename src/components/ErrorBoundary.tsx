import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('aura_active_user_v1');
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#2B231F] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF2ED] text-[#8E3B22] flex items-center justify-center mx-auto border border-[#F2DFD5]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-serif-editorial text-2xl text-[#2B231F] font-bold">
              Something went wrong
            </h2>
            <p className="text-xs text-[#7A6E64] leading-relaxed">
              A temporary render issue occurred. Click the button below to safely recover your session and reload AURA.
            </p>
            {this.state.error && (
              <pre className="text-[10px] bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3D9] text-[#8E3B22] overflow-x-auto text-left max-h-24">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#772F1B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload & Recover</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
