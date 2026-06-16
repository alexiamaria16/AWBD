import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/About.css';

const PARTICIPANT_ITEMS = [
    "Create a participant account and sign in securely",
    "Browse and discover events across every category",
    "Register for the events you want to attend",
    "Keep track of every event you're registered for",
    "Receive electronic tickets straight to your email",
];

const ORGANIZER_ITEMS = [
    "Register as an organizer using an invite code",
    "Create new events with all the details",
    "Edit or delete your events at any time",
    "See who has registered for each event",
    "Manage everything from a single dashboard",
];

const HIGHLIGHTS = [
    { icon: 'pi-ticket', title: 'Electronic tickets', text: 'Tickets are generated electronically the moment you register for an event.' },
    { icon: 'pi-envelope', title: 'Email delivery', text: 'Your tickets are sent directly to your inbox, ready to use.' },
    { icon: 'pi-shield', title: 'Secure accounts', text: 'Role-based access and BCrypt-encrypted passwords keep your data safe.' },
];

function About() {
    const { user } = useAuth();

    return (
        <section className="about">
            <header className="about-hero">
                <div className="about-hero-overlay" />
                <div className="about-hero-inner">
                    <span className="about-eyebrow">About</span>
                    <h1>About Events Portal</h1>
                    <p className="about-hero-sub">
                        A modern platform for organizing and attending events - discover what&apos;s on,
                        book tickets in seconds, and run your own events with ease.
                    </p>
                </div>
            </header>

            <div className="about-section">
                <div className="about-section-head">
                    <span className="about-section-eyebrow">What it is</span>
                    <h2>Built for participants and organizers alike</h2>
                    <p>
                        Events Portal brings discovery, ticketing and event management together in one
                        place, so attending or hosting an event is simple from start to finish.
                    </p>
                </div>

                <div className="about-cards">
                    <article className="about-card">
                        <span className="about-card-icon"><i className="pi pi-users" /></span>
                        <h3>For participants</h3>
                        <ul>
                            {PARTICIPANT_ITEMS.map((t) => (
                                <li key={t}><i className="pi pi-check" /><span>{t}</span></li>
                            ))}
                        </ul>
                    </article>

                    <article className="about-card">
                        <span className="about-card-icon"><i className="pi pi-calendar-plus" /></span>
                        <h3>For organizers</h3>
                        <ul>
                            {ORGANIZER_ITEMS.map((t) => (
                                <li key={t}><i className="pi pi-check" /><span>{t}</span></li>
                            ))}
                        </ul>
                    </article>
                </div>
            </div>

            <div className="about-section">
                <div className="about-section-head">
                    <span className="about-section-eyebrow">Highlights</span>
                    <h2>What makes it work</h2>
                </div>
                <div className="about-highlights">
                    {HIGHLIGHTS.map((h) => (
                        <article className="about-highlight" key={h.title}>
                            <span className="about-highlight-icon"><i className={`pi ${h.icon}`} /></span>
                            <div>
                                <h3>{h.title}</h3>
                                <p>{h.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* CTA ------------------------------------------------------- */}
            <div className="about-cta">
                <h2>Ready to dive in?</h2>
                <p>Explore upcoming events or sign in to get started.</p>
                <div className="about-cta-actions">
                    <Link to="/eventsOverview" className="btn btn-primary">
                        <i className="pi pi-search" /> Browse events
                    </Link>
                    {user ? (
                        <Link to="/userEvents" className="btn btn-outline">My events</Link>
                    ) : (
                        <Link to="/login" className="btn btn-outline">Sign in</Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default About;
