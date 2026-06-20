-- H2-compatible seed data (mirrors populate_db.sql but uses H2 date functions)

-- --------------------------------------------------------
-- Roles
-- --------------------------------------------------------
MERGE INTO roles (name) KEY(name) VALUES ('ORGANIZER');
MERGE INTO roles (name) KEY(name) VALUES ('USER');

-- --------------------------------------------------------
-- Categories (10 entries)
-- --------------------------------------------------------
MERGE INTO categories (name, description) KEY(name) VALUES ('Music',        'Live music concerts and festivals');
MERGE INTO categories (name, description) KEY(name) VALUES ('Technology',   'Tech conferences and networking events');
MERGE INTO categories (name, description) KEY(name) VALUES ('Sports',       'Athletic competitions and sporting events');
MERGE INTO categories (name, description) KEY(name) VALUES ('Art',          'Exhibitions, galleries, and creative workshops');
MERGE INTO categories (name, description) KEY(name) VALUES ('Food & Drink', 'Culinary festivals, wine tastings, and food tours');
MERGE INTO categories (name, description) KEY(name) VALUES ('Business',     'Corporate summits, workshops, and trade fairs');
MERGE INTO categories (name, description) KEY(name) VALUES ('Theater',      'Stage plays, musicals, and dramatic performances');
MERGE INTO categories (name, description) KEY(name) VALUES ('Education',    'Seminars, lectures, and academic symposiums');
MERGE INTO categories (name, description) KEY(name) VALUES ('Comedy',       'Stand-up shows and comedy club nights');
MERGE INTO categories (name, description) KEY(name) VALUES ('Outdoor',      'Hiking, camping meetups, and nature retreats');

-- --------------------------------------------------------
-- Events (10 entries)
-- --------------------------------------------------------
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Summer Rock Festival', 'An amazing outdoor music festival with local and international rock bands.', 'National Arena, Bucharest', DATEADD('DAY', 10, NOW()), DATEADD('DAY', 12, NOW()), 150.00, 500, 'Rock Productions SRL' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Summer Rock Festival');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Tech Innovators Summit', 'Annual tech conference with global speakers discussing AI and Cloud computing.', 'Romexpo Pavilion A, Bucharest', DATEADD('DAY', 30, NOW()), DATEADD('DAY', 31, NOW()), 500.00, 200, 'TechEvents Romania' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tech Innovators Summit');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Classical Symphony Night', 'An evening of beautiful classical pieces performed by the Philharmonic.', 'Romanian Athenaeum, Bucharest', DATEADD('DAY', 45, NOW()), DATEADD('DAY', 45, NOW()), 80.00, 100, 'George Enescu Philharmonic' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Classical Symphony Night');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Street Food Festival', 'Dozens of local and international food vendors in one vibrant outdoor space.', 'Herastrau Park, Bucharest', DATEADD('DAY', 7, NOW()), DATEADD('DAY', 9, NOW()), 20.00, 1000, 'Taste of Romania' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Street Food Festival');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'National Comedy Gala', 'Top Romanian stand-up comedians perform live in one unforgettable evening.', 'Sala Palatului, Bucharest', DATEADD('DAY', 20, NOW()), DATEADD('DAY', 20, NOW()), 60.00, 300, 'Laugh Agency SRL' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'National Comedy Gala');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Startup Weekend Cluj', '54-hour sprint where aspiring entrepreneurs build and pitch new startup ideas.', 'Babes-Bolyai University, Cluj-Napoca', DATEADD('DAY', 14, NOW()), DATEADD('DAY', 16, NOW()), 75.00, 150, 'Startup Hub Cluj' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Startup Weekend Cluj');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Contemporary Art Exhibition', 'Showcasing works from 30 emerging Romanian and European visual artists.', 'National Museum of Contemporary Art, Bucharest', DATEADD('DAY', 5, NOW()), DATEADD('DAY', 35, NOW()), 15.00, 200, 'Art Forward Foundation' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Contemporary Art Exhibition');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Marathon of Bucharest', 'Annual road race across iconic city landmarks. Open to all skill levels.', 'Constitution Square, Bucharest', DATEADD('DAY', 60, NOW()), DATEADD('DAY', 60, NOW()), 40.00, 2000, 'Bucharest Sports Federation' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Marathon of Bucharest');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Mountain Hiking Retreat', 'Three-day guided hiking experience through the Bucegi Natural Park.', 'Busteni, Prahova Valley', DATEADD('DAY', 25, NOW()), DATEADD('DAY', 27, NOW()), 120.00, 50, 'Wild Romania Tours' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Mountain Hiking Retreat');
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) SELECT 'Digital Marketing Masterclass', 'Full-day intensive workshop covering SEO, social media strategy, and paid ads.', 'Radisson Blu Hotel, Bucharest', DATEADD('DAY', 18, NOW()), DATEADD('DAY', 18, NOW()), 200.00, 80, 'Growth Academy' WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Digital Marketing Masterclass');

-- --------------------------------------------------------
-- Event categories
-- --------------------------------------------------------
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Summer Rock Festival'          AND c.name = 'Music'       AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Tech Innovators Summit'        AND c.name = 'Technology'  AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Classical Symphony Night'      AND c.name = 'Music'       AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Street Food Festival'          AND c.name = 'Food & Drink' AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'National Comedy Gala'          AND c.name = 'Comedy'      AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Startup Weekend Cluj'          AND c.name = 'Business'    AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Startup Weekend Cluj'          AND c.name = 'Technology'  AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Contemporary Art Exhibition'   AND c.name = 'Art'         AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Marathon of Bucharest'         AND c.name = 'Sports'      AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Mountain Hiking Retreat'       AND c.name = 'Outdoor'     AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Mountain Hiking Retreat'       AND c.name = 'Sports'      AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Digital Marketing Masterclass' AND c.name = 'Business'    AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);
INSERT INTO event_categories (event_id, category_id) SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Digital Marketing Masterclass' AND c.name = 'Education'   AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.event_id = e.id AND ec.category_id = c.id);

-- --------------------------------------------------------
-- Contact messages (10 entries)
-- --------------------------------------------------------
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Alice Pop',      'alice@mail.com',      'Is there parking available at the Rock Festival venue?',                        DATEADD('DAY', -10, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'alice@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Bob Ionescu',    'bob@mail.com',        'Can I get a refund if I cannot attend the Tech Summit?',                        DATEADD('DAY',  -9, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'bob@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Carol Marin',    'carol@mail.com',      'Are there vegetarian options at the Street Food Festival?',                     DATEADD('DAY',  -8, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'carol@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Dan Popa',       'dan@mail.com',        'Is the Comedy Gala suitable for children under 12?',                            DATEADD('DAY',  -7, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'dan@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Eva Nistor',     'eva@mail.com',        'How do I become a vendor at one of your food events?',                          DATEADD('DAY',  -6, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'eva@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Frank Dima',     'frank@mail.com',      'I would like to propose a tech workshop for the next summit.',                  DATEADD('DAY',  -5, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'frank@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Grace Stan',     'grace@mail.com',      'Can I purchase tickets at the door for the Art Exhibition?',                    DATEADD('DAY',  -4, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'grace@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Hank Vlad',      'hank@mail.com',       'What is the cut-off time for marathon registration?',                           DATEADD('DAY',  -3, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'hank@mail.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Mihai Dumitru',  'mihai@example.com',   'I am interested in sponsoring one of your upcoming events. Who do I contact?',  DATEADD('DAY',  -2, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'mihai@example.com');
INSERT INTO contact_messages (name, email, message, created_at) SELECT 'Ioana Petrescu', 'ioana@example.com',   'Is group booking available for the Digital Marketing Masterclass?',             DATEADD('DAY',  -1, NOW()) WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'ioana@example.com');
