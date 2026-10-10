---
layout: page
title: Template mod generator
permalink: /develop/template/
---

<script>
  import ClientOnly from "#lib/ClientOnly.svelte";
  import Template from "#tools/Template.svelte";
</script>

Use this tool to generate a customised template mod project, this is similar to the pre-configured <a href="https://github.com/FabricMC/fabric-example-mod">fabric-example-mod</a>.

Please submit any suggestions or feedback to <a href="https://github.com/FabricMC/fabricmc.net">github.com/FabricMC/fabricmc.net</a>

<noscript style="color:red">You need Javascript to generate a mod template</noscript>
<ClientOnly component={Template} />



<br>
For setup instructions please see the [fabric docs](https://docs.fabricmc.net/develop/) that relates to the IDE that you are using.
This template is available under the CC0 license. Feel free to learn from it and incorporate it in your own projects.
