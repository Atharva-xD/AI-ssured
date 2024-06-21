document.getElementById('scanNow').addEventListener('click', function () {
    // Open file dialog for image selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            // Generate a random percentage
            const percentage = Math.floor(Math.random() * 100) + 1;

            // Display the result
            const resultText1 = document.createElement('p');
            resultText1.style.color = '#fff';
            resultText1.style.opacity= 0.6;
            resultText1.innerHTML = 'The given input seems to be <span style="color: #ff5500;">' + percentage + '%</span>';

            const resultText2 = document.createElement('p');
            if (percentage > 80) {
                resultText2.style.color = '#ff5500';
                resultText2.innerText = 'AI-Generated';
            } else {
                resultText2.style.color = '#39FF14'; // Green color
                resultText2.innerText = 'Non AI Generated';
            }

            // Replace the existing paragraphs with the result
            const container = document.querySelector('.container');
            const paragraphs = container.querySelectorAll('p');
            
            // Replace only the specified paragraphs
            if (paragraphs.length >= 2) {
                paragraphs[0].replaceWith(resultText1);
                paragraphs[1].replaceWith(resultText2);
            }
        }
    };

    input.click();
});
