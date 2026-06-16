import React from 'react';
import './styles/ErrorPage.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught UI error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section className="errorPage">
                    <p className="errorCode">500</p>
                    <h2>Something went wrong</h2>
                    <p>An unexpected error occurred while rendering this page. Please try again.</p>
                    <div className="errorActions">
                        <button className="errorBtn" onClick={() => window.location.reload()}>
                            Reload page
                        </button>
                        <button className="errorBtn secondary" onClick={() => window.location.assign('/')}>
                            Back to Home
                        </button>
                    </div>
                </section>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
