/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import MetaBoxesIframe from './meta-boxes-iframe';
import MetaBoxesPanel from './meta-boxes-panel';
import { getMetaBox } from '../selectors';

function MetaBox( { location, isActive, usePanel = false } ) {
	if ( ! isActive ) {
		return null;
	}

	const element = <MetaBoxesIframe location={ location } />;

	if ( ! usePanel ) {
		return element;
	}

	return (
		<MetaBoxesPanel>
			{ element }
		</MetaBoxesPanel>
	);
}

export default connect( ( state, ownProps ) => ( {
	isActive: getMetaBox( state, ownProps.location ).isActive,
} ) )( MetaBox );
