from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Carregar o modelo treinado
model = load_model('model.h5')

@app.route('/')
def index():
    return 'Teste'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Verificar se os dados foram enviados como JSON
        if not request.json:
            return jsonify({'error': 'Os dados devem ser enviados como JSON'}), 400
        
        data = request.json
        
        # Verificar se todos os campos necessários estão presentes nos dados
        required_fields = [
            'gender', 'age', 'hypertension', 'heart_disease', 'smoking_history',
            'bmi', 'HbA1c_level', 'blood_glucose_level'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'O campo {field} é obrigatório'}), 400
        
        # Mapeamento de valores categóricos
        gender_map = {'Male': 0, 'Female': 1}
        smoking_map = {
            'never': 0, 'current': 1, 'former': 2, 'ever': 3, 
            'not current': 4, 'No Info': 5
        }

        # Converter os valores categóricos para numéricos
        gender = gender_map.get(data['gender'], -1)
        smoking_history = smoking_map.get(data['smoking_history'], -1)

        if gender == -1 or smoking_history == -1:
            return jsonify({'error': 'Valor inválido para campo categórico'}), 400
        
        # Extrair os recursos necessários para a predição
        features = np.array([
            gender,
            float(data['age']),
            int(data['hypertension']),
            int(data['heart_disease']),
            smoking_history,
            float(data['bmi']),
            float(data['HbA1c_level']),
            float(data['blood_glucose_level'])
        ]).reshape(1, -1)
        
        # Fazer a predição
        prediction = model.predict(features)
        prediction = (prediction > 0.5).astype(int)
        
        # Retornar a predição como uma resposta JSON
        return jsonify({'prediction': int(prediction[0][0])})
    except KeyError as e:
        # Se algum campo obrigatório estiver faltando nos dados
        return jsonify({'error': f'O campo {str(e)} é obrigatório'}), 400
    except Exception as e:
        # Em caso de erro desconhecido, retornar uma mensagem de erro com status HTTP 500
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Iniciar o servidor Flask
    app.run(host='0.0.0.0', port=5000)
