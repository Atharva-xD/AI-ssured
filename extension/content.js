const apiKeys = [
    //apikeys from aiornot.com
];

let currentApiKeyIndex = 0;

async function predictImage(imageUrl, attempt = 0) {
    try {
        const apiEndpoint = 'https://api.aiornot.com/v1/reports/image';
        const apiKey = apiKeys[currentApiKeyIndex];

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ object: imageUrl })
        });

        if (!response.ok) {
            // If fetch fails, switch to the next API key
            currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
            // Retry prediction using the next API key if attempts haven't exceeded the number of keys
            if (attempt < apiKeys.length) {
                return predictImage(imageUrl, attempt + 1);
            } else {
                console.error('All API keys failed.');
                return 'Error predicting image: All API keys failed.';
            }
        }

        const data = await response.json();

        let result;

        if (data.report.verdict === 'ai') {
            result = 'It appears to be an AI-generated Image.';
        } else {
            result = 'It appears to be a Real Image.';
        }

        // Return the result
        return result;
    } catch (error) {
        console.error('Error predicting image:', error);
        // If fetch fails, switch to the next API key
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
        // Retry prediction using the next API key if attempts haven't exceeded the number of keys
        if (attempt < apiKeys.length) {
            return predictImage(imageUrl, attempt + 1);
        } else {
            console.error('Error predicting image');
            return 'Error predicting image';
        }
    }
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "createOverlay") {
        const imageURL = request.imageURL;
        console.log('Received Image URL:', imageURL); // Log the received image URL for debugging

        // Ensure imageURL is valid before proceeding with the API request
        if (!imageURL) {
            console.error('Invalid Image URL');
            return;
        }

        try {
            // Predict image using the API
            const predictionResult = await predictImage(imageURL);

            // Create overlay with the prediction result
            createOverlay(predictionResult);
        } catch (error) {
            console.error('Error:', error);
            // Handle error gracefully
            createOverlay('Error predicting image.');
        }
    }
});

function createOverlay(predictionResult) {
    const overlayContainer = document.createElement('div');
    overlayContainer.style.position = 'fixed';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.width = '100%';
    overlayContainer.style.height = '100%';
    overlayContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlayContainer.style.display = 'flex';
    overlayContainer.style.justifyContent = 'center';
    overlayContainer.style.alignItems = 'center';

    const modalContent = document.createElement('div');
    modalContent.classList.add('container'); // Add container class for styling
    modalContent.style.backgroundColor = '#10151d'; // Set background color
    modalContent.style.width = '400px';
    modalContent.style.padding = '20px'; // Set padding
    modalContent.style.borderRadius = '8px';
    modalContent.style.fontFamily = "'Times New Roman', Times, serif";

    // h1 tag
    const h1 = document.createElement('h1');
    const span = document.createElement('span');
    span.classList.add('upload');
    span.textContent = 'AI';
    h1.appendChild(span);
    const assuredText = document.createElement('span');
    assuredText.textContent = '-ssured';
    assuredText.style.color = '#fff'; // White color
    h1.appendChild(assuredText);
    h1.style.fontFamily = ''
    h1.style.color = '#ff5500'; // Same color as in popup.html
    h1.style.textAlign = 'center'; // Center align the h1 element
    h1.style.fontSize = '2.5rem'; // Center align the h1 element
    modalContent.appendChild(h1);

    // Horizontal line
    const hr = document.createElement('hr');
    modalContent.appendChild(hr);

    // First line - dynamic text
    const firstLine = document.createElement('p');
    firstLine.textContent = 'The input is likely to be:';
    firstLine.classList.add('description');
    firstLine.style.textAlign = 'center'; // Justify the text
    firstLine.style.color = '#fff'; // Justify the text
    firstLine.style.opacity = '0.6'; // Justify the text
    modalContent.appendChild(firstLine);

    // Second line - display prediction result
    const secondLine = document.createElement('p');
    secondLine.textContent = predictionResult;
    secondLine.classList.add('result');
    secondLine.style.textAlign = 'center'; // Justify the text
    secondLine.style.color = predictionResult.includes('AI-generated') ? '#ff5500' : '#39FF14'; // Red for AI-generated, green for real
    modalContent.appendChild(secondLine);

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#ff5500';
    closeButton.style.color = '#fff';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'background-color 0.3s ease';
    closeButton.style.marginTop = '20px'; // Increase margin top for spacing
    closeButton.style.display = 'block'; // Make the button a block element for center alignment
    closeButton.style.marginLeft = 'auto'; // Align to the right
    closeButton.style.marginRight = 'auto'; // Align to the left

    closeButton.addEventListener('mouseover', function () {
        closeButton.style.backgroundColor = '#ff8c00'; // Adjust the color as needed
    });

    closeButton.addEventListener('mouseout', function () {
        closeButton.style.backgroundColor = '#ff5500'; // Reset to the original color
    });

    closeButton.addEventListener('click', function () {
        // Remove the overlay when the close button is clicked
        document.body.removeChild(overlayContainer);
    });

    modalContent.appendChild(closeButton);

    overlayContainer.appendChild(modalContent);

    document.body.appendChild(overlayContainer);
}





