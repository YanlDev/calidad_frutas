from flask import Blueprint, request, jsonify
from app.models.data_manager import save_data, save_excel
from app.models.analysis_manager import (
    get_brix_data,
    get_temperature_data,
    detect_size_outliers,
    get_brix_temperature_correlation,
    get_visual_correlation,
    multivariable_analysis,
    segment_quality
)

from app.models.interpretation_manager import generate_interpretation

# Blueprint para las rutas relacionadas con los datos
data_routes = Blueprint('data_routes', __name__)

# Ruta para guardar los datos manuales
@data_routes.route('/guardar_datos', methods=['POST'])
def guardar_datos():
    data = request.get_json()
    return save_data(data)

# Ruta para cargar y procesar el archivo Excel
@data_routes.route('/subir_excel', methods=['POST'])
def subir_excel():
    try:
        # Recibir el JSON del frontend
        json_data = request.get_json()
        
        # Guardar los datos usando la función save_data
        for record in json_data:
            save_data(record)
        
        return jsonify({"message": "Datos del Excel procesados y guardados con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para obtener los datos de Brix
@data_routes.route('/analisis/brix', methods=['GET'])
def analisis_brix():
    return get_brix_data()

# Ruta para obtener los datos de temperatura
@data_routes.route('/analisis/temperatura', methods=['GET'])
def analisis_temperatura():
    return get_temperature_data()

# Ruta para obtener los outliers de tamaño
@data_routes.route('/analisis/outliers_tamano', methods=['GET'])
def analisis_outliers_tamano():
    return detect_size_outliers()

# Ruta para obtener la correlación Brix-Temperatura
@data_routes.route('/analisis/correlacion_brix_temp', methods=['GET'])
def analisis_correlacion_brix_temp():
    return get_brix_temperature_correlation()

# Ruta para obtener la distribución de colores
@data_routes.route('/analisis/distribucion_colores', methods=['GET'])
def analisis_distribucion_colores():
    return get_visual_correlation()

# Ruta para obtener la distribución de defectos visuales
@data_routes.route('/analisis/distribucion_defectos', methods=['GET'])
def analisis_distribucion_defectos():
    return get_visual_correlation()  # Reutilizando la función de correlación visual

# Ruta para el análisis multivariable
@data_routes.route('/analisis/multivariable', methods=['GET'])
def analisis_multivariable():
    return multivariable_analysis()

# Ruta para la segmentación de calidad
@data_routes.route('/analisis/calidad', methods=['GET'])
def analisis_calidad():
    return segment_quality()



# OPEN IA RUTA 

@data_routes.route('/interpretar', methods=['POST'])
def interpretar_datos():
    # Obtener el prompt del cuerpo de la solicitud
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({"error": "No se proporcionó ningún prompt"}), 400

    # Generar la interpretación usando la API de OpenAI
    interpretation = generate_interpretation(prompt)

    return jsonify({"interpretation": interpretation}), 200



@data_routes.route('/limpiar_datos', methods=['POST'])
def limpiar_datos():
    try:
        with open('instance/datos.json', 'w') as file:
            file.write('[]')  # Vacía el archivo JSON
        return jsonify({"message": "Datos limpiados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
