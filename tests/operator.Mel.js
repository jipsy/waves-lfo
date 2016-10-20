import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import FFT from '../src/operator/FFT';
import Mel from '../src/operator/Mel';
import RMSE from './utils/RMSE';
// import FileLogger from './utils/FileLogger';

// results from librosa
// > librosa.mel_frequencies(n_mels=26, htk=True, fmin=0, fmax=22050);
const htkCenterFrequencies = [
/* 0.        , */   104.5876729 ,    224.80189054,    362.97743001,
521.79790965,    704.34790983,    914.17288101,   1155.34800284,
1432.55733147,   1751.18477235,   2117.41864548,   2538.37187364,
3022.22012828,   3578.36061576,   4217.59458808,   4952.33712269,
5796.8582457 ,   6767.56008152,   7883.29541175,   9165.73383021,
10639.78260555,  12334.07042541,  14281.50341712,  16519.90424416,
19092.74669051 /*,  22050. */ ];

tape('Mel', (t) => {

  t.comment('htk - mel bands center frequencies');
  t.comment('test against librosa');

  const mel = new Mel({
    nbrBands: 24, // two less than librosa because boudaries are excluded
    minFreq: 0,
    maxFreq: 22050, // NQuyst
  });

  mel.initStream({ frameSize: 256, sourceSampleRate: 44100 });
  const centerFreqs = mel.melBandDescriptions.map((desc) => desc.centerFreq);

  t.equal(centerFreqs.length, htkCenterFrequencies.length, 'mel center frequencies should have same length (excluding boundaries)');

  const len = centerFreqs.length;
  let sum = 0;

  for (let i = 0; i < len; i++) {
    const diff = centerFreqs[i] - htkCenterFrequencies[i];
    sum += diff * diff;
  }

  const mean = sum / len;
  const error = Math.sqrt(mean);
  const melFrequenciesTolerance = 5e-4;

  // has to create a proper test with an threshold acceptable error
  t.assert(error < melFrequenciesTolerance, `should have proper mel center frequencies`);
  t.comment(`tolerance: ${melFrequenciesTolerance} - error: ${error}`);
  t.comment('-------------------------------------------------------');


  const tolerance = 7e-3;

  t.comment('compare against "./data/pipo-mel.txt"');
  t.comment('cf max patch "./data/pipo-mel.maxpat"');
  t.comment('with file "./audio/cherokee.wav"');
  t.comment('configuration:');
  t.comment('- slice.size: 256');
  t.comment('- slice.hop: 256');
  t.comment('- slice.wind: hann');
  t.comment('- slice.norm: power');
  t.comment('- fft.size: 256');
  t.comment('- fft.mode: power');
  t.comment('- fft.norm: true');
  t.comment('- fft.weighting: none');
  t.comment('- bands.mode: htkmel');
  t.comment('- bands.num: 24');
  t.comment('- bands.eqlmode: none');
  t.comment('- bands.log: 0');
  t.comment('- bands.power: 1');
  t.comment(`tolerance: ${tolerance}`);


  const compareFile = './data/pipo-mel.txt';
  const audioFile = './audio/cherokee.wav';

  const asset = av.Asset.fromFile(path.join(__dirname, audioFile));
  asset.on('error', (err) => console.log(err.stack));

  asset.decodeToBuffer((buffer) => {
    // create a load compare file function
    const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));

    // mimic web audio needed interface
    const audioBuffer = {
      sampleRate: asset.format.sampleRate,
      getChannelData: () => buffer,
    };

    const source = new AudioInBuffer({
      audioBuffer: audioBuffer,
      useWorker: false,
    });

    const slicer = new Slicer({
      frameSize: 256,
      hopSize: 256,
    });

    const fft = new FFT({
      size: 1024,
      window: 'hann',
      mode: 'power',
      norm: 'power',
    });

    const mel = new Mel({
      log: false, // if log === true rmse doesn't look appropriate
      nbrBands: 24,
    });

    const rmse = new RMSE({
      expectedFrames: expectedFrames,
      asserter: t,
      tolerance: tolerance,
    });

    source.connect(slicer);
    slicer.connect(fft);
    fft.connect(mel);
    mel.connect(rmse);

    source.start();
  });

});
