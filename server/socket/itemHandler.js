import { equipItem, unequipItem } from "../database/idle.js";
import { ItemClientEvent, ItemServerEvent } from "./events/itemEvents.js";

export async function itemDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case ItemClientEvent.EQUIP:
            {
                console.log("EQUIP YEAH");
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
                console.log("UNEQUIP YEAH!");
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
