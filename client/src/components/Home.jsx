import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/Home.css';

const FEATURES = [
    { icon: 'pi-compass', title: 'Discover events', text: 'Browse concerts, conferences, workshops and more across every category and city.' },
    { icon: 'pi-ticket', title: 'Instant e-tickets', text: 'Register in a few clicks and get electronic tickets delivered straight to your inbox.' },
    { icon: 'pi-calendar', title: 'Stay up to date', text: 'A live calendar keeps you on top of everything happening near you.' },
    { icon: 'pi-bolt', title: 'Quick & simple', text: 'A clean, intuitive interface makes finding and booking events effortless.' },
    { icon: 'pi-cog', title: 'Built for organizers', text: 'Create, edit and manage your events and track participants from one dashboard.' },
    { icon: 'pi-shield', title: 'Secure & reliable', text: 'Role-based access and BCrypt-encrypted accounts keep your data safe.' },
];

const TESTIMONIALS = [
    { quote: "This app completely changed the way I organize events - simple and fast!", name: "Maria", role: "Organizer" },
    { quote: "I always find the most interesting events in my area.", name: "Matei", role: "Participant" },
    { quote: "Thanks to the app I found perfect events for my hobbies. It's very easy to use!", name: "Anca", role: "Participant" },
    { quote: "I discovered cultural and sports events I didn't know about - it changed my weekends!", name: "Vlad", role: "Participant" },
    { quote: "The best tool for organizers. It helps me promote events and attract new participants.", name: "Alex", role: "Organizer" },
    { quote: "Every week I find something new and exciting to do. It's just great!", name: "Robert", role: "Participant" },
];

const Home = () => {
    const [eventsPerDay, setEventsPerDay] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        fetchEventsPerDay();
    }, []);

    const fetchEventsPerDay = async () => {
        try {
            const response = await fetch('http://localhost:8000/events/perDay');
            const data = await response.json();
            setEventsPerDay(data.eventsPerDay);
        } catch (error) {
            console.error('Failed to fetch events per day');
        }
    };

    const renderDateCell = (dateParam) => {
        if (!dateParam || dateParam.day === undefined) {
            return <span className="calDay">-</span>;
        }

        const date = new Date(dateParam.year, dateParam.month, dateParam.day);
        if (isNaN(date.getTime())) {
            return <span className="calDay">{dateParam.day}</span>;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        const count = eventsPerDay[dateKey] || 0;
        const hasEvents = count > 0;

        return (
            <div className={`calCell${hasEvents ? ' calCellHas' : ''}`}>
                <span className="calDay">{date.getDate()}</span>
                {hasEvents && (
                    <span className="calBadge">{count} {count === 1 ? 'event' : 'events'}</span>
                )}
            </div>
        );
    };

    return (
        <section className="home">
            <header className="hero">
                <div className="hero-overlay" />
                <div className="hero-inner">
                    <span className="hero-eyebrow">Events Portal</span>
                    <h1>Find, book and host events you&apos;ll love</h1>
                    
                    <div className="hero-actions">
                        <Link to="/eventsOverview" className="btn btn-primary">
                            <i className="pi pi-search" /> Browse events
                        </Link>
                        {user ? (
                            <Link to="/userEvents" className="btn btn-ghost">My events</Link>
                        ) : (
                            <Link to="/login" className="btn btn-ghost">Sign in</Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="section">
                <div className="section-head">
                    <span className="section-eyebrow">Why Events Portal</span>
                    <h2>Everything you need, in one place</h2>
                </div>
                <div className="feature-grid">
                    {FEATURES.map((f) => (
                        <article className="feature-card" key={f.title}>
                            <span className="feature-icon"><i className={`pi ${f.icon}`} /></span>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </article>
                    ))}
                </div>
            </div>

            <div className="section calendarSection">
                <div className="section-head">
                    <span className="section-eyebrow">Plan ahead</span>
                    <h2>Events calendar</h2>
                </div>
                <Calendar
                    inline
                    dateTemplate={renderDateCell}
                    className="w-full"
                />
                <div className="calendarLegend">
                    <span className="calLegendDot" aria-hidden="true"></span>
                    <span>Highlighted days have one or more events</span>
                </div>
            </div>

            {/* Testimonials --------------------------------------------- */}
            <div className="section">
                <div className="section-head">
                    <span className="section-eyebrow">Loved by our community</span>
                    <h2>What people are saying</h2>
                </div>
                <div className="testimonial-grid">
                    {TESTIMONIALS.map((t) => (
                        <figure className="testimonial-card" key={t.name}>
                            <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                            <figcaption>
                                <span className="avatar">{t.name.charAt(0)}</span>
                                <span className="who">
                                    <span className="who-name">{t.name}</span>
                                    <span className="who-role">{t.role}</span>
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home;
