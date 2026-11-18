# usb_bridge.py

import serial
import serial.tools.list_ports
import time
import csv



def find_port():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if "usbmodem" in p.device.lower() or "SDA" in p.device:
            return p.device
    return None

def log_data(event_type, count):
    ts = time.strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{ts}] {event_type} | Current Occupancy: {count}")
    with open('occupancy_log.csv', 'a', newline='') as f:
        csv.writer(f).writerow([ts, event_type, count])

def connect():
    while True:
        port = find_port()
        if port:
            try:
                ser = serial.Serial(port, 115200, timeout=1)
                print(f"Connected to FRDM-KL46Z on {port}...")
                return ser
            except Exception as e:
                print(f"Failed to open {port}: {e}")
        else:
            print("Board not found, retrying in 2s...")
        time.sleep(2)

ser = connect()

while True:
    try:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if ":" in line:
                parts = line.split(":")
                if len(parts) == 2:
                    log_data(parts[0].strip(), parts[1].strip())
    except serial.SerialException:
        print("Board disconnected. Reconnecting...")
        try:
            ser.close()
        except:
            pass
        time.sleep(2)
        ser = connect()
