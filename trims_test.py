# 6/10 pulled this code out of server.py so it could be run and tested alone or in the python interpreter
import json
import demjson

styleString = open('trims_packet_ex.txt').read()

style_dict = demjson.decode(styleString)

# keys I need here are just  name and price... but maybe keep others around for in-case?  Hell no.
keys_as_is = { 'price', 'name' }
new_style_dict = {}
new_style_dict["styleHolder"] = []

for style in style_dict["styleHolder"]: # array of dicts, style is a dict
	temp_dict = {}
	for key in keys_as_is:
		temp_dict[key] = style[key]
	new_style_dict["styleHolder"].append( temp_dict )

print new_style_dict


