<?php
/**
 * Plugin Name: SAT Design System para WPBakery Page Builder
 * Description: Shortcodes oficiales y estilos del Manual de Imagen V.5 de SAT Guatemala para WPBakery Page Builder.
 * Version: 1.0.0
 * Author: SAT Guatemala
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Cargar CSS institucional
function sat_ds_enqueue_scripts() {
    wp_register_style(
        'sat-design-system-wpb',
        plugin_dir_url(__FILE__) . 'sat-design-system-wpbakery.css',
        array(),
        '1.0.0'
    );
    wp_enqueue_style('sat-design-system-wpb');
}
add_action('wp_enqueue_scripts', 'sat_ds_enqueue_scripts');

/**
 * 2. Shortcode: [sat_card]
 * Parámetros:
 * - title: Título de la gestión o servicio en lenguaje claro
 * - desc: Descripción ciudadana orientada a beneficio (máx 2 oraciones)
 * - tone: azul | celeste | verde | naranja | morado
 * - url: Enlace de destino
 * - target: _self | _blank
 * - footer: Texto secundario opcional (ej. "En Línea · Gratuito")
 */
function sat_card_shortcode($atts) {
    $a = shortcode_atts(array(
        'title'       => 'Título de la Gestión',
        'desc'        => '',
        'tone'        => 'azul',
        'url'         => '#',
        'target'      => '_self',
        'footer'      => '',
        'extra_class' => '',
    ), $atts, 'sat_card');

    $tone_class = 'sat-card--' . sanitize_html_class($a['tone']);
    $url = esc_url($a['url']);
    $target = esc_attr($a['target']);
    $title = esc_html($a['title']);
    $desc = esc_html($a['desc']);
    $footer = esc_html($a['footer']);
    $extra_class = sanitize_html_class($a['extra_class']);

    $chevron_svg = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';

    $output  = '<a href="' . $url . '" target="' . $target . '" class="sat-card ' . $tone_class . ' ' . $extra_class . '">';
    $output .= '  <div class="sat-card-header">';
    $output .= '    <h3 class="sat-card-title">' . $title . '</h3>';
    $output .= '    <span class="sat-card-chevron" aria-hidden="true">' . $chevron_svg . '</span>';
    $output .= '  </div>';

    if (!empty($desc)) {
        $output .= '  <p class="sat-card-desc">' . $desc . '</p>';
    }

    if (!empty($footer)) {
        $output .= '  <div class="sat-card-footer">';
        $output .= '    <span>' . $footer . '</span>';
        $output .= '  </div>';
    }

    $output .= '</a>';

    return $output;
}
add_shortcode('sat_card', 'sat_card_shortcode');

/**
 * 3. Integración nativa con WPBakery (vc_map)
 */
function sat_ds_integrate_wpbakery() {
    if (!function_exists('vc_map')) {
        return;
    }

    vc_map(array(
        'name'        => __('Card SAT (Design System)', 'sat-ds'),
        'base'        => 'sat_card',
        'category'    => __('SAT Guatemala', 'sat-ds'),
        'description' => __('Tarjeta sin bordes con hover sólido del Design System SAT', 'sat-ds'),
        'params'      => array(
            array(
                'type'        => 'textfield',
                'heading'     => __('Título de la Gestión', 'sat-ds'),
                'param_name'  => 'title',
                'value'       => __('Inscripción de NIT', 'sat-ds'),
                'admin_label' => true,
            ),
            array(
                'type'        => 'textarea',
                'heading'     => __('Descripción Ciudadana', 'sat-ds'),
                'param_name'  => 'desc',
                'value'       => __('Obtén tu Número de Identificación Tributaria por primera vez en línea para emitir facturas o empleo.', 'sat-ds'),
            ),
            array(
                'type'        => 'dropdown',
                'heading'     => __('Tono de Segmento', 'sat-ds'),
                'param_name'  => 'tone',
                'value'       => array(
                    __('Azul Institucional', 'sat-ds')    => 'azul',
                    __('Celeste (Personas)', 'sat-ds')     => 'celeste',
                    __('Verde (Empresas)', 'sat-ds')       => 'verde',
                    __('Naranja (Aduanas)', 'sat-ds')      => 'naranja',
                    __('Morado (Auxiliares)', 'sat-ds')    => 'morado',
                ),
                'std'         => 'azul',
            ),
            array(
                'type'        => 'textfield',
                'heading'     => __('URL de Destino', 'sat-ds'),
                'param_name'  => 'url',
                'value'       => 'https://portal.sat.gob.gt/',
            ),
            array(
                'type'        => 'dropdown',
                'heading'     => __('Abrir en', 'sat-ds'),
                'param_name'  => 'target',
                'value'       => array(
                    __('Misma pestaña (_self)', 'sat-ds')   => '_self',
                    __('Nueva pestaña (_blank)', 'sat-ds')  => '_blank',
                ),
                'std'         => '_self',
            ),
            array(
                'type'        => 'textfield',
                'heading'     => __('Texto de Pie (Opcional)', 'sat-ds'),
                'param_name'  => 'footer',
                'value'       => '',
            ),
            array(
                'type'        => 'textfield',
                'heading'     => __('Clase CSS Extra', 'sat-ds'),
                'param_name'  => 'extra_class',
                'value'       => '',
            ),
        ),
    ));
}
add_action('vc_before_init', 'sat_ds_integrate_wpbakery');
