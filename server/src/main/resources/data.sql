-- H2-compatible seed data (mirrors populate_db.sql but uses H2 date functions)

-- --------------------------------------------------------
-- Roles
-- --------------------------------------------------------
INSERT INTO roles (name) VALUES ('ORGANIZER');
INSERT INTO roles (name) VALUES ('USER');

-- --------------------------------------------------------
-- Categories (10 entries)
-- --------------------------------------------------------
INSERT INTO categories (name, description) VALUES
('Music',        'Live music concerts and festivals'),
('Technology',   'Tech conferences and networking events'),
('Sports',       'Athletic competitions and sporting events'),
('Art',          'Exhibitions, galleries, and creative workshops'),
('Food & Drink', 'Culinary festivals, wine tastings, and food tours'),
('Business',     'Corporate summits, workshops, and trade fairs'),
('Theater',      'Stage plays, musicals, and dramatic performances'),
('Education',    'Seminars, lectures, and academic symposiums'),
('Comedy',       'Stand-up shows and comedy club nights'),
('Outdoor',      'Hiking, camping meetups, and nature retreats');

-- --------------------------------------------------------
-- Events (10 entries)
-- --------------------------------------------------------
INSERT INTO events (title, description, location, start_date, end_date, price, available_slots, organizer_name) VALUES
('Summer Rock Festival',
 'An amazing outdoor music festival with local and international rock bands.',
 'National Arena, Bucharest',
 DATEADD('DAY', 10, NOW()), DATEADD('DAY', 12, NOW()),
 150.00, 500, 'Rock Productions SRL'),

('Tech Innovators Summit',
 'Annual tech conference with global speakers discussing AI and Cloud computing.',
 'Romexpo Pavilion A, Bucharest',
 DATEADD('DAY', 30, NOW()), DATEADD('DAY', 31, NOW()),
 500.00, 200, 'TechEvents Romania'),

('Classical Symphony Night',
 'An evening of beautiful classical pieces performed by the Philharmonic.',
 'Romanian Athenaeum, Bucharest',
 DATEADD('DAY', 45, NOW()), DATEADD('DAY', 45, NOW()),
 80.00, 100, 'George Enescu Philharmonic'),

('Street Food Festival',
 'Dozens of local and international food vendors in one vibrant outdoor space.',
 'Herastrau Park, Bucharest',
 DATEADD('DAY', 7, NOW()), DATEADD('DAY', 9, NOW()),
 20.00, 1000, 'Taste of Romania'),

('National Comedy Gala',
 'Top Romanian stand-up comedians perform live in one unforgettable evening.',
 'Sala Palatului, Bucharest',
 DATEADD('DAY', 20, NOW()), DATEADD('DAY', 20, NOW()),
 60.00, 300, 'Laugh Agency SRL'),

('Startup Weekend Cluj',
 '54-hour sprint where aspiring entrepreneurs build and pitch new startup ideas.',
 'Babes-Bolyai University, Cluj-Napoca',
 DATEADD('DAY', 14, NOW()), DATEADD('DAY', 16, NOW()),
 75.00, 150, 'Startup Hub Cluj'),

('Contemporary Art Exhibition',
 'Showcasing works from 30 emerging Romanian and European visual artists.',
 'National Museum of Contemporary Art, Bucharest',
 DATEADD('DAY', 5, NOW()), DATEADD('DAY', 35, NOW()),
 15.00, 200, 'Art Forward Foundation'),

('Marathon of Bucharest',
 'Annual road race across iconic city landmarks. Open to all skill levels.',
 'Constitution Square, Bucharest',
 DATEADD('DAY', 60, NOW()), DATEADD('DAY', 60, NOW()),
 40.00, 2000, 'Bucharest Sports Federation'),

('Mountain Hiking Retreat',
 'Three-day guided hiking experience through the Bucegi Natural Park.',
 'Busteni, Prahova Valley',
 DATEADD('DAY', 25, NOW()), DATEADD('DAY', 27, NOW()),
 120.00, 50, 'Wild Romania Tours'),

('Digital Marketing Masterclass',
 'Full-day intensive workshop covering SEO, social media strategy, and paid ads.',
 'Radisson Blu Hotel, Bucharest',
 DATEADD('DAY', 18, NOW()), DATEADD('DAY', 18, NOW()),
 200.00, 80, 'Growth Academy');

-- --------------------------------------------------------
-- Event categories
-- --------------------------------------------------------
INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Summer Rock Festival'          AND c.name = 'Music';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Tech Innovators Summit'        AND c.name = 'Technology';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Classical Symphony Night'      AND c.name = 'Music';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Street Food Festival'          AND c.name = 'Food & Drink';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'National Comedy Gala'          AND c.name = 'Comedy';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Startup Weekend Cluj'          AND c.name = 'Business';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Startup Weekend Cluj'          AND c.name = 'Technology';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Contemporary Art Exhibition'   AND c.name = 'Art';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Marathon of Bucharest'         AND c.name = 'Sports';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Mountain Hiking Retreat'       AND c.name = 'Outdoor';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Mountain Hiking Retreat'       AND c.name = 'Sports';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Digital Marketing Masterclass' AND c.name = 'Business';

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id FROM events e, categories c WHERE e.title = 'Digital Marketing Masterclass' AND c.name = 'Education';

-- --------------------------------------------------------
-- Contact messages (10 entries)
-- --------------------------------------------------------
INSERT INTO contact_messages (name, email, message, created_at) VALUES
('Alice Pop',      'alice@mail.com',      'Is there parking available at the Rock Festival venue?',                         DATEADD('DAY', -10, NOW())),
('Bob Ionescu',    'bob@mail.com',        'Can I get a refund if I cannot attend the Tech Summit?',                         DATEADD('DAY', -9, NOW())),
('Carol Marin',    'carol@mail.com',      'Are there vegetarian options at the Street Food Festival?',                      DATEADD('DAY', -8, NOW())),
('Dan Popa',       'dan@mail.com',        'Is the Comedy Gala suitable for children under 12?',                             DATEADD('DAY', -7, NOW())),
('Eva Nistor',     'eva@mail.com',        'How do I become a vendor at one of your food events?',                           DATEADD('DAY', -6, NOW())),
('Frank Dima',     'frank@mail.com',      'I would like to propose a tech workshop for the next summit.',                   DATEADD('DAY', -5, NOW())),
('Grace Stan',     'grace@mail.com',      'Can I purchase tickets at the door for the Art Exhibition?',                     DATEADD('DAY', -4, NOW())),
('Hank Vlad',      'hank@mail.com',       'What is the cut-off time for marathon registration?',                            DATEADD('DAY', -3, NOW())),
('Mihai Dumitru',  'mihai@example.com',   'I am interested in sponsoring one of your upcoming events. Who do I contact?',   DATEADD('DAY', -2, NOW())),
('Ioana Petrescu', 'ioana@example.com',   'Is group booking available for the Digital Marketing Masterclass?',              DATEADD('DAY', -1, NOW()));
