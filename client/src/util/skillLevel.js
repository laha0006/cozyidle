import { getFetchWithRefresh } from "./fetch";

const skillLevels = await getFetchWithRefresh("/api/skills/levels");

const levelMap = new Map();

skillLevels.data.forEach((element) => {
    const { skill_id, level, experience_required } = element;
    if (!levelMap.get(skill_id)) {
        levelMap.set(skill_id, []);
    }
    const current = levelMap.get(skill_id);
    current[level] = experience_required;
});

export function getLevel(skillId, experience) {
    const levels = levelMap.get(skillId);

    let high = levels.length;
    let low = 0;
    let level = 0;
    while (low < high) {
        const mid = Math.floor((high + low) / 2);
        const midValue = levels[mid];
        if (midValue === experience) {
            return mid;
        }
        if (midValue < experience) {
            level = mid;
            low = mid + 1;
        } else if (midValue > experience) {
            high = mid;
        }
    }
    return level;
}
