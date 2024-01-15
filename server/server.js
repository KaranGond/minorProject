const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = 5000;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Route for handling file uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Forward the image to the Google Colab script
    const formData = new FormData();
    formData.append('image', req.file.buffer, { filename: 'image.jpg' });

    const colabResponse = await axios.post(
      'http://127.0.0.1:5001/process_image',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data', // Ensure proper Content-Type
        },
        timeout: 5000, // Set a reasonable timeout in milliseconds
      }
    );

    // Log Colab server response for debugging
    console.log('Colab Server Response:', colabResponse.data);

    // Send the response from Colab back to the client
    res.json(colabResponse.data);
  } catch (error) {
    console.error('Error forwarding image to Colab', error);

    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Colab Server responded with:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Colab Server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request to Colab Server', error.message);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
