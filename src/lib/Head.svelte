<script lang="ts">
	import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '$lib/constants';
	import { page } from '$app/state';

	let {
		title,
		description,
		image
	}: {
		title: string;
		description: string;
		image?: { src: string; alt: string };
	} = $props();
</script>

<svelte:head>
	<title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
	<meta
		name="description"
		property="og:description"
		content={description ? `${description} ${SITE_DESCRIPTION}` : SITE_DESCRIPTION}
	/>

	<meta property="og:title" content={SITE_TITLE} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:image" content="{page.url.origin}/{image?.src ?? 'icons/anchor-192.png'}" />
	<meta property="og:image:alt" content={image?.alt ?? 'A white anchor on a blue background'} />

	<link rel="canonical" href="{SITE_URL}{page.url.pathname}" />
</svelte:head>
