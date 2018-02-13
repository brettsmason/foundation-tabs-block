//  Import CSS
import './style.scss';
import './editor.scss';
import './tabs.js';
import classnames from 'classnames';
import { times } from 'lodash';

const { __ } = wp.i18n;
const {
	registerBlockType,
	Editable,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;

const { RangeControl, ToggleControl } = InspectorControls;

registerBlockType('tnc/tabs', {
	title: __('Tabs'),
	category: 'common',
	icon: 'shield',
	keywords: [
		__('Tabs')
	],
	attributes: {
		content: {
			type: 'array',
			source: 'query',
			selector: '.tabs__panel',
			query: {
				children: {
					source: 'children',
				},
			},
			default: [ [], [] ],
		},
		title: {
			type: 'array',
			source: 'query',
			selector: 'span',
			query: {
				children: {
					source: 'children',
				},
			},
			default: [ [], [] ],
		},
		tabs: {
			type: 'number',
			default: 2,
		},
		width: {
			type: 'string',
		},
		vertical: {
			type: 'boolean',
			default: false
		}
	},

	getEditWrapperProps( attributes ) {
		const { width } = attributes;
			if ( [ 'wide', 'full' ].indexOf( width ) !== -1 ) {
				return { 'data-align': width };
			}
	},

	edit: props => {

		const { className, attributes, setAttributes, focus, setFocus, isSelected } = props;
		const { content, title, tabs, width, vertical } = attributes;

		return [
			!! focus && (
				<BlockControls key="controls">
					<BlockAlignmentToolbar
						value={ width }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						controls={ ['wide', 'full'] }
					/>
				</BlockControls>
			),
			!! focus && (
				<InspectorControls key="inspector">
					<ToggleControl
						label={ __( 'Vertical Tabs?' ) }
						checked={ !! vertical }
						onChange={ () => setAttributes( { vertical: ! vertical } ) }
					/>

					<RangeControl
						label={ __( 'Number of Tabs' ) }
						value={ tabs }
						onChange={ ( value ) => setAttributes( { tabs: value } ) }
						min={ 2 }
						max={ 10 }
					/>
				</InspectorControls>
			),
			<div
				className={classnames(
					className,
					width ? `align${ width }` : null,
					{ 'vertical': vertical }
				)}
				key="block"
			>
				<ul className="tabs__nav" data-tabs data-link-class="tabs__title" data-panel-class="tabs__panel" id="example-tabs">
					{ times( tabs, ( index ) =>
						<li
							className={classnames(
								"tabs__title",
								{ 'is-active': index === 0 }
							)}
							key={ `tab-${ index }` }
						>
							<a
								// href={ `#panel-${ index }` }
								data-tabs-target={ `#panel-${ index }` }
							>
								<Editable
									tagName="span"
									value={ title && title[ index ] && title[ index ].children }
									onChange={ ( nextTitle ) => {
										setAttributes( {
											title: [
												...title.slice( 0, index ),
												{ children: nextTitle },
												...title.slice( index + 1 ),
											],
										} );
									} }
									placeholder={ __( 'Tab Title...' ) }
									isSelected={ isSelected }
								/>
							</a>
						</li>
					) }
				</ul>
				<div className="tabs__content" data-tabs-content="example-tabs">
					{ times( tabs, ( index ) =>
						<Editable
							tagName="div"
							multiline="p"
							className={classnames(
								"tabs__panel",
								{ 'is-active': index === 0 }
							)}
							id={ `panel-${ index }` }
							value={ content && content[ index ] && content[ index ].children }
							onChange={ ( nextContent ) => {
								setAttributes( {
									content: [
										...content.slice( 0, index ),
										{ children: nextContent },
										...content.slice( index + 1 ),
									],
								} );
							} }
							placeholder={ __( 'Tab Content...' ) }
							isSelected={ isSelected }
						/>
					) }
				</div>
			</div>
		];
	},
	save: props => {

		const { className, attributes } = props;
		const { width, content, title, tabs, vertical } = attributes;

		return (
			<div
				className={classnames(
					className,
					width ? `align${ width }` : null,
					{ 'vertical': vertical }
				)}
				key="block"
			>
				<ul className="tabs__nav" data-tabs data-link-class="tabs__title" data-panel-class="tabs__panel" id="example-tabs">
					{ times( tabs, ( index ) =>
						<li
							className={classnames(
								"tabs__title",
								{ 'is-active': index === 0 }
							)}
							key={ `tab-${ index }` }
						>
							<a
								href={ `#panel-${ index }` }
								data-tabs-target={ `panel-${ index }` }
							>
								<span>{ title && title[ index ].children }</span>
							</a>
						</li>
					) }
				</ul>
				<div className="tabs__content" data-tabs-content="example-tabs">
					{ times( tabs, ( index ) =>
						<div
							className={classnames(
								"tabs__panel",
								{ 'is-active': index === 0 }
							)}
							id={ `panel-${ index }` }
						>
							{ content && content[ index ].children }
						</div>
					) }
				</div>
			</div>
		);
	}
});
