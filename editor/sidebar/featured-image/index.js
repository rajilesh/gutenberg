/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { Component } from 'element';
import { __ } from 'i18n';
import Button from 'components/button';
import PanelBody from 'components/panel/body';
import MediaUploadButton from 'blocks/media-upload-button';
import Spinner from 'components/spinner';

/**
 * Internal dependencies
 */
import './style.scss';
import { getEditedPostAttribute } from '../../selectors';
import { editPost } from '../../actions';

class FeaturedImage extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			media: null,
			loading: false,
		};

		// This boolean should be removed when we provide QueryComponents
		this.mounted = true;
	}

	componentDidMount() {
		this.fetchMedia();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.featuredImageId !== this.props.featuredImageId ) {
			this.fetchMedia();
		}
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	fetchMedia() {
		this.setState( { media: null } );
		if ( ! this.props.featuredImageId ) {
			this.setState( { loading: false } );
			return;
		}
		this.setState( { loading: true } );
		const mediaIdToLoad = this.props.featuredImageId;
		new wp.api.models.Media( { id: mediaIdToLoad } ).fetch()
			.done( ( media ) => {
				if ( ! this.mounted || this.props.featuredImageId !== mediaIdToLoad ) {
					return;
				}
				this.setState( {
					loading: false,
					media,
				} );
			} )
			.fail( () => {
				if ( ! this.mounted || this.props.featuredImageId !== mediaIdToLoad ) {
					return;
				}
				this.setState( {
					loading: false,
				} );
			} );
	}

	render() {
		const { featuredImageId, onUpdateImage, onRemoveImage } = this.props;
		const { media, loading } = this.state;

		return (
			<PanelBody title={ __( 'Featured image' ) } initialOpen={ false }>
				<div className="editor-featured-image__content">
					{ !! featuredImageId &&
						<MediaUploadButton
							buttonProps={ { className: 'button-link' } }
							onSelect={ onUpdateImage }
							type="image"
						>
							{ media &&
								<img
									className="editor-featured-image__preview"
									src={ media.source_url }
									alt={ __( 'Featured image' ) }
								/>
							}
							{ loading && <Spinner /> }
						</MediaUploadButton>
					}
					{ !! featuredImageId && media &&
						<p className="editor-featured-image__howto">
							{ __( 'Click the image to edit or update' ) }
						</p>
					}
					{ ! featuredImageId &&
						<MediaUploadButton
							buttonProps={ { className: 'editor-featured-image__toggle button-link' } }
							onSelect={ onUpdateImage }
							type="image"
						>
							{ wp.i18n.__( 'Set featured image' ) }
						</MediaUploadButton>
					}
					{ !! featuredImageId &&
						<Button className="editor-featured-image__toggle button-link" onClick={ onRemoveImage }>
							{ wp.i18n.__( 'Remove featured image' ) }
						</Button>
					}
				</div>
			</PanelBody>
		);
	}
}

export default connect(
	( state ) => {
		return {
			featuredImageId: getEditedPostAttribute( state, 'featured_media' ),
		};
	},
	( dispatch ) => {
		return {
			onUpdateImage( image ) {
				dispatch( editPost( { featured_media: image.id } ) );
			},
			onRemoveImage() {
				dispatch( editPost( { featured_media: null } ) );
			},
		};
	}
)( FeaturedImage );