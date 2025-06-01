import { getTime } from "./database/idle.js";

async function debugTime() {
    const diff = await getTime();
    if (diff > 2) {
        console.log("TIME SKIP?");
        console.log("diff:", diff);
    } else {
        debugTime();
    }
}

debugTime();
