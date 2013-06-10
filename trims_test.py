# 6/10 pulled this code out of server.py so it could be run and tested alone or in the python interpreter
import json
import demjson

styleString = open('trims_packet_ex.txt').read()

style_dict = demjson.decode(styleString)

# keys I need here are just  name and price... but maybe keep others around for in-case?  Hell no.
keys_as_is = { 'price', 'name' }
new_style_dict = {}
new_style_dict["styleHolder"] = []
new_style_dict["styleHolder"].append( {} )
for key in keys_as_is:
	print key
	new_style_dict["styleHolder"][0][key] = style_dict["styleHolder"][0][key]


print new_style_dict


