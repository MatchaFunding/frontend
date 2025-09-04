import qrcode
from PIL import Image

def generar_qr(url, color_qr="#69816E", color_fondo="white", nombre_archivo="qr.png"):
    """
    Genera un código QR para la URL dada, con colores personalizables.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=color_qr, back_color=color_fondo)
    img.save(nombre_archivo)
    print(f"QR guardado como {nombre_archivo}")

# Ejemplo de uso:
generar_qr("https://www.instagram.com/matchafunding/", color_qr="white", color_fondo="#919c2b")