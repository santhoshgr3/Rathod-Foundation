import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="font-display font-extrabold text-2xl mb-2" style={{ color: "var(--color-ink)" }}>
              Something went wrong
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
              Please refresh the page. If the problem persists, contact the admin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full px-6 py-3 font-semibold text-sm text-white"
              style={{ background: "var(--color-saffron)" }}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
