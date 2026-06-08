<?php
/**
 * Plugin Name: Pcpropr Headless CORS
 * Description: Libera a leitura pública da REST API do WordPress para o front-end Pcpropr.
 * Version: 1.0.0
 * Author: Pcpropr
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed_origins = array(
            'https://pcpropr.com.br',
            'https://www.pcpropr.com.br',
        );

        $origin = get_http_origin();
        if ($origin && in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Methods: GET, OPTIONS');
            header('Access-Control-Allow-Credentials: false');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        }

        return $value;
    });
}, 15);
