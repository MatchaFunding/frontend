from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.firefox import GeckoDriverManager
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) # Sube hasta sucios
DIR_DATA = os.path.join(BASE_DIR, "csvs", "historico-corfo-raw.csv")
DIR_RESULTADOS = os.path.join(BASE_DIR, "csvs", "boletaofactura_resultados.csv")

def clean_rut(rut):
    return re.sub(r'\D', '', rut)

def init_driver():
    options = webdriver.FirefoxOptions()
    options.add_argument("--headless")  
    return webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)

def parse_boletaofactura(rut, driver):
    url = "https://www.boletaofactura.com/"
    driver.get(url)
    wait = WebDriverWait(driver, 10)

    # Click en pestaña "RUT"
    boton_rut = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='#rut']")))
    boton_rut.click()

    # Esperar a que el input esté visible
    campo_rut = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "#rut input[name='term']")))
    campo_rut.clear()
    campo_rut.send_keys(rut)
    campo_rut.submit()
    time.sleep(2)  # esperar carga de la tabla

    # Obtener HTML de la página renderizada
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # Buscar la fila de resultados
    fila = soup.select_one("tbody > tr")
    if not fila:
        return {"RUT": rut, "Error": "Sin resultados"}

    celdas = fila.find_all("td")
    if len(celdas) < 4:
        return {"RUT": rut, "Error": "Menos de 4 columnas"}

    return {
        "RUT": rut,
        "RazonSocial": celdas[0].get_text(strip=True),
        "TipoSubtipo": celdas[1].get_text(separator=" ", strip=True),
        "Actividades": celdas[2].get_text(separator=" ", strip=True),
        "RutConfirmado": celdas[3].get_text(strip=True)
    }

def main():
    df = pd.read_csv(DIR_DATA, quotechar='"')
    ruts = df["rut_beneficiario"].dropna().astype(str).apply(clean_rut)
    ruts_unicos = sorted(set(ruts.tolist()))

    driver = init_driver()
    resultados = []
    
    for i, rut in enumerate(ruts_unicos[1:500], 1): # Comprueba los primeros 500 RUT
        print(f"[{i}/{len(ruts_unicos)}] Consultando: {rut}")
        try:
            data = parse_boletaofactura(rut, driver)
        except Exception as e:
            data = {"RUT": rut, "Error": str(e)}
        resultados.append(data)

    driver.quit()
    pd.DataFrame(resultados).to_csv(DIR_RESULTADOS, index=False)
    print("Datos guardados en boletaofactura_resultados.csv")

if __name__ == "__main__":
    main()
