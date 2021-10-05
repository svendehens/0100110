<template>
	<inertia-head>
 2    <title>{{title ? `${title} - PERFmts` : 'PERFmts'}}</title>
 3    <meta head-key="description" type="description" :content="description ? `${description}` : 'PERFmts is a service to promote and communicate special events, projects and activities relevant to the development of performing and performance arts worldwide.'" />

 4    <meta head-key="twitter:title" name="twitter:title" :content="title ? `${title} - PERFmts` : 'PERFmts'" />
 5    <meta head-key="twitter:site" name="twitter:site" content="PERFmts" />
 6    <meta head-key="twitter:creator" name="twitter:creator" content="PERFmts" />
 7    <meta head-key="twitter:description" name="twitter:description" :content="description ? `${description}` : 'PERFmts is a service to promote and communicate special events, projects and activities relevant to the development of performing and performance arts worldwide.'" />
 8    <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
 9
10    <meta head-key="og:url" property="og:url" :content="url ? `${url}` : 'https://perfmts.net/'" />
11    <meta head-key="og:title" property="og:title" :content="title ? `${title} - PERFmts` : 'PERFmts'" />
12    <meta head-key="og:description" property="og:description" :content="description ? `${description}` : 'PERFmts is a service to promote and communicate special events, projects and activities relevant to the development of performing and performance arts worldwide.'" />
13    <meta head-key="og:type" property="og:type" content="website" />
14    <meta head-key="og:image" property="og:image" :content="image ? `${image}` : 'https://perfmts.net/storage/assets/perfmts.svg'" />
15</inertia-head>
</template>

<script>

export default {
	props: {
		title: String,
        description: String,
        image: String,
        url: String,
	},
};
</script>
