def create_response(status:str, data:dict=None, error:str=None):
    '''
    creates a dict response using the jsend Format
    
    Args:
        status    (string) : is the response a "success" or "fail" or "error".
        data    (dict)   : data to send (optional).
        error   (string) : error message (optional).
    '''
    if status == 'success' or status == 'fail':
        return {
            'status' : status,
            'data' : data
        }

    elif status == 'error':
        return {
            'status' : "error",
            'message' : error
        }

    else:
        return {
            'status' : status,
            'data' : data,
            'message' : error
        }
