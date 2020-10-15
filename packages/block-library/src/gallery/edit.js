/**
 * External dependencies
 */
import {
	every,
	filter,
	forEach,
	get,
	isEmpty,
	map,
	reduce,
	some,
	toString,
	isEqual,
} from 'lodash';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	withNotices,
	RangeControl,
} from '@wordpress/components';
import { MediaPlaceholder, InspectorControls } from '@wordpress/block-editor';
import { Platform, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { withViewportMatch } from '@wordpress/viewport';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { sharedIcon } from './shared-icon';
import { defaultColumnsNumber, pickRelevantMediaFiles } from './shared';
import Gallery from './gallery';
import {
	LINK_DESTINATION_ATTACHMENT,
	LINK_DESTINATION_MEDIA,
	LINK_DESTINATION_NONE,
} from './constants';

const MAX_COLUMNS = 8;
const linkOptions = [
	{ value: LINK_DESTINATION_ATTACHMENT, label: __( 'Attachment Page' ) },
	{ value: LINK_DESTINATION_MEDIA, label: __( 'Media File' ) },
	{ value: LINK_DESTINATION_NONE, label: __( 'None' ) },
];
const ALLOWED_MEDIA_TYPES = [ 'image' ];

const PLACEHOLDER_TEXT = Platform.select( {
	web: __(
		'Drag images, upload new ones or select files from your library.'
	),
	native: __( 'ADD MEDIA' ),
} );

const MOBILE_CONTROL_PROPS_RANGE_CONTROL = Platform.select( {
	web: {},
	native: { type: 'stepper' },
} );

export const GalleryEdit = ( props ) => {
	const {
		setAttributes,
		attributes,
		clientId,
		noticeOperations,
		imageSizes,
		resizedImages,
		className,
		isSelected,
		noticeUI,
		insertBlocksAfter,
		imageCrop,
	} = props;

	const {
		linkTo,
		columns = defaultColumnsNumber( images ),
		sizeSlug,
		imageUploads,
	} = attributes;

	const [ images, setImages ] = useState( [] );

	const getBlock = useSelect( ( select ) => {
		const { getBlock } = select( 'core/block-editor' );
		return getBlock;
	} );

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	function onRemoveImage( index ) {
		// need to update columns?
	}

	function onSelectImages( newImages ) {
		const newBlocks = newImages.map( ( image ) => {
			const newImageAttribs = pickRelevantMediaFiles( image, sizeSlug );

			return createBlock( 'core/image', {
				...newImageAttribs,
				id: image.id,
				linkDestination: linkTo,
			} );
		} );

		setImages(
			newImages.map( ( newImage ) => ( {
				id: toString( newImage.id ),
				url: newImage.url,
			} ) )
		);
		replaceInnerBlocks( clientId, newBlocks );
	}

	function onUploadError( message ) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	function setLinkTo( value ) {
		setAttributes( { linkTo: value } );
	}

	function setColumnsNumber( value ) {
		setAttributes( { columns: value } );
	}

	function toggleImageCrop() {
		setAttributes( { imageCrop: ! attributes.imageCrop } );
	}

	function getImageCropHelp( checked ) {
		return checked
			? __( 'Thumbnails are cropped to align.' )
			: __( 'Thumbnails are not cropped.' );
	}

	function getImagesSizeOption() {
		return map(
			filter( imageSizes, ( { slug } ) =>
				some( resizedImages, ( sizes ) => sizes[ slug ] )
			),
			( { name, slug } ) => ( { value: slug, label: name } )
		);
	}

	function updateImagesSize( sizeSlug ) {
		const updatedImages = map( images, ( image ) => {
			if ( ! image.id ) {
				return image;
			}
			const url = get( resizedImages, [
				parseInt( image.id, 10 ),
				sizeSlug,
			] );
			return {
				...image,
				...( url && { url } ),
			};
		} );

		setAttributes( { images: updatedImages, sizeSlug } );
	}

	useEffect( () => {
		if (
			Platform.OS === 'web' &&
			imageUploads &&
			imageUploads.length > 0
		) {
			onSelectImages( imageUploads );
		}
	}, [ imageUploads ] );

	useEffect( () => {
		const newImages = getBlock( clientId ).innerBlocks.map( ( block ) => {
			return {
				id: block.attributes.id,
				url: block.attributes.url,
			};
		} );

		if ( ! isEqual( newImages, images ) ) {
			setImages( newImages );
		}
	} );

	useEffect( () => {
		// linkTo attribute must be saved so blocks don't break when changing image_default_link_type in options.php
		if ( ! linkTo ) {
			setAttributes( {
				linkTo:
					window?.wp?.media?.view?.settings?.defaultProps?.link ||
					LINK_DESTINATION_NONE,
			} );
		}
	}, [ linkTo ] );

	const hasImages = !! images.length;

	const mediaPlaceholder = (
		<MediaPlaceholder
			addToGallery={ hasImages }
			isAppender={ hasImages }
			className={ className }
			disableMediaButtons={ hasImages && ! isSelected }
			icon={ ! hasImages && sharedIcon }
			labels={ {
				title: ! hasImages && __( 'Gallery' ),
				instructions: ! hasImages && PLACEHOLDER_TEXT,
			} }
			onSelect={ onSelectImages }
			accept="image/*"
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			multiple
			value={ images }
			onError={ onUploadError }
			notices={ hasImages ? undefined : noticeUI }
		/>
	);

	if ( ! hasImages ) {
		return mediaPlaceholder;
	}

	// const imageSizeOptions = getImagesSizeOptions();
	// const shouldShowSizeOptions = hasImages && ! isEmpty( imageSizeOptions );
	const shouldShowSizeOptions = false;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Gallery settings' ) }>
					{ images.length > 1 && (
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ setColumnsNumber }
							min={ 1 }
							max={ Math.min( MAX_COLUMNS, images.length ) }
							{ ...MOBILE_CONTROL_PROPS_RANGE_CONTROL }
							required
						/>
					) }

					<ToggleControl
						label={ __( 'Crop images' ) }
						checked={ !! imageCrop }
						onChange={ toggleImageCrop }
						help={ getImageCropHelp }
					/>
					<SelectControl
						label={ __( 'Link to' ) }
						value={ linkTo }
						onChange={ setLinkTo }
						options={ linkOptions }
					/>
					{ shouldShowSizeOptions && (
						<SelectControl
							label={ __( 'Image size' ) }
							value={ sizeSlug }
							options={ imageSizeOptions }
							onChange={ updateImagesSize }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ noticeUI }
			<Gallery
				{ ...props }
				images={ images }
				mediaPlaceholder={ mediaPlaceholder }
				insertBlocksAfter={ insertBlocksAfter }
			/>
		</>
	);
};
export default compose( [
	withNotices,
	withViewportMatch( { isNarrow: '< small' } ),
] )( GalleryEdit );
