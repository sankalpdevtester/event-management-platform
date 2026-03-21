import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    attendees: number;
}

const events: Event[] = [];

app.get('/api/events', (req, res) => {
    res.json(events);
});

app.post('/api/events', (req, res) => {
    const event: Event = {
        id: events.length + 1,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        attendees: 0
    };
    events.push(event);
    res.json(event);
});

app.get('/api/events/:id', (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
});

app.post('/api/events/:id/rsvp', (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    event.attendees++;
    res.json({ message: 'RSVP successful', attendees: event.attendees });
});

app.listen(PORT, () => {
    console.log(`📅 Event Management API running on port ${PORT}`);
});
