import { IdleClientEvent } from "./events/idleEvents.js";
import { idleDispatch } from "./idleHandler.js";

const userLocks = new Map();

// async function withUserLock(userId, fn) {
//     // Get the current tail of the user's queue, or a resolved promise if none
//     let lock = userLocks.get(userId) || Promise.resolve();
//     let result;

//     // Chain the new function onto the end of the queue
//     userLocks.set(
//         userId,
//         lock
//             .then(() => fn())
//             .then((r) => {
//                 result = r;
//                 return;
//             })
//     );

//     // Wait for this function to finish
//     await userLocks.get(userId);

//     // Clean up: remove the lock if this was the last event
//     userLocks.delete(userId);

//     return result;
// }

async function withUserLock(userId, fn) {
    // Get or create a promise chain for this user
    const currentLock = userLocks.get(userId) || Promise.resolve();

    // Create the new promise that will execute our function
    const newLock = currentLock
        .then(() => fn())
        .catch((error) => {
            console.error(`Error in user lock for ${userId}:`, error);
            throw error;
        });

    // Update the map with the new tail of the chain
    userLocks.set(userId, newLock);

    try {
        // Wait for our function to complete and return its result
        return await newLock;
    } finally {
        // Only clean up if we're still the current lock
        // (prevents cleaning up newer operations)
        if (userLocks.get(userId) === newLock) {
            // userLocks.delete(userId);
        }
    }
}

export function registerIdleHandlers(socket) {
    const events = Object.values(IdleClientEvent);
    const userId = socket.userId;
    events.forEach((event) => {
        socket.on(event, async (...args) => {
            await withUserLock(userId, async () => {
                await idleDispatch(event, socket, ...args);
            });
        });
    });
}
