DROP TABLE IF EXISTS user_resources;
DROP TABLE IF EXISTS user_idles;
DROP TABLE IF EXISTS idle_levels;
DROP TABLE IF EXISTS user_experiences;
DROP TABLE IF EXISTS skill_levels;
DROP TABLE IF EXISTS user_items;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS idles;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS items;
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

CREATE TABLE IF NOT EXISTS skill_levels (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER REFERENCES skills(id),
    level INTEGER NOT NULL,
    experience_required INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value INTEGER DEFAULT 1,
    skill_id INTEGER REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS idles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    resource_id INTEGER REFERENCES resources(id),
    skill_id INTEGER REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARChAR(255) NOT NULL,
    skill_id INTEGER REFERENCES skills(id),
    skill_requirement INTEGER NOT NULL,
    price INTEGER NOT NULL,
    bonus INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER references users(id),
    item_id INTEGER references items(id),
    equipped BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS idle_levels (
    id SERIAL PRIMARY KEY,
    idle_id INTEGER REFERENCES idles(id),
    level INTEGER NOT NULL,
    level_requirement INTEGER NOT NULL,
    speed_seconds INTEGER NOT NULL,
    price INTEGER NOT NULL,
    resource_id INTEGER REFERENCES resources(id)
);

CREATE TABLE IF NOT EXISTS user_idles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    idle_id INTEGER REFERENCES idles(id) ON DELETE CASCADE,
    started TIMESTAMP DEFAULT NULL,
    active BOOLEAN DEFAULT FALSE,
    unlocked BOOLEAN DEFAULT FALSE,
    level INTEGER DEFAULT 1, 
    UNIQUE(user_id, idle_id)
);

CREATE TABLE IF NOT EXISTS user_resources (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    amount INTEGER DEFAULT 0,
    UNIQUE(user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS user_experiences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id),
    experience INTEGER DEFAULT 0,
    UNIQUE(user_id, skill_id)
);


INSERT INTO skills(name) VALUES('Commerce');
INSERT INTO resources (name, value , skill_id) VALUES('Gold',1, 1);

INSERT INTO skills(name) VALUES('Fishing');
INSERT INTO resources (name, value , skill_id) VALUES('Salmon',2, 2);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Salmon', 2, 2);

INSERT INTO skills(name) VALUES('Hunting');
INSERT INTO resources (name, value , skill_id) VALUES('Boar Meat',2, 3);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Boar', 3, 3);

INSERT INTO skills(name) VALUES('Logging');
INSERT INTO resources (name, value , skill_id) VALUES('Oak',2,4);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Oak Logging', 4, 4);

INSERT INTO skills(name) VALUES('Gathering');
INSERT INTO resources (name, value , skill_id) VALUES('Mushrooms',2,5);

INSERT INTO skills(name) VALUES('Mining');
INSERT INTO resources (name, value , skill_id) VALUES('Iron Ore', 2, 6);

INSERT INTO skills(name) VALUES('Harvesting');
INSERT INTO resources (name, value , skill_id) VALUES('Wheat', 2, 7);

INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(7,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(8,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(9,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(10,1,0,60,0,2);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(11,1,0,60,0,3);

INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,1,10);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,2,25);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,3,45);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,4,85);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,5,145);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,6,245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(1,7,390);

INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,1,10);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,2,25);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,3,45);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,4,85);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,5,145);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,6,245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,7,390);


INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,1,10);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,2,25);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,3,45);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,4,85);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,5,145);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,6,245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,7,390);

INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,0,0);

INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Fishing Rod',1,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Bow',2,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Axe',3,1,100,1);
                                   