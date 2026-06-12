import { Link } from 'react-router-dom';
import './styles/ErrorPage.css';

function NotFound() {
    return (
        <section className="errorPage">
            <p className="errorCode">404</p>
            <h2>Page not found</h2>
            <p>The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
            <div className="errorActions">
                <Link to="/" className="errorBtn">Back to Home</Link>
            </div>
        </section>
    );
}

export default NotFound;
