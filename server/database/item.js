import db from "./connection.js";
import { skillCheck } from "./skill.js";
import { deductResource } from "./resource.js";

export async function unequipItem(userId, itemId) {
    const checkEquippedSql = `
        SELECT ui.equipped 
        FROM user_items ui
        JOIN items i ON i.id = ui.item_id
        WHERE user_id = $1
        AND i.skill_id = (SELECT skill_id FROM items i WHERE i.id = $2)`;

    const unequipItemSql = `
        UPDATE user_items ui
        SET equipped = FALSE
        WHERE user_id = $1
        AND ui.item_id = $2
    `;

    const values = [userId, itemId];
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const res = await client.query(checkEquippedSql, values);
        if (res.rows.length > 0 && !res.rows[0].equipped) {
            throw Error("You cannot unequip an item that is not equipped");
        } else if (res.rows.length > 0 && res.rows[0].equipped) {
            const unequipRes = client.query(unequipItemSql, values);
            client.query("COMMIT");
            return unequipRes;
        }
    } catch (error) {
        client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function buyItem(userId, itemId) {
    const alreadyOwnedSql = `
        SELECT item_id 
        FROM user_items
        WHERE user_id = $1
        AND item_id = $2
    `;

    const priceSql = `
        SELECT price, skill_requirement, skill_id FROM items
        WHERE id = $1
    `;

    const buySql = `
        INSERT INTO user_items(user_id, item_id) VALUES($1, $2);
    `;

    const values = [userId, itemId];
    const client = await db.connect();
    try {
        client.query("BEGIN");
        const owned = await client.query(alreadyOwnedSql, values);
        if (owned.rows.length > 0) {
            throw new Error("You already own this item!");
        }
        const priceRes = await client.query(priceSql, [itemId]);
        const skillReq = priceRes.rows[0].skill_requirement;
        const skillId = priceRes.rows[0].skill_id;
        await skillCheck(userId, skillId, skillReq);

        const price = priceRes.rows[0].price;
        await deductResource(userId, 1, price);

        await client.query(buySql, values);
        await client.query("COMMIT");
        return { price };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function equipItem(userId, itemId) {
    const checkEquippedSql = `
        SELECT ui.equipped 
        FROM user_items ui
        JOIN items i ON i.id = ui.item_id
        WHERE user_id = $1
        AND i.skill_id = (SELECT skill_id FROM items i WHERE i.id = $2)`;
    const equipItemSql = `
        UPDATE user_items ui
        SET equipped = TRUE
        WHERE user_id = $1
        AND ui.item_id = $2
        RETURNING ui.item_id
    `;

    const client = await db.connect();
    const values = [userId, itemId];
    try {
        client.query("BEGIN");

        const res = await client.query(checkEquippedSql, values);

        if (res.rows.length === 0) {
            throw Error("You cannot equip an item you do not own.");
        }
        if (res.rows[0].equipped) {
            throw new Error("Item for this skill is already equipped");
        }

        await client.query(equipItemSql, values);
        await client.query("COMMIT");
        return true;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
