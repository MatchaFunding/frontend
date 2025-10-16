import qrcode
from PIL import Image, ImageDraw

# --- CONFIGURACIÓN ---
# 1. Contenido del QR (URL o texto)
QR_DATA = "http://matchafunding.com/"

# 2. Ruta a tu archivo de logo (debe ser PNG con fondo transparente o el fondo será pegado)
LOGO_PATH = "C:/Users/etrtp/Downloads/logo.png"

# 3. Nombre del archivo de salida
OUTPUT_FILENAME = "qr_proyecto_final_color.png"

# --- NUEVAS OPCIONES DE COLOR ---
# Color de los módulos del QR (ejemplo: un tono de verde para "matcha")
# Usa el formato de código hexadecimal (#RRGGBB) o nombre de color ('red', 'blue', etc.)
QR_COLOR = "#919C2B"  # Verde esmeralda (similar al matcha)

# Color de fondo del QR. Cuidado: un color oscuro puede dificultar el escaneo.
# Se recomienda mantener el fondo BLANCO o muy claro.
BACKGROUND_COLOR = "white"

# Factor de tamaño del área central de padding/silencio.
PADDING_SIZE_FACTOR = 0.243

# --- FUNCIÓN PRINCIPAL ---
def generar_qr_con_padding_y_logo():
    """Genera un QR con color, padding blanco en el centro y luego pega el logo."""
    try:
        # 1. GENERAR EL CÓDIGO QR BASE (Nivel H para alta tolerancia de error)
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(QR_DATA)
        qr.make(fit=True)

        # *** CAMBIO CLAVE: Usamos las nuevas variables de color aquí ***
        img_qr = qr.make_image(fill_color=QR_COLOR, back_color=BACKGROUND_COLOR).convert('RGB')
        qr_size = img_qr.size[0]

        # 2. CALCULAR TAMAÑO Y POSICIÓN DEL ÁREA DE PADDING/SILENCIO
        
        # Determina el tamaño del cuadrado blanco de padding
        padding_size = int(qr_size * PADDING_SIZE_FACTOR)
        
        # Calcula las coordenadas para el cuadrado central
        start_pos = (qr_size - padding_size) // 2
        end_pos = start_pos + padding_size
        padding_coords = (start_pos, start_pos, end_pos, end_pos)

        # 3. DIBUJAR EL PADDING BLANCO (Área de Silencio)
        
        # Usamos 'white' aquí para asegurar un área de silencio de ALTO CONTRASTE,
        # independientemente del BACKGROUND_COLOR elegido arriba.
        draw = ImageDraw.Draw(img_qr)
        draw.rectangle(padding_coords, fill="white")

        # 4. CARGAR Y PEGAR EL LOGO (dentro del área de padding)
        
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo_target_size = int(padding_size * 0.8) # 80% del tamaño del padding
        logo = logo.resize((logo_target_size, logo_target_size))

        logo_pos_x = (qr_size - logo_target_size) // 2
        logo_pos_y = (qr_size - logo_target_size) // 2

        img_qr.paste(logo, (logo_pos_x, logo_pos_y), logo) 
        
        # 5. GUARDAR EL RESULTADO
        img_qr.save(OUTPUT_FILENAME)
        print(f"✅ QR generado exitosamente como '{OUTPUT_FILENAME}'.")
        print(f"   Color del QR: {QR_COLOR}")
        
    except FileNotFoundError:
        print(f"ERROR: No se encontró el archivo del logo en la ruta: {LOGO_PATH}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    generar_qr_con_padding_y_logo()