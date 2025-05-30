import { getIdle, startIdle } from "../database/idle";
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

async function startIdleHandler(userId) {
    startIdle(userId);
}

async function updateIdleHandler(userId) {
    console.log(handler);
}
