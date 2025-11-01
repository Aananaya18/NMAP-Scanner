#request: to get data from frontend
#jsonify: format our response as JSON
#subprocess: to securely run command line programs


from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS
import subprocess
import re
import traceback
#Creating a webserver named as app and configure CORS
app = Flask(__name__)

CORS(app)

#creating a route to serve the nmap.html file

@app.route('/')
def home():
    return render_template('NMAP.html')


#@app.route() => decorator it tells flask to open /api/scan url when POST request comes

@app.route('/api/scan', methods = ['POST'])

# IP sent from frontend to server then this method will run
def scan_ip():
    try:
        #get IP address and then validate it by using json data
        data = request.get_json()
        ip_address = data.get('ip')

        ipv4_regex  = r"^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$"
        if not ip_address or not re.match(ipv4_regex, ip_address):
            return jsonify({"success": False, "error": "Invalid IP Address format"}), 400
        
        command = ['nmap', '-sS', '-sV', '-sC', '-O', '-T4', ip_address]
        result = subprocess.run(command, capture_output=True, text=True, check=True)

        nmap_output = result.stdout

        return jsonify({"success": True, "output": nmap_output})
    except subprocess.CalledProcessError as e:
        #this part will run if Nmap itself has an error while scanning

        return jsonify({"success": False, "error": f"NMAP Command failed: {e.stderr}"}), 500
    
    # this catches any other unexpected error
    except FileNotFoundError:
        return jsonify({"success" : False, "error":f"An internal server error occured"}), 500
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)


