import { ItemClientEvent, ItemServerEvent } from "./events/itemEvents";

export async function itemDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case ItemClientEvent.EQUIP:
            {
            }
            break;
        case ItemClientEvent.UNEQIUP:
            {
            }
            break;
        case ItemClientEvent.BUY:
            {
            }
            break;
    }
}
