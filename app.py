# -*- coding: utf8 -*-

import cherrypy
import json
import data
import simplejson
import sys

class Root(object):    
    @cherrypy.expose
    def killProcess(self):        
        try:
            cl = cherrypy.request.headers['Content-Length']
            rawbody = cherrypy.request.body.read(int(cl))
            body = simplejson.loads(rawbody)  
            dt = data.DataObjs()
            dt.killProcess(str(body))
            return 'Processo ' + str(body) + ' terminado com sucesso ! ' 
        except:
            e = sys.exc_info()[0]
            return e                              
      
        
    @cherrypy.expose
    def index(self):   
        pag = open('script/index.html').read()
        script1 = open('script/jquery.min.js')
        script2 = open('script/pagescript.js')
        style   = open('style/pagestyle.css')
        pag = pag.replace('%script1%', script1.read())
        pag = pag.replace('%script2%', script2.read())
        pag = pag.replace('%style%', style.read())
        return pag  
    
    @cherrypy.expose
    def getActives(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        do = data.DataObjs()
        return json.dumps(do.activesToJson()) 
    
    @cherrypy.expose
    def getStatus(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        do = data.DataObjs()
        return json.dumps(do.statusToJson())
     
    @cherrypy.expose
    def getMemory(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        do = data.DataObjs()        
        return json.dumps(do.memoryToJson())
   
cherrypy.config.update({'server.socket_host': '127.0.0.1','server.socket_port': 666}) 
cherrypy.quickstart(Root())
