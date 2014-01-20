function makeAjax(success,data,method){	
	 $.ajax({
	      type: 'POST',
	      url: "http://127.0.0.1:777/" + method,
	      contentType: "application/json",
	      processData: false,	
	      data:data,
	      success: success,
	      error: function(request,error) 
	      		 {
	    	  		console.log(arguments);
	    	  		alert ( " Can't do because: " + error );
	      		 }
	    });
}

google.load("visualization", "1", {packages:["corechart"]});
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(loadAllCharts);

function loadAllCharts()
{
	makeAjax(function(data) { drawChart(data); },{},'getStatus');
	makeAjax(function(data) { drawChartGauge(data); },{},'getMemory');
	
}


function drawChart(j) {
	var data = google.visualization.arrayToDataTable([
	                                                  ['Status', 'Total'],
	                                                  ['Correndo', j[0].Correndo],
	                                                  ['Esperando', j[0].Suspensos]
	                                                ]);
    var options = {
    		title: 'Status das Tarefas',
    		pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('chartStatus'));
    chart.draw(data, options);
}


function drawChartGauge(j) {
	 var data = google.visualization.arrayToDataTable([
       ['Label', 'Value'],
       ['Memoria', Math.round(j.Memoria)]       
     ]);

     var options = {    		 
       width: 200, height: 200,
       redFrom: 1200, redTo: 1638,
       yellowFrom:800, yellowTo: 1199,
       minorTicks: 4,
       max : 1638
     };

     var chart = new google.visualization.Gauge(document.getElementById('chartGauge'));
     chart.draw(data, options);
     }

function killProcess(id){		
	var crm = confirm("Deseja realmente terminar o processo ? ");	
	if (crm == true) {
		makeAjax(
				function(res) { 
					alert(res);
					setTimeout(null,1000);
					window.location.reload();
				}
				, 
				id, 'killProcess');
	}
}

$(function(){
	
	makeAjax(
	   function(data)
	   { 
		    var tableStr = '<table class="minhatabela" cellpadding="3"> ';
		    tableStr += '<tr style="background-color:#F8F8FF">';
		    tableStr += '<td> Tempo  </td>';
		    tableStr += '<td> Session Id </td>';
		    tableStr += '<td> Login </td>';
		    tableStr += '<td> Wait Info </td>';
		    tableStr += '<td> CPU </td>';
		    tableStr += '<td> Leituras </td>';
		    tableStr += '<td> Escritas </td>';
		    tableStr += '<td> Memoria </td>';
		    tableStr += '<td> Status  </td>';
		    tableStr += '<td> Host</td>';
		    tableStr += '<td> Db Nome </td>';
		    tableStr += '<td> Programa</td>';		    
		    tableStr += '</tr>';
		    
		    for (var i = 0; i < data.length; i++) {	
		    	
		    	var color = "";
		    	
		    	if (i % 2 == 0)		    	
		    		color = '#B0E2FF';
		    	else 
		    		color = '#E0FFFF';
		    	
			    tableStr += '<tr style="background-color:'+ color +'">';
			    tableStr += '<td> ' + data[i].execucao  + '</td>';
			    tableStr += '<td> <a href="#" onclick="killProcess(' + data[i].session_id + ');">' + data[i].session_id + '</a></td>';
			    tableStr += '<td> ' +data[i].login_name + '</td>';
			    tableStr += '<td> ' +data[i].wait_info + '</td>';
			    tableStr += '<td> ' +data[i].cpu + '</td>';
			    tableStr += '<td> ' +data[i].reads + '</td>';
			    tableStr += '<td> ' +data[i].writes + '</td>';
			    tableStr += '<td> ' +data[i].used_memory + '</td>';
			    tableStr += '<td> ' +data[i].status + ' </td>';
			    tableStr += '<td> ' +data[i].host_name + '</td>';
			    tableStr += '<td> ' +data[i].db_name + ' </td>';
			    tableStr += '<td> ' +data[i].program + '</td>';		    
			    tableStr += '</tr>';
			}
		    tableStr += ' </table>';		    
		    $('#tableContent').html(tableStr);
		    
	   },null,'getActives')	
});