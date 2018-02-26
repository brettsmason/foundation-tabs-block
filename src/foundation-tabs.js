import times from 'lodash/times';
import classnames from 'classnames';
import { GetYoDigits } from 'foundation-sites/js/foundation.util.core';

const { __ } = wp.i18n;
const {
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;
const { Component } = wp.element;
const { RangeControl, ToggleControl, withState } = wp.components;

const id = GetYoDigits();

class FoundationTabs extends Component {

	constructor() {
		super( ...arguments );
	}

	componentWillMount() {
		const { attributes, setAttributes } = this.props;
		const { tabsID } = attributes;
		if(tabsID === undefined) {
		  	setAttributes({ tabsID: GetYoDigits() });
		}
	}

	componentDidUpdate() {
		const { attributes, setAttributes } = this.props;
		const { tabsID } = attributes;
		const tabs = new Foundation.Tabs(jQuery(`#tabs-${ tabsID }`), {
			panelClass: 'tabs__panel',
			linkClass: 'tabs__title'
		});
		tabs.$tabTitles.off('keydown.zf.tabs'); // Disable keyboard nav to allow editing
	}

	render() {
		const { className, attributes, setAttributes, isSelected, setState } = this.props;
		const { tabsCount, tabsID, title, content, width, vertical } = attributes;

		// const onSetActiveEditable = ( newEditable ) => () => setState( { editable: newEditable } );

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

					<h2>{ __( 'Tabs Settings' ) }</h2>

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
				<ul className="tabs__nav" data-tabs id={ `tabs-${ tabsID }` }>
					{ times( tabsCount, ( index ) =>
						<li
							className={classnames(
								"tabs__title",
								{ 'is-active': index === 0 }
							)}
							key={ `${ tabsID }-tab-${ index }` }
						>
							<a
								data-tabs-target={ `${ tabsID }-panel-${ index }` }
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
									placeholder={ __( `Tab ${ index + 1 } Title...` ) }
									formattingControls={ [] }
								/>
							</a>
						</li>
					) }
				</ul>
				<div className="tabs__content" data-tabs-content={ `tabs-${ tabsID }` }>
					{ times( tabsCount, ( index ) =>
						<div
							className={classnames(
								"tabs__panel",
								{ 'is-active': index === 0 }
							)}
							id={ `${ tabsID }-panel-${ index }` }
						>
							<RichText
								tagName="div"
								multiline="p"
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
								placeholder={ __( `Tab ${ index + 1 } content...` ) }
								formattingControls={ [ 'bold', 'italic', 'link' ] }
								// isSelected={ isSelected && editable === 'content' }
								// onFocus={ onSetActiveEditable( 'content' ) }
							/>
						</div>
					) }
				</div>
			</div>
		];
	}
}

export default FoundationTabs;
