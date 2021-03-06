# file jsonp_wrap.py
# StackO 16134164
import json
from functools import wraps
from flask import redirect, request, current_app

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

# then in your view
#@default.route('/test', methods=['GET'])
#@support_jsonp
#def test():
 #return jsonify({"foo":"bar"})



