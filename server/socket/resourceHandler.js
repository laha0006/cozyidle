import { sellResource } from "../database/resource.js";
import {
    ResourceClientEvent,
    ResourceServerEvent,
} from "./events/resourceEvents.js";

export async function resourceDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case ResourceClientEvent.SELL:
            {
                const { resourceId, amount } = data;
                try {
                    const sold = await sellResource(userId, resourceId, amount);
                    socket.emit(ResourceServerEvent.SOLD, sold);
                } catch (error) {
                    console.log(error);
                }
            }
            break;
    }
}
