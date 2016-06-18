'use strict';
var sprintf = require('sprintf-js').sprintf;

var pattern = (nota) => new RegExp('([0-9](?:,|\\.)?[0-9]?)\\s*na\\s*(AP' + nota + ')', 'i');

module.exports = ResultadoDasNotas;

ResultadoDasNotas.help = '';

// [5] na [AP1] e [6] na [AP2]
ResultadoDasNotas.RE_PATTERN = pattern('[1-3]');

/**
 * Este comando é utilizado para se despedir de um membro
 * @param {Bot} bot Interface do bot
 */
function ResultadoDasNotas(bot) {
  function extractNota(mensagem, nota) {
    var re = new RegExp('([0-9](?:,|\\.)?[0-9]?)\\s*na\\s*(AP' + nota + ')', 'i');
    mensagem += ''; // Converte para string
    var results = mensagem.match(pattern(nota));

    if (results) {
      var valor = parseFloat(results[1].replace(',', '.'));
      return valor;
    }
    return undefined;
  }

  bot.onText(ResultadoDasNotas.RE_PATTERN, (msg) => {
    var message, resultado;

    var ap1 = extractNota(msg.text, 1) || 0;
    var ap2 = extractNota(msg.text, 2) || 0;
    var ap3 = extractNota(msg.text, 3);
    var user = msg.from.username ? ( '@' + msg.from.username ) : msg.from.first_name;

    if (ap3) {
      resultado = Math.abs(( (ap1 + ap2) * 3 + ap3 * 4 ) / 10).toFixed(1);

      if (resultado >= 5) {
        message = 'Parabéns %s você esta aprovado com média %s.';
      } else {
        message = 'Avisei diversas vezes para você estudar %s, você está reprovado com média %s.';
      }
    } else {

      resultado = ((50 - ((ap1 + ap2) * 3)) / 4).toFixed(1);

      if (resultado > 0)  {
        if (resultado > 10) {
          message = '%s foram muitas as vezes que eu avisei para você estudar e você não me deu ouvidos, quem sabe na próxima vez você não estuda mais...';
        } else {
          message = '%s você precisa tirar %s na AP3 pra passar.';
        }
      } else  {
        message = 'Parabéns %s você está quase aprovado, mas infelizmente você ainda deve fazer a AP3.';
      }
    }

    bot.sendMessage(msg.chat.id, sprintf(message, user, resultado.toString().replace('.', ',')));
  });
}
