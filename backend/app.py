from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import os
import openai
from dotenv import load_dotenv
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def enhance_catalog(df):
    original_df = df.copy()

    # Infer missing values
    df = df.applymap(lambda x: x if pd.notnull(x) else None)
    df = df.apply(infer_missing_values, axis=1)

    # Add Enhanced Attributes using AI
    df['Enhanced Attributes'] = df.apply(lambda row: generate_enhanced_attributes(row), axis=1)

    # Identify the differences between original and enhanced DataFrame
    differences = (original_df != df)
    differences = differences.fillna(False)

    return df, differences

def infer_missing_values(row):
    try:
        prompt = (
            f"Given the following product information with some missing values, infer the missing values.\n"
            f"Product Information:\n"
            f"{row.to_dict()}\n"
            f"Provide the completed product information in JSON format."
        )
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in inferring missing product attributes based on available data."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.3,
        )
        inferred_data = response.choices[0].message['content'].strip()
        inferred_dict = json.loads(inferred_data)
        for key, value in inferred_dict.items():
            if pd.isnull(row.get(key)):
                row[key] = value
        return row
    except Exception as e:
        print(f"Error inferring missing values: {e}")
        return row

def generate_enhanced_attributes(row):
    try:
        prompt = (
            f"Given the following product information, generate a comprehensive set of additional attributes that would enhance the product's description and appeal.\n"
            f"Product Information:\n"
            f"{row.to_dict()}\n"
            f"Provide the enhanced attributes in JSON format."
        )
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in generating additional product attributes to enhance product listings."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.5,
        )
        enhanced_attributes = response.choices[0].message['content'].strip()
        # Clean the JSON
        enhanced_dict = json.loads(enhanced_attributes)
        return enhanced_dict
    except Exception as e:
        print(f"Error generating enhanced attributes: {e}")
        return {}

@app.route('/api/enhance', methods=['POST'])
def enhance():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    try:
        df = pd.read_csv(file)
        enhanced_df, differences = enhance_catalog(df)

        # Convert DataFrames to JSON
        enhanced_json = enhanced_df.to_json(orient='split')
        differences_json = differences.to_json(orient='split')

        return jsonify({
            "enhancedData": enhanced_json,
            "differences": differences_json
        }), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    if not data or 'csvData' not in data:
        return jsonify({"error": "No CSV data provided."}), 400
    csv_data = data['csvData']
    return send_file(
        io.BytesIO(csv_data.encode()),
        mimetype='text/csv',
        as_attachment=True,
        download_name='enhanced_catalog.csv'
    )

if __name__ == '__main__':
    app.run(debug=True)