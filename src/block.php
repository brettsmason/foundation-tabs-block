<?php
defined( 'ABSPATH' ) || exit;

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 */
function foundation_tabs_block_assets() {
	wp_enqueue_style(
		'foundation-tabs-block-style-css',
		plugins_url( 'dist/block.style.css', dirname( __FILE__ ) ),
		array( 'wp-blocks' )
	);

	if ( ! is_admin() ) {
		wp_enqueue_script(
			'foundation-tabs-block-frontend-js',
			plugins_url( '/dist/block.frontend.js', dirname( __FILE__ ) ),
			array( 'jquery' ),
			null,
			true
		);
	}
}
add_action( 'enqueue_block_assets', 'foundation_tabs_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 */
function foundation_tabs_block_editor_assets() {
	wp_enqueue_script(
		'foundation-tabs-block-js',
		plugins_url( '/dist/block.editor.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'jquery' )
	);

	wp_enqueue_style(
		'foundation-tabs-block-editor-css',
		plugins_url( 'dist/block.editor.css', dirname( __FILE__ ) ),
		array( 'wp-edit-blocks' )
	);
}
add_action( 'enqueue_block_editor_assets', 'foundation_tabs_block_editor_assets' );

