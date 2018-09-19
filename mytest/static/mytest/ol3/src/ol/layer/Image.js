/**
 * @module ol/layer/Image
 */
import LayerType from '../LayerType.js';
import Layer from '../layer/Layer.js';


/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {module:ol/source/Image} [source] Source for this layer.
 */


/**
 * @classdesc
 * Server-rendered images that are available for arbitrary extents and
 * resolutions.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @fires module:ol/render/Event~RenderEvent
 * @api
 */
class ImageLayer extends Layer {

  /**
   * @param {module:ol/layer/Image~Options=} opt_options Layer options.
   */
  constructor(opt_options) {
    const options = opt_options ? opt_options : {};
    super(options);

    /**
     * The layer type.
     * @protected
     * @type {module:ol/LayerType}
     */
    this.type = LayerType.IMAGE;

  }

}


/**
 * Return the associated {@link module:ol/source/Image source} of the image layer.
 * @function
 * @return {module:ol/source/Image} Source.
 * @api
 */
ImageLayer.prototype.getSource;
export default ImageLayer;