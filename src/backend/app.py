from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas as rotas

# Carregar o modelo salvo, o scaler e as colunas
model = joblib.load('best_model.pkl')
scaler = joblib.load('scaler.pkl')
columns = joblib.load('columns.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Verifica se os dados recebidos são um dicionário
        if isinstance(data, dict):
            # Converte o dicionário em DataFrame
            df = pd.DataFrame([data])  # Usando [data] para garantir que seja uma lista de dicionários
        else:
            return jsonify({'error': 'Os dados recebidos não estão no formato esperado.'}), 400
        
        # Pré-processamento dos dados
        df = pd.get_dummies(df, columns=['gender', 'smoking_history'], drop_first=True)
        
        # Adicionar colunas que podem estar faltando
        missing_cols = set(columns) - set(df.columns)
        for col in missing_cols:
            df[col] = 0
        df = df.loc[:, columns]  # Reordenar colunas para corresponder ao scaler
        
        # Escalar os dados
        scaled_data = scaler.transform(df)
        
        # Fazer a previsão
        prediction = model.predict(scaled_data)
        
        # Ajuste da mensagem de retorno
        probability = model.predict_proba(scaled_data)[:, 1]  # Probabilidade de ter diabetes
        
        if prediction[0] == 1:
            message = f"Você tem aproximadamente {probability[0]*100:.2f}% de chance de ter Diabetes."
        else:
            message = "Você não é Diabético."
        
        return jsonify({'message': message})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
