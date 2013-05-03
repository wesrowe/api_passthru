# -*- coding: unicode  -*-
import demjson
import urllib2
json_obj='{"styleHolder":[{"id":200434888,"makeId":200001444,"year":2013,"makeName":"Honda","makeNiceName":"honda","modelId":"Honda_Accord","modelName":"Accord","modelNiceName":"accord","modelYearId":100537293,"transmissionType":"AUTOMATIC","engineCompressorType":"NA","engineFuelType":"regularunleaded","engineCylinder":4,"engineSize":2.4,"price":{"baseMSRP":25875,"baseInvoice":23676,"deliveryCharges":790,"tmv":24505,"usedTmvRetail":null,"usedPrivateParty":null,"usedTradeIn":null,"estimateTmv":false,"tmvRecommendedRating":null}}]}'        
d = demjson.decode(json_obj,False) # 
