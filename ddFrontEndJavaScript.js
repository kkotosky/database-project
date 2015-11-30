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
var updateSubmit = $('#update_submit');
var requestOperation;
var requestTable;
var tableDib;

var hideDivs = function(){
	ctgTable.hide();
	gameTable.hide();
	charTable.hide();
	consoleTable.hide();
	companyTable.hide();
	gtconTable.hide();
	submitDiv.hide();
};

var makeTextBoxRow = function(str, yes) {
  if (yes) {
    return "<input type='text' value='"+str+"''>"+ str + " </input>";
  } else {
    return str;
  }
};
/*Data
{
  rows : [{game_rep},{game_rep}];
}
*/
//name,release,publisher,developer,rating,id
var exampleGameRows = {
  rows: [["Legend Of Zelda","1998","nintendo","nintendo","10","4"],
  ["Dark Souls","2011","From Software","From Software","11","1"]
  ]
};


var makeGameRow = function(row) {
    return $("<tr><td>"+ row['id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['release'] +"</td>" +
      "<td>"+ row['publisher'] +"</td>" +
      "<td>"+ row['developer'] +"</td>" +
      "<td>"+ row['rating'] +"</td></tr>");
};
//char_id, game_id
var exampleCtgRows = {
  rows: [["2", "1"], ["1", "2"]]
};

var makeCtgRow = function(row) {
    return $("<tr><td>"+ row['char_id'] +"</td>" +
      "<td>"+ row['game_id'] +"</td></tr>");
};
//char_id, name, alias, description, gender, first_game
var exampleCharRows = { 
  rows:[["1","Zelda","Sheik","Princess","Female", "Legend of Zelda"]]
};
var makeCharRow = function(row) {
    return $("<tr><td>"+ row['char_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['alias'] +"</td>" +
      "<td>"+ row['gender'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['first_game'] +"</td></tr>");
};
//console_id, name, abbreviation,description,num_sold,owner_company,release_date
var exampleConsoleRow = {
  rows: [["1","Nintendo 64", "N64", "blah","1,000,000", "Nintendo","1996"]]
};
var makeConsoleRow = function(row) {
    return $("<tr><td>"+ row['console_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['abbreviation'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['num_sold'] +"</td>" +
      "<td>"+ row['owner_company'] +"</td>"+
      "<td>"+ row['release_date'] +"</td></tr>");
};
//company_id, name, date_founded, address, website, phone
var exampleCompanyRow = {
  rows:[["1", "Nintendo", "1990", "11 arch street","www.nintendo.com","555-555-5555"]]
};
var makeCompanyRow = function(row) {
    return $("<tr><td>"+ row['company_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['date_founded'] +"</td>" +
      "<td>"+ row['address'] +"</td>" +
      "<td>"+ row['website'] +"</td>" +
      "<td>"+ row['phone'] +"</td></tr>");
};
//console_id, game_id
var exampleGTConRow = {
  rows:[["1", "1"]]
};

var makeGTConRow = function(row) {
    return $("<tr><td>"+ row['console_id'] +"</td>" +
      "<td>"+ row['game_id'] +"</td></tr>");
};
var fillGameTable = function(data, yes){
  $.each(data, function(rep){
    gameTable.find("table").append(makeGameRow(rep), yes);
  });
};

var fillCtGTable = function(data, yes){
  $.each(data, function(rep){
    gtconTable.find("table").append(makeGTConRow(rep), yes);
  });
};

var fillCharTable = function(data, yes) {
  $.each(data, function(rep) {
    charTable.find("table").append(makeCharRow(rep), yes);
  });
};

var fillConsoleTable = function(data, yes) {
  $.each(data, function(rep) {
    consoleTable.find("table").append(makeConsoleRow(rep), yes);
  });
};

var fillCompanyTable = function(data, yes) {
  $.each(data, function(rep) {
    companyTable.find("table").append(makeCompanyRow(rep), yes);
  });
};

var fillGtConTable = function(data, yes) {
  $.each(data, function(rep) {
    gtconTable.find("table").append(makeGTConRow(rep), yes);
  });
};

operationRadios.change(function(evt){
	hideDivs();
	var val = evt.currentTarget.value;
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
});

tableRadios.change(function(evt){
	hideDivs();
	var val = evt.currentTarget.value;
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
  tableDib.show();
  tableDib.find("#update_insert").show();
  $('#begin_message').show();
	submitDiv.show();
});

var submitSelectRequest = function(){
  var inputs = tableDib.find('#update_insert').find('input');
  var values = [];
  $.each(inputs, function(k, v){
    var input = $(v)[0];
    values.push([input.attributes[0].nodeValue, input.value]);
    input.value = '';
  });
  $('#begin_message').hide();
  $('#result_message').show();
  tableDib.find('#update_insert').hide();
  submitDiv.hide();
  /*$.ajax({
    type:'GET',
    url:'/select/'+requestTable,
    data: values,
    dataType:'json'
  }).done(function(resp){
    console.log(resp);
  });*/
}

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

updateSubmit.click(function(){
  var id = $('update_id').text();
  //form request for that id
});