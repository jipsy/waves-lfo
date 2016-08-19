import BaseLfo from '../core/base-lfo';


/**
 * Output the max value of the current frame.
 * @todo - define if their are options
 */
export default class Max extends BaseLfo {
  constructor(options) {
    super({}, options);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameSize: 1,
    });
  }

  process(time, frame, metaData) {
    let max = -Infinity;

    for (let i = 0; i < frame.length; i++)
      if (frame[i] > max) max = frame[i];

    this.time = time;
    this.outFrame[0] = max;
    this.metaData = metaData;

    this.output();
  }
}
