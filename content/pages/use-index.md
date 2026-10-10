---
layout: page
title: use
permalink: /use/
---

<!--
    Handle the old URLs /use?page=xyz
-->
<script>
    import { onMount } from "svelte";

    onMount(() => {
        const option = new URLSearchParams(window.location.search).get("page");
        const destination = ["server", "mcupdater"].includes(option) ? option : "installer";
        window.location.replace(`/use/${destination}/`);
    });
</script>
