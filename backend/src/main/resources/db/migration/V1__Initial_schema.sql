CREATE TABLE clients (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE client_optional_information (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
     type VARCHAR(255) NOT NULL,
     value VARCHAR(255) NOT NULL
);

CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id),
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    commission_id INTEGER NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    queue_position INTEGER NOT NULL
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    commission_id INTEGER NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
