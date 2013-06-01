# -*- coding: UTF-8  -*-
import os
from flask import Flask,request
from urlparse import urlparse
import requests
import demjson
#import jsonp_wrap
#import cors_wrap

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


app = Flask(__name__)

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

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
