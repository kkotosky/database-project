var operationDiv = $("#operation_selector");
var operationRadios = $("#operation_selector input[name='select_op']");
var tableSelectorDiv = $('#table_selector');
var tableRadios = $("#table_selector input[name='select_table']");
var ctgTable = $('#ctg_table');
var gameTable = $('#game_table');
var charTable = $('#char_table');
var consoleTable = $('#console_table');
var companyTable = $('#company_table');
var gtconTable = $('#gtcon_table');
var submitDiv = $('#submit_div');
var submitButton = $('#submit_div button');
var resetDiv = $('#submit_new');
var resetButton = $('#submit_new button');
var updateSubmit = $('#update_submit');
var requestSample = $('#request_update');
var requestOperation;
var requestTable;
var tableDib;
var textInputs = $('input[type="text"]');
var updateDeleteRequest = $('#get_single_data');
var connectorDiv = $('#provide_name');
var gameIdSearch = $('.game_id');
var charIdSearch = $('.character_id');
var conIdSearch = $('.console_id');
var comIdSearch = $('.company_id');
var exampleGameRows = {
  rows: [
  {name:"Legend Of Zelda",release_date:"1998", publisher:"nintendo",
    developer:"nintendo", rating:"10", game_id:"4"},
  {name:"Dark Souls",release_date:"2011", publisher:"From Software",
    developer:"From Software", rating:"11", game_id:"1"}
  ]
};
var exampleCtgRows = {
  rows: [{character_id:"2", game_id:"1"}, {character_id : "1", game_id:"2"},
       {character_id:"4", game_id:"3"}, {character_id : "3", game_id:"4"}]
};
var exampleCharRows = { 
  rows:
  [{character_id:"1",name:"Zelda", alias:"Sheik",
    description:"Princess", gender:"Female", first_game:"Legend of Zelda"}]
};
var exampleConsoleRow = {
  rows: [
  {console_id:"1", name:"Nintendo 64", abbreviation:"N64", description:"blah",
  number_sold:"1,000,000", owner_company:"Nintendo", release_date:"1996"}
  ]
};
var exampleCompanyRow = {rows:[
  {company_id:"1", name:"Nintendo", date_founded:"1990", address:"11 arch street",
    website:"www.nintendo.com", phone:"555-555-5555"}
]};
var exampleGTConRow = {rows:[
  {console_id:"1", game_id:"1"}
]};

var hideDivs = function(){
  ctgTable.hide();
  gameTable.hide();
  charTable.hide();
  consoleTable.hide();
  companyTable.hide();
  gtconTable.hide();
  submitDiv.hide();
  connectorDiv.hide();
  tableSelectorDiv.hide();
  $('#final_update_message').hide();
  $('#request_update').hide();
};
var getTableId = function(){
  if(requestTable === 'ctg') {
    return "ctg_id";
  } else if(requestTable === 'game') {
    return "game_id";
  } else if(requestTable === 'character') {
    return "character_id";
  } else if(requestTable === 'consoles') {
   return "console_id";
  } else if(requestTable === 'gtcon') {
   return "gtcon_id"; 
  } else if(requestTable === 'company') {
   return "company_id";
  }
};
var makeTextBoxRow = function(str, editable) {
  if (editable) {
    return "<input type='text' value='"+str+"''>"+ str + " </input>";
  } else {
    return str;
  }
};
var makeGameRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['game_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['release_date'] +"</td>" +
      "<td>"+ row['publisher'] +"</td>" +
      "<td>"+ row['developer'] +"</td>" +
      "<td>"+ row['rating'] +"</td></tr>");
};
var makeCtgRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['character_id'] +"</td>" +
      "<td>"+ row['game_id'] +"</td></tr>");
};
var makeCharRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['character_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['alias'] +"</td>" +
      "<td>"+ row['gender'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['first_game'] +"</td></tr>");
};
var makeConsoleRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['console_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['abbreviation'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['number_sold'] +"</td>" +
      "<td>"+ row['owner_company'] +"</td>"+
      "<td>"+ row['release_date'] +"</td></tr>");
};
var makeCompanyRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['company_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['date_founded'] +"</td>" +
      "<td>"+ row['address'] +"</td>" +
      "<td>"+ row['website'] +"</td>" +
      "<td>"+ row['phone'] +"</td></tr>");
};
var makeGTConRow = function(row, editable) {
    return $("<tr class='data_row'><td>"+ row['console_id'] +"</td>" +
      "<td>"+ row['game_id'] +"</td></tr>");
};
var fillGameTable = function(data, yes){
  $.each(data, function(k,rep){
    gameTable.find("table").append(makeGameRow(rep), yes);
  });
  gameTable.show();
};
var fillCtGTable = function(data, editable){
  $.each(data, function(k,rep){
    gtconTable.find("table").append(makeGTConRow(rep, editable));
  });
  ctgTable.show();
};
var fillCharTable = function(data, editable) {
  $.each(data, function(k,rep) {
    charTable.find("table").append(makeCharRow(rep, editable));
  });
  charTable.show();
};
var fillConsoleTable = function(data, editable) {
  $.each(data, function(k,rep) {
    consoleTable.find("table").append(makeConsoleRow(rep, editable));
  });
  consoleTable.show();
};
var fillCompanyTable = function(data, editable) {
  $.each(data, function(k,rep) {
    companyTable.find("table").append(makeCompanyRow(rep, editable));
  });
  companyTable.show();
};
var fillGtConTable = function(data, editable) {
  $.each(data, function(k,rep) {
    gtconTable.find("table").append(makeGTConRow(rep, editable));
  });
  gtconTable.show();
};
var getCompanyRowInOrder = function(row){
  var newDataFormat = [];
  newDataFormat.push(row['company_id']);
  newDataFormat.push(row['name']);
  newDataFormat.push(row['date_founded']);
  newDataFormat.push(row['address']);
  newDataFormat.push(row['website']);
  newDataFormat.push(row['phone']);
  return newDataFormat;
};
var getGameRowInOrder = function(row){
  var newDataFormat = [];
  newDataFormat.push(row['game_id']);
  newDataFormat.push(row['name']);
  newDataFormat.push(row['release_date']);
  newDataFormat.push(row['publisher']);
  newDataFormat.push(row['developer']);
  newDataFormat.push(row['rating']);
  return newDataFormat;
}
var getCharRowInOrder = function(row){
  var newDataFormat = [];
  newDataFormat.push(row['character_id']);
  newDataFormat.push(row['name']);
  newDataFormat.push(row['alias']);
  newDataFormat.push(row['gender']);
  newDataFormat.push(row['description']);
  newDataFormat.push(row['first_game']);
  return newDataFormat;
}
var getConsoleRowInOrder = function(row){
  var newDataFormat = [];
  newDataFormat.push(row['console_id']);
  newDataFormat.push(row['name']);
  newDataFormat.push(row['abbreviation']);
  newDataFormat.push(row['description']);
  newDataFormat.push(row['number_sold']);
  newDataFormat.push(row['owner_company']);
  newDataFormat.push(row['release_date']);
  return newDataFormat;
}
var delegateFillTable = function(data, editable){
  var val = requestTable;
  if(val === 'ctg') {
    fillCtGTable(data, editable); 
  } else if(val === 'game' || val === 'console_games' || val === 'char_games') {
    fillGameTable(data, editable);
  } else if(val === 'character' || val === 'games_characters') {
    fillCharTable(data, editable);
  } else if(val === 'consoles' || val === 'games_consoles') {
    fillConsoleTable(data, editable);
  } else if(val === 'gtcon') {
    fillGtConTable(data, editable);
  } else if(val === 'company') {
    fillCompanyTable(data, editable)
  }
}
var delegateFillInputTable = function(data, editable){
  var inputsToFill = tableDib.find('input[type="text"]');
  var count = 0
  var newDataFormat = [];
  console.log(data);
  if (requestTable === 'console'){
    newDataFormat = getConsoleRowInOrder(data);
  } else if (requestTable === 'characters') {
    newDataFormat = getCharRowInOrder(data);
  } else if (requestTable === 'game') {
    newDataFormat = getGameRowInOrder(data);
  } else {
    newDataFormat = getCompanyRowInOrder(data);
  }
  console.log(newDataFormat);
  $.each(inputsToFill, function(k,v){
    $(v).val(newDataFormat[count]);
    count++;
  });
};
var disabledTableRadios = function(classname){
  var radios = tableSelectorDiv.find(classname);
  $.each(radios, function(k,v){
    $(v).prop('disabled',true)
  });
};
var enableTableRadios = function(){
  var radios = tableSelectorDiv.find("input[type='radio']:disabled");
  $.each(radios, function(k,v){
    $(v).prop('disabled',false)
  });
};
var enabledDisabledIdField = function(val){
  gameIdSearch.prop('disabled', val);
  charIdSearch.prop('disabled', val);
  conIdSearch.prop('disabled', val);
  comIdSearch.prop('disabled', val);
};
operationRadios.change(function(evt){
  hideDivs();
  enableTableRadios();
  var activeTable = tableSelectorDiv.find('.active');
  activeTable.removeClass('.active');
  activeTable.prop('checked',false);
  var val = evt.currentTarget.value;
  $(evt.currentTarget).addClass('active');
  requestOperation = val;
  if(val === 'select') {
    tableSelectorDiv.show();
    disabledTableRadios('.select');
    enabledDisabledIdField(false);
  } else if(val === 'insert') {
    tableSelectorDiv.show();
    disabledTableRadios('.insert');
    enabledDisabledIdField(true);
  } else if(val === 'update') {
    tableSelectorDiv.show();
    disabledTableRadios('.update');
    enabledDisabledIdField(true);
  } else {
    tableSelectorDiv.show();
    disabledTableRadios('.delete');
    enabledDisabledIdField(true);
  }
  $('#begin_message').hide();
});
tableRadios.change(function(evt){
  hideDivs();
  tableSelectorDiv.show();
  var val = evt.currentTarget.value;
  $(evt.currentTarget).addClass('active');
  requestTable = val;
  if(val === 'ctg') {
    tableDib = ctgTable;
  } else if(val === 'game') {
    tableDib = gameTable;
  } else if(val === 'character') {
    tableDib = charTable;
  } else if(val === 'consoles') {
    tableDib = consoleTable;
  } else if(val === 'gtcon') {
    tableDib = gtconTable;
  } else if(val === 'company') {
    tableDib = companyTable;
  } else {
    tableDib = connectorDiv;
    if(val === 'games_consoles' || val === 'games_characters'){
      $('#games_message').show();
    } else if (val === 'console_games') {
      $('#console_message').show();
    } else {
      $('#character_message').show();
    }
  }
  if (requestOperation == 'select' || requestOperation == 'insert'){
    tableDib.show();
    tableDib.find("#update_insert").show();
    submitDiv.show();
  } else {
    requestSample.show();
  }
});
var submitSelectUsual = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.className, input.value]);
  });
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  $.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: JSON.stringify(values)},
    dataType:'json',
    contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    delegateFillTable(resp.rows, false);  
  }).fail(function(){});
}
var submitSelectConnections = function(){
  var connectorName = $('#connector_name').val();
  $.ajax({
    type:'GET',
    url:'/select/connections/'+requestTable+'/'+connector_name,
    dataType:'json',
    contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    delegateFillTable(resp.rows, false);
  }).fail(function(){});
};
var submitSelectRequest = function(){
  if (requestTable === 'games_characters' || requestTable === 'char_games' 
    || requestTable === 'console_games' || requestTable ==='games_consoles' ) {
    submitSelectConnections();
  } else {
    submitSelectUsual();
  }
};
var submitInsertRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.className, input.value]);
  });
  if (requestTable === 'gtcon' || requestTable === 'ctg') {
    submitInsertConnection(values);
  } else {
    submitInsertUsual(values);
  }
};
var submitInsertConnection= function(values){
  if (requestTable === 'gtcon') {
    $.ajax({
      type:'POST',
      url:'/insert/connect/gtcon/'+values[0][1]+'/'+values[1][1],
      dataType:'json',
      contentType: "application/json; charset=utf-8",
    }).success(function(resp){
      console.log("successful insert");
    }).fail(function(){
      console.log("insert failed");
    });
  } else {
    $.ajax({
      type:'POST',
      url:'/insert/connect/ctg/'+values[0][1]+'/'+values[1][1],
      dataType:'json',
      contentType: "application/json; charset=utf-8",
    }).success(function(resp){
      console.log("successful insert");
    }).fail(function(){
      console.log("insert failed");
    });
  }
}
var submitInsertUsual = function(values){
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  $.ajax({
    type:'POST',
    url:'/insert/'+requestTable,
    dataType:'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(values),
  }).success(function(resp){
    console.log("successful insert");
  }).fail(function(){
    console.log("insert failed");
  });
};
var submitGetUpdateRequest = function(){
  var name = $('#update_delete_id').val();
  values = [["name",name]];
  $.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: JSON.stringify(values)},
    dataType:'json',
    contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    delegateFillInputTable(resp.rows[0]);
    requestSample.hide();
    tableDib.show();
    tableDib.find('#update_insert').show();
    $('#update_delete_id').val('');
    $('#final_update_message').show();
    submitDiv.show();
  }).fail(function(){});
};
var submitFinalUpdateRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.className, input.value]);
  });
  var id = values[0][1];
  values = values.splice(1);
  $.ajax({
    type:'POST',
    url:'/update/'+requestTable+'/'+id,
    data: {values: JSON.stringify(values)},
    dataType:'json',
    contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    console.log("success");
  }).fail(function(){});
};
var submitGetDeleteRequest = function(){
  deleteId = -1;
  var name = $('#update_delete_id').val();
  values = [["name",name]];
  console.log(values);
  $.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: JSON.stringify(values)},
    dataType:'json',
    contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    delegateFillTable(resp.rows, false);  
    deleteId = resp.rows[0][getTableId()];
    requestSample.hide();
    tableDib.show();
    $('#update_delete_id').val('');
    $('#final_delete_message').show();
    submitDiv.show();
  }).fail(function(){});
};
var deleteGame = function(){
  $.ajax({
      type:'POST',
      url:'/bulkdelete/gtcon/'+getTableId()+'/'+deleteId,
      dataType:'json',
      contentType: "application/json; charset=utf-8",
  }).success(function(resp){
    $.ajax({
        type:'POST',
        url:'/bulkdelete/ctg/'+ getTableId()+'/'+deleteId,
        dataType:'json',
        contentType: "application/json; charset=utf-8",
    }).success(function(){
      $.ajax({
          type:'POST',
          url:'/delete/'+requestTable+'/'+deleteId,
          dataType:'json',
          contentType: "application/json; charset=utf-8",
      }).success(function(){
        console.log('successful delete');
      }).fail(function(){
        console.log('delete Failed');
      });
    }).fail(function(){
      console.log('delete Failed');
    }); 
  }).fail(function(){
    console.log('delete Failed');
  });
};
var deleteCharacter = function(){
  $.ajax({
      type:'POST',
      url:'/bulkdelete/ctg/'+ getTableId()+'/'+deleteId,
      dataType:'json',
      contentType: "application/json; charset=utf-8",
  }).success(function(){
    $.ajax({
        type:'POST',
        url:'/delete/'+requestTable+'/'+deleteId,
        dataType:'json',
        contentType: "application/json; charset=utf-8",
    }).success(function(){
      console.log('successful delete');
    }).fail(function(){
      console.log('delete Failed');
    });
  }).fail(function(){
    console.log('delete Failed');
  });
};
var deleteConsole = function(){
  $.ajax({
      type:'POST',
      url:'/bulkdelete/gtcon/'+ getTableId()+'/'+deleteId,
      dataType:'json',
      contentType: "application/json; charset=utf-8",
  }).success(function(){
    $.ajax({
        type:'POST',
        url:'/delete/'+requestTable+'/'+deleteId,
        dataType:'json',
        contentType: "application/json; charset=utf-8",
    }).success(function(){
      console.log('successful delete');
    }).fail(function(){
      console.log('delete Failed');
    });
  }).fail(function(){
    console.log('delete Failed');
  }); 
};
var deleteCompany = function(){
  $.ajax({
      type:'POST',
      url:'/delete/'+requestTable+'/'+deleteId,
      dataType:'json',
      contentType: "application/json; charset=utf-8",
  }).success(function(){
    console.log('successful delete');
  }).fail(function(){
    console.log('delete Failed');
  }); 
};
var submitFinalDeleteRequest = function() {
  if (deleteId) {
    if (requestTable === 'games'){
      deleteGame();
    } else if (requestTable === 'character') {
    deleteCharacter();
    } else if (requestTable === 'consoles') {
        deleteConsole();
    } else {
      deleteCompany();
    }
  } else {
    console.log('there was nothing to delete');
  }
};
$('#get_single_data').click(function(){
  if (requestOperation === 'update'){
    submitGetUpdateRequest();
  } else {
    submitGetDeleteRequest();
  }
});
submitButton.click(function(){
  if (requestOperation === 'select') {
    submitSelectRequest();
  } else if (requestOperation === 'insert') {
    submitInsertRequest();
  } else if (requestOperation === 'update') {
    submitFinalUpdateRequest();
  } else if (requestOperation === 'delete') {
    submitFinalDeleteRequest();
  }
});
var clearTables = function(){
  var filledRows = $('.data_row');
  $.each(filledRows, function(k,v){
    v.remove();
  });
};
var clearInputs = function(){
  $.each(textInputs, function(k,v){
    $(v).val('');

  });
};
resetButton.click(function(){
  var activeOp = operationDiv.find('.active');
  var activeTable = tableSelectorDiv.find('.active');
  activeOp.removeClass('.active');
  activeTable.removeClass('.active');
  activeTable.prop('checked',false);
  activeOp.prop('checked', false);
  $('#begin_message').hide();
  hideDivs();
  clearTables();
  clearInputs();
});