var db = databoom('https://t336.databoom.space', 'b336');
db.login('default', 'i8f9wwmi');
function updateHistory() {
  var history = [],
      historyList = ''; 
  db.load('historyCalc', {orderby:"date desc"}).then( function( data ){
    data.forEach(function(elem, i) {
      history.push(elem.expr + '=' + elem.result);
      historyList += history[i] + '\n';
    });
    $('#history').html(historyList)
  }, function( error ){
    $('#history').html('Data loading error ' + error)
  });
}
function toggleHistory() {
  updateHistory();
    if ( $( '#history' ).is( ":hidden" ) ) {
      $( '#history' ).slideDown( "slow" );
      $('#show-history').val('Скрыть историю');
    } else {
      $( '#history' ).hide();
      $('#show-history').val('Показать историю');
    }
}
function addHistory(expr, result) {
  db.save('historyCalc', { expr: expr, result : result, date: new Date() })
    .done(function () { updateHistory() });
}
function clearHistory() {
  db.del('historyCalc');
  updateHistory();
}

var multiply = false,
    result = null;
function calculate(arr, expr) {
  var error = false;
  var arr2 = [];
  arr.forEach(function(elem) {
    if (elem == '') {
      return error = true;
    }
    if (elem == '*') {
      multiply = true;
    } else {
      if (multiply == true) {
        arr2[arr2.length-1] *= elem;
        isNaN(+elem) ? error = true : arr2.push(+elem);
        multiply = false;
      } else {
        if (elem !== '+') {
          isNaN(+elem) ? error = true : arr2.push(+elem);
        }
      }
    }
  });
  if (!error) {
    result = arr2.reduce(function(sum, current) {
      return sum + +current;
    });
    arr2 = [];
    document.getElementById('result').value = result;
    addHistory(expr, result);
  } else {document.getElementById('result').value = 'undefined';}
}
function splitting() {
  var expr = document.getElementById('expression').value;
  var arr = expr.split(/(\+|\*)/);
  calculate(arr, expr);
}


