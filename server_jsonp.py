# -*- coding: UTF-8  -*-
import os
from flask import Flask,request
from urlparse import urlparse
import requests
import demjson
#import jsonp_wrap
#import cors_wrap

import json
from functools import wraps
from flask import redirect, request, current_app

app = Flask(__name__)

def support_jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

#@default.route('/test', methods=['GET'])
#@support_jsonp
#def test():
    #return jsonify({"foo":"bar"})

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/api/<api_path>")
def genericPassthru(api_path):
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
	print style_dict["styleHolder"][0]["modelName"] # prints to terminal
	return style_dict["styleHolder"][0]["modelName"]
	return styleObj # this returns api string in its entirety, successfully.

# sample destination: var http://www.edmunds.com/api/vehicle/style/100003100?fmt=full_json	
@app.route("/fullstyleapi/<styleID_to_get>") #, methods=['GET'])
#@support_jsonp
@crossdomain(origin='*')
def fullStylePassthru(styleID_to_get):
	#query = request.query_string
	edm_qry = 'http://www.edmunds.com/api/vehicle/style/' + styleID_to_get + '?fmt=full_json'
	try:
		edResponse = requests.get(edm_qry)
	except requests.ConnectionError:
		return "Connection Error"
	print edm_qry
	styleString = edResponse.text
	style_dict = demjson.decode(styleString)
	#print "done with decoding json to dict"
	#print style_dict # prints to terminal
	#return style_dict["styleHolder"][0]["modelName"] # returns just model name
	return styleString # this returns api string in its entirety, successfully.


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
