# -*- coding: latin1 -*-

import pyodbc

class DataObjs(object):
    
    """ Executa um codigo t-sql dentro do SQL Server """
    def _mssqlExec(self,sql,autocommit):
        conn = pyodbc.connect('DRIVER={SQL Server};SERVER=BMPWSQL24;DATABASE=master;Trusted_Connection=yes')
        conn.autocommit = autocommit
        cur = conn.cursor()
        return cur.execute("EXEC master.dbo.sp_WhoIsActive")
    
    """ Retorna o resultado da procedure dos processos ativos """    
    def _getWhoIsActiveResult(self):
        cur = self._mssqlExec("EXEC master.dbo.sp_WhoIsActive",False)
        rows = cur.fetchall()
        return rows 
        
    """ Mata um processo dentro do Sql Server """
    def killProcess(self, idSession):       
        conn = pyodbc.connect('DRIVER={SQL Server};SERVER=BMPWSQL24;DATABASE=master;Trusted_Connection=yes')
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("Kill " + idSession)          
    
    
    def memoryToJson(self):
        rows = self._getWhoIsActiveResult()
        mem = []
        for i in rows:
            mem.append(float(i.used_memory.replace(',','.')))
        return {'Memoria' : sum(mem)}
           
    
    
    """ Retorna o status da sessão """
    
    def statusToJson(self):
        Suspensos = 0
        Correndo = 0
        rows = self._getWhoIsActiveResult()
        for i in rows:
            if i.status == 'suspended':
                Suspensos += 1
            elif i.status == 'runnable':
                Correndo += 1
        dataReturn = []
        dataReturn.append({'Suspensos' : Suspensos, 'Correndo' : Correndo} )
        return dataReturn      
          

    """ Converte o resultado do cursor em um Json """
    def activesToJson(self):
        rows = self._getWhoIsActiveResult() 
        dataReturn = []                  
        for i in rows:
            dataReturn.append({ 
                                'execucao' :  str(i[0]) ,        'session_id' : str(i[1]),  'login_name' : str(i[3])  , 'wait_info'  : str(i[4]), 
                                'cpu'      :  str(i[5]).strip(), 'reads'      : str(i[9]),  'writes'     : str(i[10]) , 'used_memory': str(i[12]),
                                'status'   :  i[13],             'host_name'  : i[16],      'db_name'    : i[17]      , 'program'    : i[18]                                 
                             })
        return dataReturn




