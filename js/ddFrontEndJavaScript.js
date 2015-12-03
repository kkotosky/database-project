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
var exampleCompanyRow = [
  {company_id:"1", name:"Nintendo", date_founded:"1990", address:"11 arch street",
    website:"www.nintendo.com", phone:"555-555-5555"}
];
var exampleGTConRow = [
  {console_id:"1", game_id:"1"}
];

var hideDivs = function(){
	ctgTable.hide();
	gameTable.hide();
	charTable.hide();
	consoleTable.hide();
	companyTable.hide();
	gtconTable.hide();
	submitDiv.hide();
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
var fillCharTable = function(data, yes) {
  $.each(data, function(k,rep) {
    charTable.find("table").append(makeCharRow(rep, editable));
  });
};
var fillConsoleTable = function(data, yes) {
  $.each(data, function(k,rep) {
    consoleTable.find("table").append(makeConsoleRow(rep, editable));
  });
};
var fillCompanyTable = function(data, yes) {
  $.each(data, function(k,rep) {
    companyTable.find("table").append(makeCompanyRow(rep, editable));
  });
};
var fillGtConTable = function(data, yes) {
  $.each(data, function(k,rep) {
    gtconTable.find("table").append(makeGTConRow(rep, editable));
  });
};
operationRadios.change(function(evt){
	hideDivs();
  var activeTable = tableSelectorDiv.find('.active');
  activeTable.removeClass('.active');
  activeTable.prop('checked',false);
	var val = evt.currentTarget.value;
  $(evt.currentTarget).addClass('active');
	requestOperation = val;
	if(val === 'select') {
		tableSelectorDiv.show();
	} else if(val === 'insert') {
		tableSelectorDiv.show();
	} else if(val === 'update') {
		tableSelectorDiv.show();
	} else {
		tableSelectorDiv.show();
	}
  $('#begin_message').hide();
});
tableRadios.change(function(evt){
	hideDivs();
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
		console.log ("error");
	}
  if(requestOperation == 'select' || requestOperation == 'insert'){
    tableDib.show();
    tableDib.find("#update_insert").show();
    $('#begin_message').show();
    submitDiv.show();
	} else {
    requestSample.show();
  }
});
var submitSelectRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.attributes[0].nodeValue, input.value]);
  });
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  /*$.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: values},
    dataType:'json'
  }).done(function(resp){*/
  fillGameTable(exampleGameRows.rows, false);
  submitDiv.hide();
  //});
};
var submitInsertRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.attributes[0].nodeValue, input.value]);
  });
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
};


var submitUpdateRequest = function(){
  
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
updateDeleteRequest.click(function(){
  var values = [[getTableId(), $('#update_delete_id').value]];
  /*$.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: {values: values},
    dataType:'json'
  }).done(function(resp){*/
  fillGameTable(.rows, true);
  submitDiv.hide();
  //});
});
submitButton.click(function(){
	if (requestOperation === 'select') {
    submitSelectRequest();
	} else if (requestOperation === 'insert') {
    submitInsertRequest();
	} else if (requestOperation === 'update') {
		submitUpdateRequest();
	} else if (requestOperation === 'delete') {
		submitDeleteRequest();
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
updateSubmit.click(function(){
  var id = $('update_id').text();
  //form request for that id
});

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