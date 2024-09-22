import os
from openai import OpenAI

# Crear instancia del cliente OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Función para generar la interpretación usando OpenAI
def generate_interpretation(prompt):
    try:
        # Crear una solicitud de chat completion
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content":  f"{prompt}. Por favor, proporciona una interpretación breve y concisa no mayor a 60 palabras, la fruta que se esta analizando es aguaymanto, la respuesta debe ser acorde a esa fruta"
                }
            ],
            model="gpt-4o-mini",  # Modelo que estás usando
        )
        # Retornar la respuesta del modelo
        response_text = chat_completion.choices[0].message.content
        return response_text.strip()
    except Exception as e:
        print(f"Error al generar la interpretación: {e}")
        return "No se pudo generar la interpretación. Inténtalo nuevamente."
