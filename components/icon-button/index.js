/**
 * External dependencies
 */
import classnames from 'classnames';
import { isString } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import Tooltip from '../tooltip';
import Button from '../button';
import Dashicon from '../dashicon';

class IconButton extends Component {
	constructor() {
		super( ...arguments );

		this.dismissTooltip = this.dismissTooltip.bind( this );
		this.resetClicked = this.resetClicked.bind( this );

		this.state = {
			isClicked: false,
		};
	}

	dismissTooltip() {
		this.setState( {
			isClicked: true,
		} );

		// Preserve original onClick prop behavior
		const { onClick } = this.props;
		if ( onClick ) {
			onClick( ...arguments );
		}
	}

	resetClicked() {
		this.setState( {
			isClicked: false,
		} );
	}

	render() {
		const { icon, children, label, className, tooltip, ...additionalProps } = this.props;
		const { isClicked } = this.state;
		const classes = classnames( 'components-icon-button', className );

		let element = (
			<Button
				{ ...additionalProps }
				aria-label={ label }
				className={ classes }
				onClick={ this.dismissTooltip }
				onMouseLeave={ isClicked ? this.resetClicked : null }
				onBlur={ isClicked ? this.resetClicked : null }
			>
				{ isString( icon ) ? <Dashicon icon={ icon } /> : icon }
				{ children }
			</Button>
		);

		if ( ! isClicked && label && ! children && false !== tooltip ) {
			element = <Tooltip text={ tooltip || label }>{ element }</Tooltip>;
		}

		return element;
	}
}

export default IconButton;
