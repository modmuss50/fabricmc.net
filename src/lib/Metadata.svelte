<script>
    import site from "#lib/site.json";

    let { page } = $props();
    let title = $derived(page?.title || site.title);
    let description = $derived(page?.description || site.description);
    let url = $derived(new URL(page?.url || "/", site.url).href);
    let isPost = $derived(page?.layout === "post");
    let schemaType = $derived.by(() => {
        if (isPost) {
            return "BlogPosting";
        }
        return page?.url === "/" ? "WebSite" : "WebPage";
    });
    let schema = $derived({
        "@context": "https://schema.org",
        "@type": schemaType,
        headline: title,
        description,
        url,
        ...(isPost ? { datePublished: page.date, dateModified: page.date } : { name: site.title }),
    });
</script>

<svelte:head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{page?.title ? `${title} | ${site.title}` : `${site.title} | ${site.description}`}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={site.title} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content={isPost ? "article" : "website"} />
    <meta name="twitter:card" content="summary" />
    <meta property="twitter:title" content={title} />
    {@html `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`}
    {#if isPost}<meta property="article:published_time" content={page.date} />{/if}
    <link type="application/atom+xml" rel="alternate" href={`${site.url}/feed.xml`} title={site.title} />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon.png" />
</svelte:head>
