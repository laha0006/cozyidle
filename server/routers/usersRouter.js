import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import db from "../database/connection.js";
import { updateIdles } from "../database/idle.js";
const router = Router();

router.use(authenticateToken);

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT username FROM users WHERE id = $1`;

    const client = await db.connect();
    try {
        const result = await client.query(sql, [userId]);
        const rows = result.rows;
        res.send({ data: rows });
    } catch (error) {
        res.status(404).send({ message: "Couldn't find profile!" });
    } finally {
        client.release();
    }
});

router.get("/:userId/idles", async (req, res) => {
    const { userId } = req.params;

    await updateIdles(userId);

    const sql = `
    WITH user_skill_level AS (
        SELECT DISTINCT ON (sl.skill_id)
            sl.level AS skill_level,
                sl.skill_id AS skill_id
        FROM user_experiences ue
        JOIN skill_levels sl
        ON sl.skill_id = ue.skill_id
        WHERE ue.user_id = 1
        AND sl.experience_required <= ue.experience
        ORDER BY sl.skill_id ,sl.level DESC
    ),
    item_bonus AS (
        SELECT i.bonus AS bonus, i.skill_id AS skill_id
        FROM items i
        JOIN user_items ui ON ui.item_id = i.id
        WHERE user_id = $1
        AND ui.equipped IS TRUE
    ),
    init AS (
        SELECT i.name AS idle,
            i.id as idle_id,
            EXTRACT(EPOCH FROM NOW())*1000 as now_unix,
            usl.skill_level AS skill_level,
            r.id as resource_id,
            il.level_requirement AS level_req,
            s.name AS skill,
            s.id AS skill_id,
            r.name AS resource,
            ur.amount AS amount,
            ui.unlocked AS unlocked,
            ui.active AS active,
            GREATEST(FLOOR((il.speed_seconds * POWER(0.98, usl.skill_level))),2) AS speed,
            ui.level AS level,
            COALESCE(ib.bonus, 0) AS bonus,
            EXTRACT(EPOCH FROM ui.started) * 1000 AS started
        FROM user_idles ui
            JOIN idles i
                ON ui.idle_id = i.id
            JOIN resources r
                ON i.resource_id = r.id
            JOIN skills s
                ON s.id = i.skill_id
            JOIN user_resources ur
                ON ur.resource_id = r.id AND ur.user_id = $1
            JOIN idle_levels il
                ON il.level = ui.level AND il.idle_id = ui.idle_id
            JOIN user_skill_level usl
                ON usl.skill_id = s.id
            LEFT JOIN item_bonus ib
                ON ib.skill_id = s.id
        WHERE ui.user_id = $1)
        SELECT
            idle,
            skill_level,
            idle_id,
            level_req,
            resource_id,
            skill,
            skill_id,
            resource,
            amount,
            unlocked,
            active,
            speed,
            bonus+1 AS increment,
            started,
            (EXTRACT(EPOCH FROM NOW()) * 1000) - started AS diff,
            level,
            now_unix
        FROM init
        ORDER BY unlocked DESC,active DESC, level_req`;

    const result = await db.query(sql, [userId]);
    const data = result.rows;
    const cleanedData = data.map(
        ({
            skill_level,
            idle_id,
            level_req,
            resource_id,
            skill_id,
            now_unix,
            ...rest
        }) => {
            return {
                ...rest,
                skillLevel: skill_level,
                idleId: idle_id,
                levelReq: level_req,
                resourceId: resource_id,
                skillId: skill_id,
                nowUnix: now_unix,
            };
        }
    );

    res.send({ data: cleanedData });
});

router.get("/:userId/items", async (req, res) => {
    const { userId } = req.params;
    const allItemsSql = `
    SELECT
        i.name AS name,
        s.name AS skill,
        i.bonus AS bonus,
        i.price,
        i.skill_requirement AS requirement,
        ui.equipped,
        i.id AS item_id,
        s.id AS skill_id,
        CASE WHEN ui.user_id IS NULL THEN false ELSE true END AS owned
    FROM items i
    JOIN skills s ON s.id = i.skill_id
    LEFT JOIN user_items ui
    ON ui.item_id = i.id AND ui.user_id = $1`;

    const client = await db.connect();
    try {
        const result = await client.query(allItemsSql, [userId]);
        const data = result.rows;
        const cleanedData = data.map(({ item_id, skill_id, ...rest }) => {
            return {
                ...rest,
                itemId: item_id,
                skillId: skill_id,
            };
        });
        res.send({ data: cleanedData });
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
});

router.get("/:userId/skills", async (req, res) => {
    const { userId } = req.params;
    const sql = `
    SELECT DISTINCT ON (sl.skill_id)
        sl.level AS level,
        sl.skill_id AS id,
        s.name AS  name,
        ue.experience AS experience
    FROM user_experiences ue
    JOIN skill_levels sl
        ON sl.skill_id = ue.skill_id
    JOIN skills s ON s.id = ue.skill_id
    WHERE ue.user_id = $1
    AND sl.experience_required <= ue.experience
    ORDER BY sl.skill_id ,sl.level DESC
    `;

    try {
        await updateIdles(userId);
        const result = await db.query(sql, [userId]);
        res.send({ data: result.rows });
    } catch (error) {
        console.log(error);
    }
});

router.get("/:userId/resources", async (req, res) => {
    const { userId } = req.params;
    const sql = `
    SELECT
        ur.amount,
        r.value,
        r.name,
        r.id,
        r.skill_Id
    FROM user_resources ur
    JOIN resources r
        ON r.id = ur.resource_id
    WHERE ur.user_id = $1
    `;

    await updateIdles(userId);
    const result = await db.query(sql, [userId]);
    const data = result.rows;
    const cleanedData = data.map(({ skill_id, ...rest }) => {
        return {
            ...rest,
            skillId: skill_id,
        };
    });
    res.send({ data: cleanedData });
});

export default router;
