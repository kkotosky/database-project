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
var exampleGameRows = {
  rows: [
  {name:"Legend Of Zelda",release_date:"1998", publisher:"nintendo",
    developer:"nintendo", rating:"10", game_id:"4"},
  {name:"Dark Souls",release_date:"2011", publisher:"From Software",
    developer:"From Software", rating:"11", game_id:"1"}
  ]
};
var exampleCtgRows = {
  rows: [{character_id:"2", game_id:"1"}, {character_id : "1", game_id:"2"}]
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
};
var fillCtGTable = function(data, editable){
  $.each(data, function(k,rep){
    gtconTable.find("table").append(makeGTConRow(rep, editable));
  });
};
var fillCharTable = function(data, editable) {
  $.each(data, function(k,rep) {
    charTable.find("table").append(makeCharRow(rep, editable));
  });
};
var fillConsoleTable = function(data, editable) {
  $.each(data, function(k,rep) {
    consoleTable.find("table").append(makeConsoleRow(rep, editable));
  });
};
var fillCompanyTable = function(data, editable) {
  $.each(data, function(k,rep) {
    companyTable.find("table").append(makeCompanyRow(rep, editable));
  });
};
var fillGtConTable = function(data, editable) {
  $.each(data, function(k,rep) {
    gtconTable.find("table").append(makeGTConRow(rep, editable));
  });
};
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
  $.each(data, function(k,v){
    newDataFormat.push(v);
  });
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
	} else if(val === 'insert') {
		tableSelectorDiv.show();
    disabledTableRadios('.insert');
	} else if(val === 'update') {
		tableSelectorDiv.show();
    disabledTableRadios('.update');
	} else {
		tableSelectorDiv.show();
    disabledTableRadios('.delete');
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
    values.push([input.attributes[0].nodeValue, input.value]);
  });
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  //MAKE AJAX REQUEST TO /select/requestTable using
  // {values: values}
  delegateFillTable(exampleGameRows.rows, false);
}
var submitSelectConnections = function(){
  var connectorName = $('#connector_name').val();
  //MAKE AJAX REQUEST HERE TO /select/connections/table
  //using {values:{name: connectorName}}
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
    values.push([input.attributes[0].nodeValue, input.value]);
  });
  if (requestTable === 'gtcon' || requestTable === 'ctg') {
    submitRequestConnection(values);
  } else {
    submitInsertUsual();
  }
};
var submitRequestConnection= function(values){
  if (requestTable === 'gtcon') {
    //MAKE AJAX CALL TO /insert/connect/gtcon 
    // {console_name: values[0][1], game_name : values[1][1]}
    //will handle manipulating data on puthon side endpoint
  } else {
    //MAKE AJAX CALL TO /insert/connect/ctg 
    // {character_name: values[0][1], game_name : values[1][1]}
    //will handle manipulating data on python side endpoint
  }
}
var submitInsertUsual = function(values){
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  /*$.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: values},
    dataType:'json'
  }).done(function(resp){*/
    submitDiv.hide();
  //});
}
var submitGetUpdateRequest = function(){
  var name = $('#update_delete_id').val();
  values = [["name",name]];
  //make SELECT AJAX REQUEST TO /select/requestTable using values
  //GET RESPONSE OF ROW
  delegateFillInputTable(exampleCompanyRow.rows[0]);
  requestSample.hide();
  tableDib.show();
  tableDib.find('#update_insert').show();
  $('#update_delete_id').val('');
  $('#final_update_message').show();
  submitDiv.show();
};
var submitFinalUpdateRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.attributes[0].nodeValue, input.value]);
  });
  var id = values[0][1];
  values = values.splice(1);
  //SUBMIT AJAX REUQEST TO /update/requestTable/id
};
var deleteId = -1;
var sunmitGetDeleteRequest = function(){
  deleteId = -1;
  var name = $('#update_delete_id').val();
  values = [["name",name]];
  //make SELECT AJAX REQUEST TO /select/requestTable using values
  //GET RESPONSE OF ROW
  delegateFillTable(exampleCompanyRow.rows);
  requestSample.hide();
  tableDib.show();
  $('#update_delete_id').val('');
  $('#final_delete_message').show();
  submitDiv.show();
};
var submitFinalDeleteRequest = function(){
  if (deleteId) {
    if (requestTable === 'games'){
      //make AJAX REQUEST to /bulk-delete/gtcon/ with {values:{"game_id":deleteId}}
      //make AJAX REQUEST to /bulk-delete/ctg with {values:{"game_id":deleteId}}
    } else if (requestTable === 'character') {
      //make AJAX REQUEST to /bulk-delete/ctg with {values:{"character_id":deleteId}}
    } else if (requestTable === 'consoles') {
      //make AJAX REQUEST to /bulk-delete/gtcon with {values:{"console":deleteId}}
    }
    //MAKE AJAX REQUEST TO /delete/requestTable/id
  }
};
$('#get_single_data').click(function(){
  if (requestOperation === 'update'){
    submitGetUpdateRequest();
  } else {
    sunmitGetDeleteRequest();
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