import React, { useState, useEffect, useRef } from 'react';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useAuth } from './AuthContext';
import './styles/EventsOverview.css';
import EventsPaginated from './EventsPaginated';

function UserEvents() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useRef(null);
    const { token } = useAuth();
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [loggedIn, setLoggedIn] = useState(true);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsOrganizer(parsedUser.role === 'ORGANIZER');
                fetchUserEvents(parsedUser);
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
                setLoading(false);
            }
        } else {
            setLoggedIn(false);
            setLoading(false);
        }
    }, []);

    const fetchUserEvents = async (user) => {
        setEvents([]);
        setSelectedEvent(null);

        try {
            const response = await fetch(`http://localhost:8000/events/userEvents`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const userEvents = await response.json();
            setEvents(userEvents);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching user events:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load your events',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-column gap-2 p-3">
                <div className="id">ID: {item.id}</div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm">Description: {item.description}</div>
                <div className="text-sm">Location: {item.location}</div>
                <div className="text-sm">Start Date: {item.startDate}</div>
                <div className="text-sm">End Date: {item.endDate}</div>
                <div className="text-sm">Price: ${item.price}</div>
                <div className="text-sm">Capacity: {item.capacity}</div>
                <div className="text-sm">Organizer: {item.organizerName}</div>
            </div>
        );
    };

    const groupTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2 p-3 bg-primary text-white">
                <i className="pi pi-calendar mr-2" />
                <div>{option.label}</div>
            </div>
        );
    };

    return (
        <section className="eventsOverview userEventsPage eventsPage">
            <Toast ref={toast} />

            <header className="eventsPageHeader">
                <h1>Events</h1>
                <p>Your registered events, plus the full browsable catalog.</p>
            </header>

            <EventsPaginated />

            <div className="eventsSection">
                <h2 className="eventsSectionTitle">My Events</h2>
                {!loggedIn ? (
                    <Message severity="info" text="Log in to see the events you've registered for." className="w-full" />
                ) : loading ? (
                    <Message severity="info" text="Loading your events..." className="w-full" />
                ) : error ? (
                    <Message severity="error" text={`Connection error: ${error}`} className="w-full" />
                ) : events.length === 0 ? (
                    <Message severity="info" text="You haven't registered for any events yet." className="w-full" />
                ) : (
                    <div className="card flex justify-content-center">
                        <ListBox
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.value)}
                            options={events}
                            optionLabel="label"
                            optionGroupLabel="label"
                            optionGroupChildren="items"
                            optionGroupTemplate={groupTemplate}
                            itemTemplate={itemTemplate}
                            className="w-full md:w-30rem"
                            listStyle={{ maxHeight: 'calc(100vh - var(--nav-height) - 6rem)' }}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default UserEvents;