import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useAuth } from './AuthContext';
import './styles/EventsOverview.css';

function EventsOverview() {
    const [events, setEvents] = useState([]);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [user, setUser] = useState(null);
    const [isOrganizer, setIsOrganizer] = useState(false);

    const [maxPrice, setMaxPrice] = useState('');
    const [minCapacity, setMinCapacity] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'

    const toast = useRef(null);
    const { token } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsOrganizer(parsedUser.role === 'ORGANIZER');
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (user && token) {
            fetchUserEvents();
        }
    }, [user, token]);

    const fetchUserEvents = async () => {
        try {
            const response = await fetch('http://localhost:8000/events/userEvents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ user_id: user.id })
            });

            if (response.ok) {
                const data = await response.json();
                const ids = (Array.isArray(data) ? data : [])
                    .flatMap(group => group.items || [])
                    .map(evt => evt.id);
                setRegisteredEventIds(ids);
            }
        } catch (error) {
            console.error('Error fetching user events:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8000/events', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const registerForEvent = async (eventId) => {
        if (!user) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'You are not logged in!',
                life: 3000
            });
            return;
        }

        try {
            setRegistering(true);

            const response = await fetch('http://localhost:8000/events/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    event_id: eventId,
                    user_id: user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {

                if (data.errors) {

                    const errorMessages = Object.values(data.errors).join(' ');
                    console.log(errorMessages);

                } else {
                    console.log(data.message || 'Failed to register for event');
                    
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: data.message || 'Failed to register for event',
                        life: 3000
                    });
                }

            } else {

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Successfully registered for event!',
                    life: 3000
                });
                
                setRegisteredEventIds(prev => [...prev, eventId]);

            }

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to register for event',
                life: 3000
            });
            console.error('Error registering for event:', error);
        } finally {
            setRegistering(false);
        }
    };

    const filteredEvents = useMemo(() => {
        return events
            .map(group => {
                let items = [...group.items];

                if (maxPrice !== '')
                    items = items.filter(e => parseFloat(e.price) <= parseFloat(maxPrice));

                if (minCapacity !== '')
                    items = items.filter(e => parseInt(e.capacity) >= parseInt(minCapacity));

                if (startDateFilter !== '')
                    items = items.filter(e => {
                        const evtDate = new Date(e.startDate);
                        const filterDate = new Date(startDateFilter);
                        return evtDate >= filterDate;
                    });

                if (sortOrder === 'asc')
                    items = [...items].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                else if (sortOrder === 'desc')
                    items = [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                else
                    items = [...items].sort((a, b) => a.id - b.id);

                return { ...group, items };
            })
            .filter(group => group.items.length > 0);
    }, [events, maxPrice, minCapacity, startDateFilter, sortOrder]);

    const itemTemplate = (item) => {
        const isRegistered = registeredEventIds.includes(item.id);

        return (
            <div className="flex flex-column gap-2 p-3 w-full">
                <div className="id">ID: {item.id}</div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm">Description: {item.description}</div>
                <div className="text-sm">Location: {item.location}</div>
                <div className="text-sm">Start Date: {item.startDate}</div>
                <div className="text-sm">End Date: {item.endDate}</div>
                <div className="text-sm">Price: ${item.price}</div>
                <div className="text-sm">Capacity: {item.capacity}</div>
                <div className="text-sm">Organizer: {item.organizerName}</div>
                
                {isRegistered ? (
                    <div className="mt-2 flex">
                        <Message severity="success" text="You are registered for this event" className="w-full flex justify-content-start" />
                    </div>
                ) : (
                    <Button 
                        label="Register for Event" 
                        icon="pi pi-check"
                        loading={registering} 
                        onClick={(e) => {
                            e.preventDefault();
                            registerForEvent(item.id);
                        }}
                        className="p-button-success mt-2 w-full md:w-auto"
                    />
                )}

            </div>
        );
    };

    const groupTemplate = (option) => {
        return (
            <div className="groupHeader">
                <i className="pi pi-calendar" />
                <span>{option.label}</span>
            </div>
        );
    };

    if (loading) {
        return <div>Loading events...</div>;
    }

    if (error) {
        return (
            <section className="eventsOverview">
                <div className="card flex justify-content-center m-5">
                    <Message severity="error" text={`Connection error: ${error}`} />
                </div>
            </section>
        );
    }

    if (!events || events.length === 0) {
        return (
            <section className="eventsOverview">
                <div className="card flex justify-content-center m-5">
                    <Message severity="info" text="No events currently available." />
                </div>
            </section>
        );
    }

    return (
        <section className="eventsOverview">
            <Toast ref={toast} />

            <div className="filterBar">
                <div className="filterGroup">
                    <label>Max Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="filterGroup">
                    <label>Min Capacity</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="e.g. 50"
                        value={minCapacity}
                        onChange={e => setMinCapacity(e.target.value)}
                    />
                </div>
                <div className="filterGroup">
                    <label>Start Date From</label>
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={e => setStartDateFilter(e.target.value)}
                    />
                </div>
                <div className="filterGroup">
                    <label>Sort by Price</label>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="none">Default</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>
                <button
                    className="filterReset"
                    onClick={() => { setMaxPrice(''); setMinCapacity(''); setStartDateFilter(''); setSortOrder('none'); }}
                >
                    Reset
                </button>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex justify-content-center" style={{ marginTop: '2rem' }}>
                    <Message severity="info" text="No events match your filters." />
                </div>
            ) : (
                <div className="eventsScroll">
                    {filteredEvents.map((group, groupIdx) => (
                        <div key={groupIdx} className="eventsGroup">
                            {groupTemplate(group)}
                            <div className="eventsGrid">
                                {group.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="eventCard">
                                        {itemTemplate(item)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default EventsOverview;
