def create_response(type:str, data:dict=None, error:str=None):
    '''
    creates a dict response using the jsend Format
    
    Args:
        type    (string) : is the response a "success" or "fail" or "error".
        data    (dict)   : data to send (optional).
        error   (string) : error message (optional).
    '''
    if type == 'success' or type == 'fail':
        return {
            'status' : type,
            'data' : data
        }

    elif type == 'error':
        return {
            'status' : "error",
            'message' : error
        }

    else:
        return {
            'status' : type,
            'data' : data,
            'message' : error
        }
