import os
import json
from flask import jsonify
from scipy.stats import pearsonr
import numpy as np
from app.models.interpretation_manager import generate_interpretation 


# Cargar los datos desde el archivo JSON
def load_data():
    JSON_FILE = 'instance/datos.json'
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r') as f:
            data = json.load(f)
        return data
    return []

#############################################################
def get_brix_data():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    brix_values = [entry['brix'] for entry in data]
    if not brix_values:
        return jsonify({"error": "No hay valores de Brix disponibles"}), 400

    avg_brix = sum(brix_values) / len(brix_values)
    
    # Automatizar el prompt
    prompt = f"El análisis de grados Brix muestra un valor promedio de {avg_brix}. ¿Qué interpretación podemos obtener sobre la calidad de la fruta?"
    interpretation = generate_interpretation(prompt)
    
    if not interpretation:
        interpretation = "No se pudo generar una interpretación. Inténtalo nuevamente."
    
    
    

    
    return jsonify({
        "brix": brix_values,
        "avg_brix": avg_brix,
        "interpretation": interpretation
    }), 200
###################################################################


def get_temperature_data():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    temp_values = [entry['temperatura'] for entry in data]
    
    if not temp_values:
        return jsonify({"error": "No hay valores de temperatura disponibles"}), 400

    avg_temp = sum(temp_values) / len(temp_values)
    
    # Automatizar el prompt
    prompt = f"El análisis de temperatura muestra un valor promedio de {avg_temp}°C. ¿Qué interpretación podemos obtener sobre la calidad de la fruta y su almacenamiento?"
    interpretation = generate_interpretation(prompt)
    
    if not interpretation:
        interpretation = "No se pudo generar una interpretación. Inténtalo nuevamente."
        
    

    
    return jsonify({
        "temperatura": temp_values,
        "avg_temp": avg_temp,
        "interpretation": interpretation
    }), 200


def detect_size_outliers():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    size_values = [entry['tamano'] for entry in data]
    
    if not size_values:
        return jsonify({"error": "No hay valores de tamaño disponibles"}), 400

    q1 = np.percentile(size_values, 25)
    q3 = np.percentile(size_values, 75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    outliers = [size for size in size_values if size < lower_bound or size > upper_bound]
    
    # Automatizar el prompt
    prompt = f"Se han detectado algunos valores atípicos en los tamaños de la fruta. ¿Qué implicaciones puede tener esto sobre la calidad del lote de frutas?"
    interpretation = generate_interpretation(prompt)
    
    if not interpretation:
        interpretation = "No se pudo generar una interpretación. Inténtalo nuevamente."
    

    
    return jsonify({
        "tamano": size_values,
        "outliers": outliers,
        "interpretation": interpretation
    }), 200


def get_brix_temperature_correlation():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    brix_values = [entry['brix'] for entry in data]
    temp_values = [entry['temperatura'] for entry in data]
    
    if not brix_values or not temp_values:
        return jsonify({"error": "No hay suficientes datos para calcular la correlación"}), 400

    correlation, _ = pearsonr(brix_values, temp_values)
    
    # Automatizar el prompt
    prompt = f"La correlación entre los grados Brix y la temperatura es {correlation:.2f}. ¿Qué interpretación podemos obtener de esta correlación en relación con la calidad de la fruta?"
    interpretation = generate_interpretation(prompt)
    
    if not interpretation:
        interpretation = "No se pudo generar una interpretación. Inténtalo nuevamente."
    

    
    return jsonify({
        "brix": brix_values,
        "temperatura": temp_values,
        "correlacion": correlation,
        "interpretation": interpretation
    }), 200

def get_visual_correlation():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    color_values = [entry['color'] for entry in data]
    visual_defects = [entry['inspeccion_visual'] for entry in data]

    if not color_values or not visual_defects:
        return jsonify({"error": "No hay suficientes datos para la correlación visual"}), 400

    color_count = {color: color_values.count(color) for color in set(color_values)}
    defect_count = {defecto: visual_defects.count(defecto) for defecto in set(visual_defects)}
    
    

    
    return jsonify({
        "color": color_count,
        "defectos": defect_count,
        # "interpretation": interpretation
    }), 200


# Función para realizar un análisis multivariable de Brix, temperatura, tamaño, color y defectos visuales
def multivariable_analysis():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    # Extraer los diferentes valores
    brix_values = [entry['brix'] for entry in data]
    temp_values = [entry['temperatura'] for entry in data]
    size_values = [entry['tamano'] for entry in data]
    color_values = [entry['color'] for entry in data]
    defect_values = [entry['inspeccion_visual'] for entry in data]

    # Calcular estadísticas básicas
    avg_brix = sum(brix_values) / len(brix_values)
    avg_temp = sum(temp_values) / len(temp_values)
    avg_size = sum(size_values) / len(size_values)

    # Correlación entre Brix y temperatura
    correlation_brix_temp, _ = pearsonr(brix_values, temp_values)

    # Distribución de color y defectos visuales
    color_distribution = {color: color_values.count(color) for color in set(color_values)}
    defect_distribution = {defect: defect_values.count(defect) for defect in set(defect_values)}

    # Interpretación basada en el análisis multivariable
    interpretation = "El análisis multivariable sugiere interacciones complejas entre los grados Brix, temperatura, tamaño, color y defectos visuales. Se observaron correlaciones interesantes que pueden influir en la calidad general de la fruta."
    # Devolver los valores multivariables y la interpretación
    

    
    return jsonify({
        "avg_brix": avg_brix,
        "avg_temp": avg_temp,
        "avg_size": avg_size,
        "correlation_brix_temp": correlation_brix_temp,
        "color_distribution": color_distribution,
        "defect_distribution": defect_distribution,
        "interpretation": interpretation
    }), 200




def segment_quality():
    data = load_data()
    if not data:
        return jsonify({"error": "No hay datos disponibles"}), 400

    quality_segments = {
        "alta": [],
        "media": [],
        "baja": []
    }

    for entry in data:
        brix = entry['brix']
        temp = entry['temperatura']
        defect = entry['inspeccion_visual']
        color = entry['color']

        if brix >= 12.5 and temp <= 15 and defect in ["Sin defectos visibles", "Manchas"] and color in ["Amarillo", "Naranja"]:
            quality_segments["alta"].append(entry)
        elif 10 <= brix < 12.5 and temp <= 17 and defect in ["Manchas", "Arrugas"]:
            quality_segments["media"].append(entry)
        else:
            quality_segments["baja"].append(entry)

    # Calcular el número total de frutas en cada categoría
    total_alta = len(quality_segments["alta"])
    total_media = len(quality_segments["media"])
    total_baja = len(quality_segments["baja"])
    
    # Generar el prompt utilizando los totales calculados
    prompt = f"Hay {total_alta} frutas de alta calidad, {total_media} de calidad media y {total_baja} de baja calidad. ¿Qué interpretación podemos obtener a partir de estos resultados respecto a almacenamiento y transporte?"
    
    interpretation = generate_interpretation(prompt)
    
    if not interpretation:
        interpretation = "No se pudo generar una interpretación. Inténtalo nuevamente."
    # Devolver los segmentos de calidad y la interpretación
    return jsonify({
        "alta": total_alta,
        "media": total_media,
        "baja": total_baja,
        "interpretation": interpretation
    }), 200
    


