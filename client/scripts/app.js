$(function() {

'use strict';

    var params = {
      // Specify your subscription key
      'api_key': 'abcde', // This is obviously a bad key :)
    };

    $("#GoButton").click(function(){
      $("table#Arrivals tr#data").remove();
      var station = $("#SelectStation").val();
      var multiple = ["E06", "B06", "F01", "B01",
                      "A01", "C01", "D03", "F03"];
      var station_secondary;
      var train_info = [];
      var trains_at_station = [];

      if (multiple.indexOf(station) > -1){
        if(station == "E06"){ station_secondary = "B06"; }
        if(station == "B06"){ station_secondary = "E06"; }
        if(station == "F01"){ station_secondary = "B01"; }
        if(station == "B01"){ station_secondary = "F01"; }
        if(station == "A01"){ station_secondary = "C01"; }
        if(station == "C01"){ station_secondary = "A01"; }
        if(station == "D03"){ station_secondary = "F03"; }
        if(station == "F03"){ station_secondary = "D03"; }

      }

      $.ajax({
        url: "https://api.wmata.com/StationPrediction.svc/GetPrediction/All?" + $.param(params),
        dataType: "xml",
        type: 'GET',
      })

      .success(function(data){
        $(data).find("AIMPredictionTrainInfo").each(function(){
          if(($(this).find("LocationCode").text() == station) ||
            ($(this).find("LocationCode").text() == station_secondary)){

            train_info.push($(this).find("Line").text());
            train_info.push($(this).find("Car").text());
            train_info.push($(this).find("DestinationName").text());
            train_info.push($(this).find("Min").text());

            trains_at_station.push(train_info);
            train_info = [];

          }
          trains_at_station.sort(function(a, b){
            if(a[0] < b[0]) return -1;
            if(a[0] > b[0]) return 1;
            return 0;
          });
        });
        var input;
        for (var i = 0; i < trains_at_station.length; i++){
          input = $("<tr id='data'><td>"+trains_at_station[i][0]+"</td>");
          input.append("<td>"+trains_at_station[i][1]+"</td>");
          input.append("<td>"+trains_at_station[i][2]+"</td>");
          input.append("<td>"+trains_at_station[i][3]+"</td></tr>");
          $("#Arrivals").append(input);
          input = "";
          if(i != trains_at_station.length-1){
            if(trains_at_station[i][0] != trains_at_station[i+1][0]){
              input = $("<tr id='data'><td></br></td>");
              input.append("<td></br></td>");
              input.append("<td></br></td>");
              input.append("<td></br></td></tr>");
              $("#Arrivals").append(input);
              input = "";
            }
          }
        }

      })
      .fail(function() {
        alert("error");
      });
    });

    $.ajax({
      url: "https://api.wmata.com/Rail.svc/Stations?" + $.param(params),
      dataType: "xml",
      type: 'GET',
    })

    .success(function(data) {
      var options = $("#SelectStation");
      var list_names = [];
      var stations = [];
      $(data).find("Station").each(function(){
        var station_name = $(this).find("Name").text();
        var station_code = $(this).find("Code").text();
        stations.push(station_name);
        stations.push(station_code);

        list_names.push(stations);
        stations = [];
      });

      list_names.sort(function(a, b){
        if(a[0] < b[0]) return -1;
        if(a[0] > b[0]) return 1;
        return 0;
      });

      for(var i = 0; i < list_names.length; i++){
        var pass = true;
        for(var j = 0; j < i; j++){
          if(list_names[j][0] == list_names[i][0]){
            pass = false;
          }
        }
        if(Boolean(pass)){
          var sel = $("<option value="+list_names[i][1]+">");
          sel.append(list_names[i][0]);
          sel.append("</option>");
          $("#SelectStation").append(sel);
        }
      }
    })

    .fail(function() {
      alert("error");
    });
  });
