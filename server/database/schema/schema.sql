DROP TABLE IF EXISTS user_resources;
DROP TABLE IF EXISTS user_idles;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS idles;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS skills;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    jti UUID NOT NULL UNIQUE,           -- Store the unique token ID (jti)
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    skill_id INTEGER REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS idles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    resource_id INTEGER REFERENCES resources(id),
    skill_id INTEGER REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS idle_levels (
    id SERIAL PRIMARY KEY,
    idle_id INTEGER REFERENCES idles(id),
    level INTEGER NOT NULL,
    level_requirement INTEGER NOT NULL,
    speed_seconds INTEGER NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_idles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    idle_id INTEGER REFERENCES idles(id) ON DELETE CASCADE,
    started TIMESTAMP DEFAULT NULL,
    active BOOLEAN DEFAULT FALSE,
    unlocked BOOLEAN DEFAULT FALSE,
    level INTEGER, 
    UNIQUE(user_id, idle_id)
);

CREATE TABLE IF NOT EXISTS user_resources (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    amount INTEGER DEFAULT 0,
    UNIQUE(user_id, resource_id)
);


INSERT INTO skills(name) VALUES('Fishing');
INSERT INTO skills(name) VALUES('Hunting');
INSERT INTO skills(name) VALUES('Logging');
INSERT INTO resources (name, skill_id) VALUES('Salmon', 1);
INSERT INTO resources (name, skill_id) VALUES('Boar', 2);
INSERT INTO resources (name, skill_id) VALUES('Oak', 3);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Salmon Fishing', 1, 1);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Salmon Golden Fishing', 1, 1);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Boar Hunting', 2, 2);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Oak Logging', 3, 3);