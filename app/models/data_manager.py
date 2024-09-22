import json
import os
import pandas as pd
from flask import jsonify

# Ruta del archivo JSON donde se almacenan los datos
JSON_FILE = 'instance/datos.json'

# Función para guardar datos manuales en el archivo JSON
def save_data(data):
    # Verificar si existe el archivo JSON
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []  # Si el archivo está vacío o tiene errores
    else:
        existing_data = []

    # Agregar los nuevos datos
    existing_data.append(data)

    # Guardar los datos actualizados en el archivo JSON
    with open(JSON_FILE, 'w') as json_file:
        json.dump(existing_data, json_file, indent=4)

    return jsonify({"message": "Datos guardados con éxito"}), 200

# Función para guardar el archivo Excel en la carpeta 'instance/uploads'
def save_excel(file):
    file_path = os.path.join('instance/uploads', file.filename)
    file.save(file_path)

    # Convertir el Excel a JSON
    df = pd.read_excel(file_path)
    json_data = df.to_dict(orient='records')

    # Llamamos a save_data para agregar estos datos al JSON
    for record in json_data:
        save_data(record)

    return jsonify({"message": "Archivo Excel guardado y procesado con éxito"}), 200

