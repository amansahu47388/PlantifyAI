import os
import json
import numpy as np 
from PIL import Image
import tensorflow as tf
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

# Define working directory and paths
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(working_dir, 'trained_model', 'Plantify2_VGG16.h5')
class_indices_path = os.path.join(working_dir, 'class_indices.json')

# Load the pre-trained model
model = tf.keras.models.load_model(model_path)

# Load the class indices from JSON file
with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

def load_and_preprocess_image(image_path, target_size=(224, 224)):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')  # Ensure image is in RGB format
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.0
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def predict_image_class(model, image_path, class_indices):
    try:
        preprocessed_img = load_and_preprocess_image(image_path)
        predictions = model.predict(preprocessed_img)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        predicted_class_name = class_indices[str(predicted_class_index)]
        
        # Include confidence score in the prediction
        result = {
            'disease_name': predicted_class_name,
            'confidence': round(confidence * 100, 2)
        }
        return result
    except Exception as e:
        raise ValueError(f"Error during prediction: {str(e)}")
    


@csrf_exempt
def predict_disease(request):
    if request.method == 'POST':
        try:
            image = request.FILES.get('image')
            if not image:
                return JsonResponse({'error': 'No image provided'}, status=400)

            # Save the image temporarily
            temp_image_path = os.path.join(working_dir, 'temp_image.jpg')
            with open(temp_image_path, 'wb') as f:
                for chunk in image.chunks():
                    f.write(chunk)

            # Predict the disease
            prediction_result = predict_image_class(model, temp_image_path, class_indices)
            
            # Clean up
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
            
            return JsonResponse(prediction_result)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)