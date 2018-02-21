import times from 'lodash/times';
import classnames from 'classnames';

const { __ } = wp.i18n;
const {
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;
const { Component } = wp.element;
const { RangeControl, ToggleControl } = wp.components;

class FoundationTabs extends Component {

	constructor() {
		super( ...arguments );
	}

	componentDidUpdate() {
		// const tabs = new Foundation.Tabs(jQuery('.tabs'), {});
	}

	render() {
		const { className, attributes, setAttributes, isSelected, id } = this.props;
		const { tabsCount, title, content, width, vertical } = attributes;

		return [
			!! isSelected && (
				<BlockControls key="controls">
					<BlockAlignmentToolbar
						value={ width }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						controls={ ['wide', 'full'] }
					/>
				</BlockControls>
			),
			!! isSelected && (
				<InspectorControls key="inspector">
					<ToggleControl
						label={ __( 'Vertical Tabs?' ) }
						checked={ !! vertical }
						onChange={ () => setAttributes( { vertical: ! vertical } ) }
					/>

					<RangeControl
						label={ __( 'Number of Tabs' ) }
						value={ tabsCount }
						onChange={ ( value ) => setAttributes( { tabsCount: value } ) }
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
					{ times( tabsCount, ( index ) =>
						<li
							className={classnames(
								"tabs__title",
								{ 'is-active': index === 0 }
							)}
							key={ `tab-${ index }` }
						>
							<a
								data-tabs-target={ `#panel-${ index }` }
							>
								<RichText
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
								/>
							</a>
						</li>
					) }
				</ul>
				<div className="tabs__content" data-tabs-content="example-tabs">
					{ times( tabsCount, ( index ) =>
						<RichText
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
						/>
					) }
				</div>
			</div>
		];
	}
}

export default FoundationTabs;
