<script>
    import Metadata from "./Metadata.svelte";
    import UseOptions from "./UseOptions.svelte";
    import { formatDate } from "./content";

    let { page, posts, Content } = $props();
</script>

<Metadata {page} />

{#if page.layout === "post"}
    <article class="post h-entry" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="post-header">
            <h1 class="post-title p-name" itemprop="name headline">{page.title}</h1>
            <p class="post-meta">
                <time class="dt-published" datetime={page.date} itemprop="datePublished">{formatDate(page.date)}</time>
                {#if page.author}
                    • <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span class="p-author h-card" itemprop="name">{page.author}</span></span>
                {/if}
            </p>
        </header>
        <div class="post-content e-content" itemprop="articleBody"><Content /></div>
        <a class="u-url" href={page.url} aria-label={page.title} hidden></a>
    </article>
{:else if page.layout === "home"}
    <div class="home">
        <h1 class="page-heading">{page.title}</h1>
        <Content />
        <h2 class="post-list-heading">Posts</h2>
        <ul class="post-list">
            {#each posts as post}
                <li>
                    <span class="post-meta">{formatDate(post.date)}</span>
                    <h3><a class="post-link" href={post.url}>{post.title}</a></h3>
                </li>
            {/each}
        </ul>
        <p class="rss-subscribe">subscribe <a href="/feed.xml">via RSS</a></p>
    </div>
{:else if page.layout === "page" || page.layout === "use"}
    <article class="post">
        <header class="post-header"><h1 class="post-title">{page.title}</h1></header>
        <div class="post-content">
            <Content />
            {#if page.layout === "use"}<UseOptions />{/if}
        </div>
    </article>
{:else}
    <Content {posts} />
{/if}
