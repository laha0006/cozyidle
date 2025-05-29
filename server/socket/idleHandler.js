import { getIdle } from "../database/idle";
import { IdleClientEvent } from "./events/idleEvents";

export function idleDispatch(event, socket, data) {
    switch (event) {
        case IdleClientEvent.START:
            {
                //TODO: implement database stuff
            }
            break;
        case IdleClientEvent.STOP:
            {
            }
            break;
        case IdleClientEvent.SYNC:
            {
            }
            break;
    }
}

async function updateIdle(userId) {
    const startTime = await getIdle(userId);
}
