---
layout: use
title: "Installation for MCUpdater"
permalink: /use/mcupdater/
---

<script>
  import ClientOnly from "#lib/ClientOnly.svelte";
  import MCUpdater from "#tools/MCUpdater.svelte";
</script>

<noscript style="color:red">You need Javascript to show the download options</noscript>

<ClientOnly component={MCUpdater} />
