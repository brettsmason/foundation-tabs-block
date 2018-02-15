//  Import CSS
import './style.scss';
import './editor.scss';
import './tabs.js';
import classnames from 'classnames';
import times from 'lodash/times';

const { __ } = wp.i18n;
const {
	registerBlockType,
	Editable,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;

const {
	PanelBody,
} = wp.components;

const { RangeControl, ToggleControl } = InspectorControls;

registerBlockType('tnc/tabs', {
	title: __('Tabs'),
	category: 'common',
	icon: 'shield',
	keywords: [
		__('Tabs')
	],
	attributes: {
		heading: {
			type: 'array',
			source: 'children',
			selector: '.block__heading',
		},
		description: {
			type: 'array',
			source: 'children',
			selector: '.block__description',
		},
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
		id: {
			type: 'string'
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
		const { content, title, tabs, width, vertical, heading, description, id } = attributes;

		const focusedEditable = focus ? focus.editable || 'heading' : null;

		setAttributes( { id: props.id } );

		return [
			!! focus && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={ width }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						controls={ ['wide', 'full'] }
					/>
				</BlockControls>
			),
			!! focus && (
				<InspectorControls>
					<PanelBody title={ __( 'Block Width' ) }>
						<BlockAlignmentToolbar
							value={ width }
							onChange={ ( value ) => setAttributes( { width: value } ) }
							controls={ ['wide', 'full'] }
						/>
					</PanelBody>

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
				<div className="block__wrap wrapper">
					<Editable
						key="editable"
						tagName="h2"
						className={ 'block__heading' }
						placeholder={ 'Enter a heading...' }
						onChange={ ( value ) => setAttributes( { heading: value } ) }
						value={ heading }
						focus={ focusedEditable === 'heading' }
						onFocus={ setFocus }
					/>
					<Editable
						key="editable"
						tagName="p"
						className={ 'block__description' }
						placeholder={ 'Enter a description...' }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						value={ description }
						focus={ focusedEditable === 'description' }
						onFocus={ setFocus }
					/>
				</div>

				<div className="tabs-wrapper wrapper">
					<ul className="tabs__nav" data-tabs data-link-class="tabs__title" data-panel-class="tabs__panel" id={ id }>
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
									data-tabs-target={ `${ id }-panel-${ index }` }
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
					<div className="tabs__content" data-tabs-content={ id }>
						{ times( tabs, ( index ) =>
							<Editable
								tagName="div"
								multiline="p"
								className={classnames(
									"tabs__panel",
									{ 'is-active': index === 0 }
								)}
								id={ `${ id }-panel-${ index }` }
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
			</div>
		];
	},
	save: props => {

		const { className, attributes } = props;
		const { width, content, title, tabs, vertical, heading, description, id } = attributes;

		return [
			<div
				className={classnames(
					className,
					width ? `align${ width }` : null,
					{ 'vertical': vertical }
				)}
			>
				<div className="block__wrap wrapper">
					<h2 className="block__heading">{ heading }</h2>
					<p className="block__description">{ description }</p>
				</div>

				<div className="tabs-wrapper wrapper">
					<ul className="tabs__nav" data-tabs data-link-class="tabs__title" data-panel-class="tabs__panel" id={ id }>
						{ times( tabs, ( index ) =>
							<li
								className={classnames(
									"tabs__title",
									{ 'is-active': index === 0 }
								)}
								key={ `tab-${ index }` }
							>
								<a
									href={ `#${ id }-panel-${ index }` }
									data-tabs-target={ `${ id }-panel-${ index }` }
								>
									<span>{ title && title[ index ].children }</span>
								</a>
							</li>
						) }
					</ul>
					<div className="tabs__content" data-tabs-content={ id }>
						{ times( tabs, ( index ) =>
							<div
								className={classnames(
									"tabs__panel",
									{ 'is-active': index === 0 }
								)}
								id={ `${ id }-panel-${ index }` }
							>
								{ content && content[ index ].children }
							</div>
						) }
					</div>
				</div>
			</div>
		];
	},
});
