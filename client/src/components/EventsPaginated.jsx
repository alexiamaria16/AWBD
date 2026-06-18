import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './styles/EventsPaginated.css';

const BASE_URL = 'http://localhost:8000';

function EventsPaginated() {
    const [events, setEvents] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: 'startDate',
        sortOrder: 1,
    });

    useEffect(() => {
        loadEvents();
    }, [lazyState]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const dir = lazyState.sortOrder === 1 ? 'asc' : 'desc';
            const sortField = lazyState.sortField || 'startDate';
            const url = `${BASE_URL}/api/events?page=${lazyState.page}&size=${lazyState.rows}&sort=${sortField},${dir}`;
            const res = await fetch(url, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Failed to load events');
            const data = await res.json();
            setEvents(data.content ?? []);
            setTotalRecords(data.totalElements ?? 0);
        } catch (e) {
            console.error('Error loading paginated events:', e);
            setEvents([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event) => {
        setLazyState((prev) => ({ ...prev, first: event.first, rows: event.rows, page: event.page }));
    };

    const onSort = (event) => {
        setLazyState((prev) => ({
            ...prev,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
            first: 0,
            page: 0,
        }));
    };

    const dateBody = (row, field) => {
        const value = row[field];
        if (!value) return '-';
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleString();
    };

    const priceBody = (row) => `$${Number(row.price ?? 0).toFixed(2)}`;

    return (
        <section className="eventsPaginated eventsSection">
            <h2 className="eventsSectionTitle">Browse Events</h2>

            <DataTable
                value={events}
                lazy
                dataKey="id"
                paginator
                first={lazyState.first}
                rows={lazyState.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                loading={loading}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events"
                emptyMessage="No events found."
                className="w-full"
            >
                <Column field="title" header="Title" sortable />
                <Column field="startDate" header="Start" body={(r) => dateBody(r, 'startDate')} sortable />
                <Column field="endDate" header="End" body={(r) => dateBody(r, 'endDate')} />
                <Column field="price" header="Price" body={priceBody} sortable />
                <Column field="availableSlots" header="Slots" sortable />
                <Column field="location" header="Location" body={(r) => r.location || '-'} />
            </DataTable>
        </section>
    );
}

export default EventsPaginated;
