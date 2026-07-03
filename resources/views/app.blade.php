<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ request()->routeIs('home') ? 'CukruDev Solutions | Website Development, Web System & Mobile App Malaysia' : config('app.name', 'Laravel') }}</title>

        @if (request()->routeIs('home'))
            {{-- SEO + social-preview tags rendered server-side — Inertia's client-only <Head>
                 would only add these after React hydrates, which crawlers/link-preview bots
                 that don't fully execute JS would never see. --}}
            <meta name="description" content="CukruDev Solutions — premium website design, web systems, mobile apps, and AI automation built for businesses in Malaysia that want to grow and convert.">
            <meta property="og:type" content="website">
            <meta property="og:site_name" content="CukruDev Solutions">
            <meta property="og:title" content="CukruDev Solutions | Website Development, Web System & Mobile App Malaysia">
            <meta property="og:description" content="Premium website design, web systems, mobile apps, and AI automation built for businesses in Malaysia that want to grow and convert.">
            <meta property="og:url" content="{{ url('/') }}">
            <meta property="og:image" content="{{ asset('images/logo.png') }}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="CukruDev Solutions | Website Development, Web System & Mobile App Malaysia">
            <meta name="twitter:description" content="Premium website design, web systems, mobile apps, and AI automation built for businesses in Malaysia that want to grow and convert.">
            <meta name="twitter:image" content="{{ asset('images/logo.png') }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        @if (request()->routeIs('home'))
            {{-- Public landing page assets — rendered server-side (not via Inertia's client-only
                 <Head>) so they're part of the first response and don't flash unstyled on load.
                 Placed last so its rules win cascade ties against Tailwind's app.css (e.g. both
                 define `.container`, and Tailwind's Preflight resets h1-h3 font-weight). --}}
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/css/landing.css?v={{ filemtime(public_path('css/landing.css')) }}">
        @endif
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
