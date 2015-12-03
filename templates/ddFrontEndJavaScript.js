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

var exampleGameRows = {
  rows: [
  {name:"Legend Of Zelda",release:"1998", publisher:"nintendo",
    developer:"nintendo", rating:"10", id:"4"},
  {name:"Dark Souls",release:"2011", publisher:"From Software",
    developer:"From Software", rating:"11", id:"1"}
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

var exampleCtgRows = {
  rows: [{char_id:"2", game_id:"1"}, {char_id : "1", game_id:"2"}]
};

var makeCtgRow = function(row) {
    return $("<tr><td>"+ row['char_id'] +"</td>" +
      "<td>"+ row['game_id'] +"</td></tr>");
};
var exampleCharRows = { 
  rows:
  [{char_id:"1",name:"Zelda", alias:"Sheik",
    description:"Princess", gender:"Female", first_game:"Legend of Zelda"}]
};
var makeCharRow = function(row) {
    return $("<tr><td>"+ row['char_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['alias'] +"</td>" +
      "<td>"+ row['gender'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['first_game'] +"</td></tr>");
};
var exampleConsoleRow = {
  rows: [
  {console_id:"1", name:"Nintendo 64", abbreviation:"N64", description:"blah",
  num_sold:"1,000,000", owner_company:"Nintendo", release_date:"1996"}
  ]
}
var makeConsoleRow = function(row) {
    return $("<tr><td>"+ row['console_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['abbreviation'] +"</td>" +
      "<td>"+ row['description'] +"</td>" +
      "<td>"+ row['num_sold'] +"</td>" +
      "<td>"+ row['owner_company'] +"</td>"+
      "<td>"+ row['release_date'] +"</td></tr>");
};
var exampleCompanyRow = [
  {company_id:"1", name:"Nintendo", date_founded:"1990", address:"11 arch street",
    website:"www.nintendo.com", phone:"555-555-5555"}
]
var makeCompanyRow = function(row) {
    return $("<tr><td>"+ row['company_id'] +"</td>" +
      "<td>"+ row['name'] +"</td>" +
      "<td>"+ row['date_founded'] +"</td>" +
      "<td>"+ row['address'] +"</td>" +
      "<td>"+ row['website'] +"</td>" +
      "<td>"+ row['phone'] +"</td></tr>");
};

var exampleGTConRow = [
  {console_id:"1", game_id:"1"}
]

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
  });
  tableDib.find('#begin_message').hide();
  tableDib.find('#update_insert').hide();
  $.ajax({
    type:'GET',
    url:'http://localhost:5000/select/'+requestTable,
    data: values,
    dataType:'json'
  }).done(function(resp){
    console.log(resp);
  });
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