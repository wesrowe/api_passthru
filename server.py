# -*- coding: UTF-8  -*-
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
	print "received the api string"
	styleObj = edResponse.text
	style_dict = demjson.decode(styleObj)
	print "done with decoding json to dict"
	#print style_dict # prints to terminal
	return style_dict.styleHolder[0]["modelName"]
	#return styleObj # this returns api string in its entirety, successfully.

# sample destination: var http://www.edmunds.com/api/vehicle/style/100003100?fmt=full_json	
@app.route("/fullstyleapi/<styleID_to_get>")
def dataPassthru(styleID_to_get):
	#query = request.query_string
	edm_qry = 'http://www.edmunds.com/api/vehicle/style/' + styleID_to_get + '?fmt=full_json'
	try:
		edResponse = requests.get(edm_qry)
	except requests.ConnectionError:
		return "Connection Error"
	print "received the api string"
	styleObj = edResponse.text
	style_dict = demjson.decode(styleObj)
	#print "done with decoding json to dict"
	#print style_dict # prints to terminal
	#return style_dict.styleHolder[0]["modelName"] # returns just model name
	return styleObj # this returns api string in its entirety, successfully.


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
