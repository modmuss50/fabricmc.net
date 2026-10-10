<script>
    import Header from "#lib/Header.svelte";
    import Footer from "#lib/Footer.svelte";
    import "../styles/site.scss";

    let { children } = $props();
</script>

<Header />
<main class="page-content" aria-label="Content">
    <div class="wrapper">{@render children()}</div>
</main>
<Footer />
