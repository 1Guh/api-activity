function getExchangeRates() {
    var baseCurrency = 'BRL';
    var targetCurrencies = ['EUR', 'USD', 'GBP'];

    var apiUrl = 'https://api.exchangerate-api.com/v4/latest/' + baseCurrency;

    $.ajax({
        url: apiUrl,
        dataType: 'json',
        success: function(data) {
            var exchangeRates = data.rates;
            var eurToBrl = 1 / exchangeRates['EUR'];
            var usdToBrl = 1 / exchangeRates['USD'];
            var gbpToBrl = 1 / exchangeRates['GBP'];

            $('#exchange-rate-eur').text(eurToBrl.toFixed(2));
            $('#exchange-rate-usd').text(usdToBrl.toFixed(2));
            $('#exchange-rate-gbp').text(gbpToBrl.toFixed(2));
        },
        error: function() {
            $('#exchange-rate-eur').text('Erro ao obter a taxa de câmbio.');
            $('#exchange-rate-usd').text('Erro ao obter a taxa de câmbio.');
            $('#exchange-rate-gbp').text('Erro ao obter a taxa de câmbio.');
        }
    });
}

$(document).ready(function() {
    getExchangeRates();
});

function getCountryData() {
    var countryCode = $('#country-code').val().toUpperCase();
    var apiUrl = 'https://restcountries.com/v2/alpha/' + countryCode;

    // Exemplo de rota adicional para obter informações sobre a capital do país
    var capitalUrl = 'https://restcountries.com/v2/alpha/' + countryCode + '/capital';

    // Requisição para obter os dados gerais do país
    $.ajax({
        url: apiUrl,
        dataType: 'json',
        success: function(data) {
            // Extrair informações do país
            var name = data.name;
            var capital = data.capital;
            var population = data.population;
            var flag = data.flags.png;
            var languages = data.languages.map(function(lang) {
                return lang.name;
            });
            var currencies = data.currencies.map(function(currency) {
                return currency.name;
            });

            // Atualizar os elementos HTML com as informações do país
            $('#country-name').text(name);
            $('#country-capital').text(capital);
            $('#country-population').text(population.toLocaleString());
            $('#country-flag').attr('src', flag);
            $('#country-languages').text(languages);
            $('#country-currencies').text(currencies);

            // Exibir o bloco de informações do país
            $('#country-info').show();
            // Limpar mensagem de erro, se houver
            $('#error-message').text('').hide();

            // Requisição adicional para obter a capital do país
            $.ajax({
                url: capitalUrl,
                dataType: 'json',
                success: function(capitalData) {
                    var countryCapital = capitalData[0];
                    // Atualizar elemento HTML com a capital do país
                    $('#country-capital').text(countryCapital);
                },
                error: function() {
                    console.log('Erro ao obter a capital do país.');
                }
            });
        },
        error: function() {
            // Exibir mensagem de erro se o país não for encontrado
            $('#country-info').hide();
            $('#error-message').text('País não encontrado. Verifique o código do país e tente novamente.').show();
        }
    });
}

function getRandomUser() {
    $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: function(data) {
            // Extrair informações do usuário aleatório
            var user = data.results[0];
            var name = user.name.first + ' ' + user.name.last;
            var email = user.email;
            var picture = user.picture.large;
            // Atualizar os campos de entrada com as informações do usuário
            $('#name').val(name);
            $('#email').val(email);
            
        }
    });
}

function getQuestion() {
    var resultElement = document.getElementById('result');
    resultElement.innerHTML = '';
    resultElement.classList.remove('true', 'error'); // Remove as classes 'true' e 'error'
    
    // Faz uma requisição AJAX para a API
    $.ajax({
      url: 'https://opentdb.com/api.php?amount=1&lang=pt',
      method: 'GET',
      success: function(response) {
        if (response.response_code === 0) {
          // Preenche a pergunta e as opções
          var question = response.results[0].question;
          var options = response.results[0].incorrect_answers;
          var correctOption = response.results[0].correct_answer;
          options.push(correctOption);
          
          var questionElement = document.getElementById('question');
          questionElement.innerHTML = question;
          
          var optionsElement = document.getElementById('options');
          optionsElement.innerHTML = '';
          options.forEach(function(option) {
            var button = document.createElement('button');
            button.innerHTML = option;
            button.classList.add('btn', 'option-button'); // Adiciona a classe "btn" e "option-button"
            button.onclick = function() {
              if (option === correctOption) {
                resultElement.innerHTML = "Resposta correta!";
                resultElement.classList.add('true');
                resultElement.classList.remove('error');
                button.classList.add('btn-success'); // Adiciona a classe "btn-success" ao botão com resposta correta
              } else {
                resultElement.innerHTML = "Resposta incorreta!";
                resultElement.classList.add('error');
                resultElement.classList.remove('true');
                button.classList.add('btn-danger'); // Adiciona a classe "btn-danger" aos botões com resposta incorreta
              }
            };
            button.classList.add('btn-primary'); // Adiciona a classe "btn-primary" a todos os botões
            optionsElement.appendChild(button);
          });
          
          
          
        } else {
          alert('Não foi possível obter a pergunta. Tente novamente.');
        }
      },
      error: function() {
        alert('Ocorreu um erro ao se comunicar com a API.');
      }
    });
  }