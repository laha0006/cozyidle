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
INSERT INTO resources (name, value , skill_id) VALUES('Mushroom',2,5);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Mushroom', 5, 5);

INSERT INTO skills(name) VALUES('Mining');
INSERT INTO resources (name, value , skill_id) VALUES('Iron Ore', 2, 6);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Iron', 6, 6);

INSERT INTO skills(name) VALUES('Harvesting');
INSERT INTO resources (name, value , skill_id) VALUES('Wheat', 2, 7);
INSERT INTO idles (name, resource_id, skill_id) VALUES('Wheat', 7, 7);
-- idle level 1
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,1,0,60,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,1,0,60,0,1);

-- idle level 2
iNSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,2,10,50,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,2,10,50,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,2,10,50,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,2,10,50,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,2,10,50,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,2,10,50,0,1);
-- idle level 3
iNSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,3,20,40,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,3,20,40,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,3,20,40,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,3,20,40,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,3,20,40,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,3,20,40,0,1);
-- idle level 4
iNSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,4,50,30,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,4,50,30,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,4,50,30,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,4,50,30,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,4,50,30,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,4,50,30,0,1);
-- idle level 5
iNSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(1,5,100,10,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(2,5,100,10,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(3,5,100,10,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(4,5,100,10,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(5,5,100,10,0,1);
INSERT INTO idle_levels (idle_id , level, level_requirement, speed_seconds, price, resource_id ) VALUES(6,5,100,10,0,1);


--skill levels 

--skill 2 
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(2,100,1485837);

-- skill 3
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(3,100,1485837);

-- skill 4
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(4,100,1485837);

--skill 5
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(5,100,1485837);

-- skill 6
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(6,100,1485837);

-- skill 7
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,0,0);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,1,4);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,2,17);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,3,41);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,4,80);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,5,139);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,6,224);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,7,342);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,8,500);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,9,705);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,10,964);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,11,1285);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,12,1675);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,13,2142);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,14,2694);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,15,3340);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,16,4088);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,17,4947);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,18,5927);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,19,7037);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,20,8287);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,21,9686);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,22,11245);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,23,12973);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,24,14880);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,25,16976);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,26,19271);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,27,21775);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,28,24498);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,29,27451);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,30,30643);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,31,34085);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,32,37787);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,33,41759);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,34,46012);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,35,50555);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,36,55400);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,37,60556);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,38,66034);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,39,71844);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,40,77997);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,41,84494);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,42,91354);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,43,98588);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,44,106207);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,45,114221);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,46,122641);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,47,131478);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,48,140742);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,49,150445);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,50,160597);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,51,171210);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,52,182294);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,53,193860);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,54,205919);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,55,218482);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,56,231560);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,57,245164);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,58,259305);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,59,273995);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,60,289244);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,61,305064);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,62,321466);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,63,338461);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,64,356060);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,65,374274);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,66,393115);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,67,412594);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,68,432721);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,69,453509);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,70,474968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,71,497110);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,72,519946);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,73,543487);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,74,567745);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,75,592731);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,76,618456);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,77,644932);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,78,672170);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,79,700181);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,80,728977);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,81,758569);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,82,788968);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,83,820186);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,84,852234);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,85,885123);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,86,918864);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,87,953469);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,88,988949);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,89,1025316);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,90,1062581);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,91,1100756);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,92,1139842);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,93,1179849);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,94,1220780);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,95,1262636);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,96,1305418);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,97,1349127);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,98,1393766);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,99,1439335);
INSERT INTO skill_levels (skill_id, level, experience_required) VALUES(7,100,1485837);

INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Fishing Rod',2,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Bow',3,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Axe',4,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Knife',5,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Pickaxe',6,1,100,1);
INSERT INTO items (name, skill_id, skill_requirement, price, bonus) VALUES('Basic Scythe',7,1,100,1);
                                   