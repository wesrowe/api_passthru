import os
from flask import Flask,request
from urlparse import urlparse
import requests
import demjson
# GET URLLIB for URL WORK?
app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"

@app.route("/api/<api_path>")
def dataPassthru(api_path):
	query = request.query_string
	edm_qry = "http://api.edmunds.com/v1/api/vehicle/stylerepository/" + api_path + '?' + query + '&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json'
#http://api.edmunds.com/v1/api/vehicle/stylerepository/findstylesbymakemodelyear?make=honda&model=accord&year=2003&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json
	try:
		edResponse = requests.get(edm_qry)
	except requests.ConnectionError:
		return "Connection Error"
	styleObj = edResponse.text
	style_dict = demjson.decode(styleObj)
	#print style_dict
	#return style_dict.styleHolder[0].modelName
	return styleObj # this returns api string in its entirety, successfully.
	# return json.load(styleObj) # doesn't work, somehow I figured out before it's choking on non-"" strings like null and false.


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
