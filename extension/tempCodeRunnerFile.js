const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');

// Function to load the model
async function loadModel(modelPath) {
  return await tf.loadLayersModel(modelPath);
}

// Function to preprocess the image
async function preprocessImage(imagePath) {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Normalize pixel values to be between 0 and 1
  const inputTensor = tf.browser.fromPixels(imageData).div(tf.scalar(255));

  // Expand dimensions to match the model's expected input shape
  return inputTensor.expandDims();
}

// Function to predict whether the image is AI generated or real
async function predictImage(model, inputTensor) {
  const predictions = model.predict(inputTensor);
  const result = predictions.arraySync()[0][0];

  return result;
}

// Execute the main logic
async function run() {
  const modelPath = 'model.json'; // replace with the actual path
  const model = await loadModel(modelPath);

  // Test on local image
  const localImagePath = 'path/to/local/image.jpg'; // replace with the actual path
  const localInputTensor = await preprocessImage(localImagePath);
  const localPrediction = await predictImage(model, localInputTensor);
  console.log(`Local Image Prediction: ${localPrediction}`);

  // Test on browser image (link)
  const browserImagePath = 'https://example.com/image.jpg'; // replace with the actual link
  const browserInputTensor = await preprocessImage(browserImagePath);
  const browserPrediction = await predictImage(model, browserInputTensor);
  console.log(`Browser Image Prediction: ${browserPrediction}`);
}

// Run the main logic
run().catch(console.error);
