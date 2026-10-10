---
layout: use
title: "Installation for Minecraft Launcher"
permalink: /use/installer/
---

<script>
  import ClientOnly from "#lib/ClientOnly.svelte";
  import Installer from "#tools/Installer.svelte";
</script>

<noscript style="color:red">You need Javascript to show the download options</noscript>

<ClientOnly component={Installer} />
