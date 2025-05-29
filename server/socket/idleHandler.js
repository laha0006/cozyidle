import { IdleClientEvent } from "./events/idleEvents";

export function idleDispatch(event, data) {
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
