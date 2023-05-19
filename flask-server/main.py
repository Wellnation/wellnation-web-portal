from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, TFDistilBertForSequenceClassification
from flask_cors import CORS

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type' 
app.config['Access-Control-Allow-Credentials'] = True

CORS(
  app, 
  resources={r"/*": {
    "origins": "*",
    "allow_headers": "*", 
    "expose_headers": "*"
  }},
  supports_credentials=True
)

# Load the tokenizer and model
tokenizer = DistilBertTokenizer.from_pretrained('oyesaurav/dwellbert')
model = TFDistilBertForSequenceClassification.from_pretrained('oyesaurav/dwellbert')

# Define the classification labels
labels = ['Gastroenterology' 'Neurology' 'Orthopedic' 'Radiology' 'Urology']

@app.route('/classify', methods=['POST'])
def classify_sentence():
    data = request.get_json()
    sentence = data['sentence']

    # Tokenize the sentence
    tokens = tokenizer.encode(
        sentence,
        truncation = True,
        padding = True,
        return_tensors = 'tf'    
    )

    # Perform classification
    logits = model.predict(tokens)[0]
    predicted_class_index = logits.argmax()
    # predicted_label = labels[predicted_class_index]

    response = {'sentence': sentence, 'predicted_label': str(predicted_class_index)}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
