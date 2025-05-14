import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgres://dev:dev_pass@localhost/dev",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

export default pool;
