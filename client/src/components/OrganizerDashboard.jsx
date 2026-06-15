import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import FormCard from './FormCard.jsx';
import './styles/OrganizerDashboard.css';
import { useAuth } from './AuthContext.jsx';
import { Message } from 'primereact/message';

const BASE_URL = 'http://localhost:8000';

const defaultEventDateTime = `${new Date().getFullYear()}-01-01T12:00`;

const emptyEvent = {
    name: '',
    description: '',
    location: '',
    startDate: defaultEventDateTime,
    endDate: defaultEventDateTime,
    price: '',
    capacity: '',
    organizerName: '',
};

function OrganizerDashboard() {
    const [addForm, setAddForm] = useState({ ...emptyEvent });
    const [editForm, setEditForm] = useState({ id: '', ...emptyEvent });
    const [deleteForm, setDeleteForm] = useState({ id: '' });

    const [eventOptions, setEventOptions] = useState([]);
    const [selectedEditEvent, setSelectedEditEvent] = useState(null);
    const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null);

    const [addError, setAddError] = useState('');
    const [editError, setEditError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [loading, setLoading] = useState(false);

    const [eventsWithParticipants, setEventsWithParticipants] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [user, setUser] = useState(null);
    const [isOrganizer, setIsOrganizer] = useState(false);

    const { token } = useAuth();

    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    };

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

    const fetchEventsWithParticipants = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${BASE_URL}/events/participants?user_id=${user.id}`, {
                headers: authHeaders,
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch events with participants');
            }
            setEventsWithParticipants(await response.json());
        } catch (error) {
            console.error('Error fetching events with participants:', error);
        }
    };

    const fetchEventOptions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/events/list`, {
                headers: authHeaders,
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch event list');
            }
            setEventOptions(await response.json());
        } catch (error) {
            console.error('Error fetching event list:', error);
        }
    };

    useEffect(() => {
        fetchEventsWithParticipants();
        fetchEventOptions();
    }, [user, token]);

    const refreshLists = () => {
        fetchEventsWithParticipants();
        fetchEventOptions();
    };

    if (!user || !isOrganizer) {
        return <h1>You are not logged in as an organizer</h1>;
    }

    const onSelectEditEvent = (evt) => {
        setSelectedEditEvent(evt);
        setEditError('');
        if (evt) {
            setEditForm({
                id: String(evt.id),
                name: evt.name ?? '',
                description: evt.description ?? '',
                location: evt.location ?? '',
                startDate: evt.startDate || defaultEventDateTime,
                endDate: evt.endDate || defaultEventDateTime,
                price: evt.price != null ? String(evt.price) : '',
                capacity: evt.capacity != null ? String(evt.capacity) : '',
                organizerName: evt.organizerName ?? '',
            });
        }
    };

    const onSelectDeleteEvent = (evt) => {
        setSelectedDeleteEvent(evt);
        setDeleteError('');
        setDeleteForm({ id: evt ? String(evt.id) : '' });
    };

    const addEventSubmit = async (formData) => {
        try {
            setLoading(true);
            setAddError('');
            const response = await fetch(`${BASE_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setAddError(data.message || 'Failed to create event');
            } else {
                setAddError('Event created successfully!');
                setAddForm({ ...emptyEvent });
                refreshLists();
            }
        } catch (error) {
            setAddError('Error creating event: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const editEventSubmit = async (formData) => {
        try {
            setLoading(true);
            setEditError('');
            const response = await fetch(`${BASE_URL}/events`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setEditError(data.message || 'Failed to update event');
            } else {
                setEditError('Event updated successfully!');
                setSelectedEditEvent((prev) => (prev ? { ...prev, name: formData.name } : prev));
                refreshLists();
            }
        } catch (error) {
            setEditError('Error updating event: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteEventSubmit = async (formData) => {
        try {
            setLoading(true);
            setDeleteError('');
            const response = await fetch(`${BASE_URL}/events`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setDeleteError(data.message || 'Failed to delete event');
            } else {
                setDeleteError('Event deleted successfully!');
                setDeleteForm({ id: '' });
                setSelectedDeleteEvent(null);
                refreshLists();
            }
        } catch (error) {
            setDeleteError('Error deleting event: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const eventTemplate = (event) => {
        const participants = event.participants ?? [];
        return (
            <div className="event-item">
                <h3 className="event-title">{event.name}</h3>
                <div className="event-start">Start: {event.startDate}</div>
                <div className="participants">
                    <h4 className="participants-heading">Participants ({participants.length})</h4>
                    {participants.length > 0 ? (
                        <ul className="participants-list">
                            {participants.map((participant, index) => (
                                <li key={participant.id ?? index} className="participant-row">
                                    <span className="participant-name">
                                        {participant.name}
                                        {participant.count > 1 && ` (${participant.count})`}
                                    </span>
                                    <span className="participant-email">{participant.email}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="participants-empty">No participants yet</p>
                    )}
                </div>
            </div>
        );
    };

    const textField = (form, setForm, prefix, field, label, type = 'text') => (
        <span className="p-float-label" key={`${prefix}-${field}`}>
            <InputText
                type={type}
                id={`${prefix}-${field}`}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
            <label htmlFor={`${prefix}-${field}`}>{label}</label>
        </span>
    );

    const eventDetailFields = (form, setForm, prefix, includeName) => (
        <>
            {includeName && textField(form, setForm, prefix, 'name', 'Event Name')}
            {textField(form, setForm, prefix, 'description', 'Description')}
            {textField(form, setForm, prefix, 'location', 'Location')}
            {textField(form, setForm, prefix, 'startDate', 'Start Date', 'datetime-local')}
            {textField(form, setForm, prefix, 'endDate', 'End Date', 'datetime-local')}
            {textField(form, setForm, prefix, 'price', 'Price', 'number')}
            {textField(form, setForm, prefix, 'capacity', 'Capacity', 'number')}
            {textField(form, setForm, prefix, 'organizerName', 'Organizer Name')}
        </>
    );

    return (
        <section className="organizerDashboard">
            <header className="dashboardHeader">
                <h1>Organizer Dashboard</h1>
                <p>Create, edit and manage your events and their participants.</p>
            </header>
            <div className="dashboardGrid">
                <div className="eventsColumn">
                    <FormCard
                        className="eventsCard"
                        title="Events and Participants"
                        fields={
                            eventsWithParticipants.length > 0 ? (
                                <ListBox
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.value)}
                                    options={eventsWithParticipants}
                                    itemTemplate={eventTemplate}
                                    className="w-full border-none"
                                    optionLabel="name"
                                />
                            ) : (
                                <Message severity="info" text="No events found or unable to connect." className="w-full mb-3" />
                            )
                        }
                        fieldsState={{}}
                        onSubmit={() => refreshLists()}
                        showButton={false}
                    />
                </div>

                <aside className="actionsColumn">
                    <FormCard
                        className="grid addCard"
                        onSubmit={addEventSubmit}
                        title="Add Event"
                        fields={eventDetailFields(addForm, setAddForm, 'add', true)}
                        fieldsState={addForm}
                        error={addError}
                        loading={loading}
                        buttonText="Add"
                    />

                    <FormCard
                        className="grid editCard"
                        onSubmit={editEventSubmit}
                        title="Edit Event"
                        fields={
                            <>
                                <Dropdown
                                    value={selectedEditEvent}
                                    onChange={(e) => onSelectEditEvent(e.value)}
                                    options={eventOptions}
                                    optionLabel="name"
                                    dataKey="id"
                                    placeholder="Select an event to edit"
                                    className="w-full mb-2"
                                    filter
                                    itemTemplate={(option) => `${option.id} - ${option.name}`}
                                    valueTemplate={(option) => (option ? `${option.id} - ${option.name}` : 'Select an event to edit')}
                                />
                                {eventDetailFields(editForm, setEditForm, 'edit', true)}
                            </>
                        }
                        fieldsState={editForm}
                        error={editError}
                        loading={loading}
                        buttonText="Edit"
                    />

                    <FormCard
                        className="grid deleteCard"
                        onSubmit={deleteEventSubmit}
                        title="Delete Event"
                        fields={
                            <Dropdown
                                value={selectedDeleteEvent}
                                onChange={(e) => onSelectDeleteEvent(e.value)}
                                options={eventOptions}
                                optionLabel="name"
                                dataKey="id"
                                placeholder="Select an event to delete"
                                className="w-full mb-2"
                                filter
                                itemTemplate={(option) => `${option.id} - ${option.name}`}
                                valueTemplate={(option) => (option ? `${option.id} - ${option.name}` : 'Select an event to delete')}
                            />
                        }
                        fieldsState={deleteForm}
                        error={deleteError}
                        loading={loading}
                        buttonText="Delete"
                    />
                </aside>
            </div>
        </section>
    );
}

export default OrganizerDashboard;
