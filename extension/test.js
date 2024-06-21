const tf = require('@tensorflow/tfjs-node');
const cv = require('opencv4nodejs');

async function loadModel(modelPath) {
  return await tf.loadLayersModel(modelPath);
}

async function preprocessImage(imgPath) {
  const im = cv.imread(imgPath);
  const rgbImage = new cv.Mat(im.rows, im.cols, cv.CV_8UC3);
  cv.cvtColor(im, rgbImage, cv.COLOR_BGR2RGB);

  const tensorImage = tf.browser.fromPixels({ data: Buffer.from(rgbImage.getData()), width: rgbImage.cols, height: rgbImage.rows });
  const resizedImage = tf.image.resizeBilinear(tensorImage, [256, 256]);
  const normalizedImage = resizedImage.div(tf.scalar(255)).expandDims();

  return normalizedImage;
}

async function predictImage(model, inputTensor) {
  const prediction = model.predict(inputTensor);
  const result = prediction.arraySync()[0][0];

  return result;
}

async function main() {
  const modelPath = 'file://path/to/your/model.json'; // replace with the actual path
  const model = await loadModel(modelPath);

  const imagePath = 'path/to/your/image.png'; // replace with the actual path
  const inputTensor = await preprocessImage(imagePath);

  const prediction = await predictImage(model, inputTensor);

  if (prediction >= 0.5) {
    console.log('Real');
  } else {
    console.log('AI Generated');
  }
}

main().catch(console.error);
