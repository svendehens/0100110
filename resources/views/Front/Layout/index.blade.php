<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="author" content="machine for making sense">
    <meta name="description" content="@yield('description', 'machine for making sense.')">

    <!-- OG -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="@yield('url', 'https://0100110.net')">
    <meta property="og:title" content="@yield('title', 'machine for making sense')">
    <meta property="og:description"
        content="@yield('description', 'machine for making sense.')">
    <meta property="og:image" content="@yield('image', asset('storage/assets/screen.png'))">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    {{-- <meta property="twitter:url" content="@yield('url', 'https://0100110.net')"> --}}
    <meta property="twitter:title" content="@yield('title', 'machine for making sense')">
    <meta property="twitter:description"
        content="@yield('description', 'machine for making sense.')">
    <meta property="twitter:image" content="@yield('image', asset('storage/assets/screen.png'))">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('storage/assets/favicon/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('storage/assets/favicon/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('storage/assets/favicon/favicon-16x16.png') }}">

    <link rel="canonical" href="{{ Request::fullUrl() }}" />

    <title>@yield('title', 'machine for making sense')</title>

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('css/machine.css') }}">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <!-- Scripts -->
    <script src="{{ mix('js/machine/vendor.js') }}"></script>
    <script src="{{ mix('js/machine/jquery.window.min.js') }}"></script>
</head>

<body>
    <div id="test" class="ui-widget-content"></div>

    @yield('content')


    <script src="{{ mix('js/machine/app.js') }}"></script>
</body>

</html>
