import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const definitions = {
  index: {
    type: 'integer',
    default: 0,
    metas: { kind: 'static' },
  },
  indices: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' },
  }
};

/**
 * Select one or several indices from a input vector. If only one index is
 * selected, the output will be of type `scalar`, otherwise the output will
 * be a vector containing the selected indices.
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default values.
 * @param {Number} options.index - Index to select from the input frame.
 * @param {Array<Number>} options.indices - Indices to select from the input
 *  frame, if defined, take precedance over `option.index`.
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 3,
 *   frameType: 'vector',
 *   sampleRate: 1,
 * });
 *
 * const select = new lfo.operator.Select({
 *   index: 1,
 * });
 *
 * eventIn.start();
 * eventIn.process(0, [0, 1, 2]);
 * > 1
 * eventIn.process(0, [3, 4, 5]);
 * > 4
 */
class Select extends BaseLfo {
  constructor(options) {
    super(options);

    this.params = parameters(definitions, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const index = this.params.get('index');
    const indices = this.params.get('indices');

    let max = (indices !== null) ?  Math.max.apply(null, indices) : index;

    if (max >= prevStreamParams.frameSize)
      throw new Error(`Invalid select index "${max}"`);

    this.streamParams.frameType = (indices !== null) ? 'vector' : 'scalar';
    this.streamParams.frameSize = (indices !== null) ? indices.length : 1;

    this.select = (indices !== null) ? indices : [index];

    // @todo - deal with description properly

    this.propagateStreamParams();
  }

  processVector(frame) {
    const data = frame.data;
    const outData = this.frame.data;
    const select = this.select;

    for (let i = 0; i < select.length; i++)
      outData[i] = data[select[i]];
  }
}

export default Select;