import cv2
from pyzbar.pyzbar import decode

def scan_qr(image_path):
    img = cv2.imread(image_path)

    if img is None:
        return {"status": "fake", "reason": "Invalid image"}

    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(img)

    if bbox is None:
        return {"status": "fake", "reason": "No QR detected"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.Laplacian(gray, cv2.CV_64F).var()

    if blur < 100:
        return {"status": "fake", "reason": "Blurry QR"}

    qr_codes = decode(img)

    if not qr_codes:
        return {"status": "fake", "reason": "QR not readable"}

    decoded_data = qr_codes[0].data.decode('utf-8')

    return {"status": "ok", "data": decoded_data}