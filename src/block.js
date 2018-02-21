//  Import CSS
import './style.scss';
import './editor.scss';
import classnames from 'classnames';
import times from 'lodash/times';
import icon from './icon';
import FoundationTabs from './foundation-tabs';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

registerBlockType('tnc/tabs', {
	title: __('Tabs'),
	description: __( 'Create a set of horizontal or vertical tabs to layout your content.' ),
	category: 'common',
	icon: icon,
	keywords: [
		__('Tabs')
	],
	attributes: {
		tabsCount: {
			type: 'number',
			default: 2,
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

	edit: FoundationTabs,

	save: props => {

		const { className, attributes, id } = props;
		const { tabsCount, title, content, width, vertical } = attributes;

		return (
			<div
				className={classnames(
					className,
					width ? `align${ width }` : null,
					{ 'vertical': vertical }
				)}
				key="block"
			>
				<ul className="tabs__nav" data-tabs data-link-class="tabs__title" data-panel-class="tabs__panel" id={ `tabs-${ id }` }>
					{ times( tabsCount, ( index ) =>
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
								<span>{ title && title[ index ] && title[ index ].children }</span>
							</a>
						</li>
					) }
				</ul>
				<div className="tabs__content" data-tabs-content={ `tabs-${ id }` }>
					{ times( tabsCount, ( index ) =>
						<div
							className={classnames(
								"tabs__panel",
								{ 'is-active': index === 0 }
							)}
							id={ `${ id }-panel-${ index }` }
						>
							{ content && content[ index ] && content[ index ].children }
						</div>
					) }
				</div>
			</div>
		);
	}
});
