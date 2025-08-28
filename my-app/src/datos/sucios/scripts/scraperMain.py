import sys

from scrapers import scraperANID, scraperCORFO, scraperFONDOSGOB

def main():
    #scraperANID.buscar_en_anid()
    #scraperCORFO.buscar_en_corfo()
    scraperFONDOSGOB.buscar_en_fondosgob()
    
if __name__ == "__main__":
    main()
    sys.exit(0)