import { equipItem, unequipItem } from "../database/idle";
import { ItemClientEvent, ItemServerEvent } from "./events/itemEvents";

export async function itemDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case ItemClientEvent.EQUIP:
            {
                const { itemId } = data;
                try {
                    await equipItem(userId, itemId);
                    socket.emit(ItemServerEvent.EQUIPPED);
                } catch (error) {
                    console.log(error);
                }
            }
            break;
        case ItemClientEvent.UNEQIUP:
            {
                const { itemId } = data;
                try {
                    await unequipItem(userId, itemId);
                    socket.emit(ItemServerEvent.UNEQUIPPED);
                } catch (error) {
                    console.log(error);
                }
            }
            break;
        case ItemClientEvent.BUY:
            {
            }
            break;
    }
}
