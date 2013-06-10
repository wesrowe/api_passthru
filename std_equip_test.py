# 6/10 pulled this code out of server.py so it could be run and tested alone or in the python interpreter
import json
import demjson

styleString = open('X3_full_json_data.py').read()

style_dict = demjson.decode(styleString)
#return style_dict["styleHolder"][0]["modelName"] # returns just model name

keys_as_is = { 'trim', 'niceName', 'makeName', 'year', 'id', 'modelName', 'engineCylinder', 'price', 'makeNiceName', 'engineSize', 'name', 'modelNiceName', 'publicationState' }
new_style_dict = {}
new_style_dict["styleHolder"] = []
new_style_dict["styleHolder"].append( {} )
for key in keys_as_is:
	print key
	new_style_dict["styleHolder"][0][key] = style_dict["styleHolder"][0][key]

# set up deeper structure
new_style_dict["styleHolder"][0]["attributeGroups"] = {}
new_style_dict["styleHolder"][0]["standardEquipment"] = []

# attributeGroups
attgrp_keepers = ["INTERIOR_DIMENSIONS","CARGO_DIMENSIONS","SPECIFICATIONS","EXTERIOR_DIMENSIONS","CRASH_TEST_RATINGS","PRICING"]
for akey in attgrp_keepers:
	new_style_dict["styleHolder"][0]["attributeGroups"][akey] = style_dict["styleHolder"][0]["attributeGroups"][akey]
	new_style_dict

# standardEquipment
stdequip_keepers = ["ENGINE"]
for edm_equip_dict in style_dict["styleHolder"][0]["standardEquipment"]:
	
	for key in stdequip_keepers:
		if key == edm_equip_dict["equipmentClass"]:    # we found it boss
			new_style_dict["styleHolder"][0]["standardEquipment"].append( edm_equip_dict )
			stdequip_keepers.pop( stdequip_keepers.index(key) ) # don't bother looking for it again
			break
	
	if len(stdequip_keepers) == 0: # ran out of stdEquip objects to find
		break #breaks out of biggest loop 

print new_style_dict


