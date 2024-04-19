let chave = 'b72a609c2ff4cea1bbee3d0352798eb4';

function colocarNaTela(dados) {
    if (dados.cod === 200) {
        document.querySelector('.cidade').innerHTML = 'Previsão para ' + dados.name;
        document.querySelector('.temp').innerHTML = Math.floor(dados.main.temp) + '°C';
        document.querySelector('.icone').src = 'https://openweathermap.org/img/wn/' + dados.weather[0].icon + '.png';
        document.querySelector('.umidade').innerHTML = 'Umidade: ' + dados.main.humidity + '%';
    } else {
        alert('Cidade não encontrada. Por favor, verifique o nome e tente novamente.');
    }
}

async function buscarCidade(cidade) {
    try {
        let dados = await fetch(
            'https://api.openweathermap.org/data/2.5/weather?q=' + cidade +
            '&appid=' + chave + '&units=metric'
        ).then((resposta) => resposta.json());

        colocarNaTela(dados);
    } catch (error) {
        console.error('Erro ao buscar dados da cidade:', error);
        alert('Ocorreu um erro ao buscar os dados da cidade. Por favor, tente novamente mais tarde.');
    }
}

function cliqueiNoBotao() {
    let cidade = document.querySelector('.input-cidade').value;

    if (cidade.trim() !== '') {
        buscarCidade(cidade);
    } else {
        alert('Por favor, insira o nome da cidade.');
    }
}

function buscarPrevisaoPorLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            buscarPrevisaoPorCoordenadas(latitude, longitude);
        });
    } else {
        alert("Geolocalização não é suportada neste navegador.");
    }
}

async function buscarPrevisaoPorCoordenadas(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${chave}&units=metric`);
        const data = await response.json();

        colocarNaTela(data);
    } catch (error) {
        console.error("Erro ao buscar dados de previsão:", error);
        alert("Ocorreu um erro ao buscar os dados de previsão. Por favor, tente novamente mais tarde.");
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, handleError);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Chamada para a API de geocodificação para obter o nome da cidade usando as coordenadas
    const geocodeApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${chave}`;
    
    fetch(geocodeApiUrl)
        .then(response => response.json())
        .then(data => {
            const cityName = data[0].name;
            const countryCode = data[0].country;
            const locationIcon = document.getElementById('locationIcon');

            // Chamada para a API de previsão do tempo usando o nome da cidade e código do país
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${chave}&units=metric`;
            
            fetch(weatherApiUrl)
                .then(response => response.json())
                .then(weatherData => {
                    // Processar os dados meteorológicos recebidos e exibi-los na interface
                    colocarNaTela(weatherData);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching city name:', error);
        });
}

function handleError(error) {
    console.error("Error getting user location:", error);
}

// Chamando a função para obter a localização do usuário ao carregar a página
getLocation();
// Chamar a função para buscar a previsão com base na localização do usuário ao carregar a página
buscarPrevisaoPorLocalizacao();
