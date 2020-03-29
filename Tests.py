from hyper import HTTP20Connection
from hyper.contrib import HTTP20Adapter
from hyper import HTTPConnection
import requests
import hyper
import ssl

context = hyper.tls.init_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE
conn = HTTPConnection('localhost:8000', ssl_context=context)

#s = requests.Session()
#adapter = HTTP20Adapter()
#adapter.get_connection('localhost','8000',ssl_context=context)
#s.mount('https://', HTTP20Adapter())
#r = s.get('https://localhost:8000/auth/')

req=conn.request('GET','/auth')
#res= conn.get_response()
#print(r.status_code)
#print(r.url)

print(req)