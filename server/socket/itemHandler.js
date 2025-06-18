import { buyItem, equipItem, unequipItem } from "../database/item.js";
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
                    socket.emit(ItemServerEvent.EQUIPPED, { itemId });
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
                    socket.emit(ItemServerEvent.UNEQUIPPED, { itemId });
                } catch (error) {
                    console.log(error);
                }
            }
            break;
        case ItemClientEvent.BUY:
            {
                const { itemId } = data;
                try {
                    await buyItem(userId, itemId);
                    socket.emit(ItemServerEvent.BOUGHT, { itemId });
                } catch (error) {
                    socket.emit("error", { message: error.message });
                    console.log(error);
                }
            }
            break;
    }
}
