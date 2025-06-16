export const IdleClientEvent = Object.freeze({
    START: "idle:client:start",
    STOP: "idle:client:stop",
    SYNC: "idle:client:sync",
    UPGRADE: "idle:client:upgrade",
});

export const IdleServerEvent = Object.freeze({
    INIT: "idle:server:init",
    UPDATE: "idle:server:update",
    STOPPED: "idle:server:stopped",
    UPGRADED: "idle:server:upgraded",
});
