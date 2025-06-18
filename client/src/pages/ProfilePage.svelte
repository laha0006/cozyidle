<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../util/fetch";

    const { params } = $props();
    const userId = $state(params.userId);
    let skills = $state(null);
    let username = $state("");
    onMount(async () => {
        console.log("userId", userId);
        const skillsJson = await getFetchWithRefresh(
            "/api/users/" + userId + "/skills"
        );
        const userData = await getFetchWithRefresh(
            "/api/users/" + userId + "/"
        );
        console.log("userData:", userData);
        username = userData.data[0].username;
        console.log("username:", username);

        const sortByExperience = skillsJson.data.sort((a, b) => {
            return b.experience - a.experience;
        });
        skills = sortByExperience;
    });
</script>

<div class="">
    <h1 class="text-foreground text-4xl mb-2">{username}</h1>
    <div
        class="flex px-2 flex-col justify-center items-center bg-card border-border border-1 rounded-2xl"
    >
        <div>Skills:</div>
        <table>
            <thead>
                <tr class="">
                    <th class="px-5">Name</th>
                    <th class="px-5">Level</th>
                    <th class="px-5">Experience</th>
                </tr>
            </thead>
            <tbody>
                {#each skills as skill}
                    <tr>
                        <td>{skill.name}</td>
                        <td>{skill.level}</td>
                        <td>{skill.experience}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <div></div>
    </div>
</div>
