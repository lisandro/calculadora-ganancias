$(document).ready(function () {

  $('#calcular').on('click', function () {
    calcular();
  });

  $(document).keypress(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      calcular();
    }
  });

});


var topesEscalas = [10000, 20000, 30000, 60000, 90000, 120000, 99999999];
var porcentajesEscalas = [0.09, 0.14, 0.19, 0.23, 0.27, 0.31, 0.35];
var fijosEscalas = [900, 1400, 1900, 6900, 8100, 9300];

var MINIMO_NO_IMPONIBLE = 42318;
var ADICIONAL_4TA_CATEGORIA = 203126;
var CONYUGE = 39778;
var HIJO = 19889;
var SERVICIO_DOMESTICO = 43318;

function calcular() {

  var aportesRegGeneral = 0.11;
  var aporteObraSocial = 0.03;
  var aporteInssjp = 0.03; //Ley 19032 PAMI
  var aporteRegEspecial = 0.02; //Decreto 137 y 160/05

  var sueldoBruto = $('#sueldoBruto').val();
  var conyuge = $("input[name='conyuge']:checked").val();
  var regimenEspecial = $("input[name='regimenEspecial']:checked").val();
  var valDomestico = parseInt($('#servicioDomestico').val());
  var servicioDomestico = valDomestico > SERVICIO_DOMESTICO ? SERVICIO_DOMESTICO : valDomestico;

//	var familiaresComponent = document.getElementById("familiares");
//	var cantFamiliares = familiaresComponent.options[familiaresComponent.selectedIndex].value;

  var hijosComponent = document.getElementById("hijos");
  var cantHijos = hijosComponent.options[hijosComponent.selectedIndex].value;

  var aportes = aportesRegGeneral + (regimenEspecial ? aporteRegEspecial : 0 ) + aporteObraSocial + aporteInssjp;

  var sueldoNeto = sueldoBruto * (1 - aportes);
  var sueldoNetoAnual = sueldoNeto * 13;

  var deduccionesTotalesAnuales = MINIMO_NO_IMPONIBLE + ADICIONAL_4TA_CATEGORIA + (conyuge ? CONYUGE : 0) + (HIJO * cantHijos) + servicioDomestico;
  var MNI_mensual = deduccionesTotalesAnuales / 13;

  var gananciaNetaImponible = 0;
  if (deduccionesTotalesAnuales < sueldoNetoAnual) {
    gananciaNetaImponible = sueldoNetoAnual - deduccionesTotalesAnuales;
  }

  var MontoImponibleMensual = gananciaNetaImponible / 13;

  var totalEscalas = [0, 0, 0, 0, 0, 0, 0];

  //Calculo Escalas
  for (var i = 0; i < totalEscalas.length; i++) {
    totalEscalas[i] = calcularValorEscala(i, gananciaNetaImponible);
    if (totalEscalas[i] != fijosEscalas[i]) {
      break;
    }
  }

  //Calculo Resultados
  var impuestoAnual = 0;
  for (var i = 0; i < totalEscalas.length; i++) {
    impuestoAnual = impuestoAnual + totalEscalas[i];
  }
  $("#impuestoAnual").text("$" + Math.ceil(impuestoAnual) + ".00");

  var impuestoMensual = impuestoAnual / 13;
  $("#impuestoMensual").text("$" + Math.ceil(impuestoMensual) + ".00");

  var alicuota = (impuestoMensual / sueldoNeto) * 100;
  $("#alicuota").text(alicuota.toFixed(2) + "%");

  var sueldoEnMano = sueldoNeto - impuestoMensual;
  $("#sueldoEnMano").text("$" + Math.ceil(sueldoEnMano) + ".00");


}


function calcularValorEscala(numeroEscala, montoImponibleAnual) {
  var resultado = 0;
  var montoEscala = 0;
  if (numeroEscala > 0) {
    montoEscala = topesEscalas[numeroEscala - 1];
  }

  if (montoImponibleAnual < topesEscalas[numeroEscala]) {
    resultado = (montoImponibleAnual - montoEscala) * porcentajesEscalas[numeroEscala];
  }
  else {
    resultado = fijosEscalas[numeroEscala];
  }

  return resultado;
}