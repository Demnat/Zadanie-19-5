var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'Xt1ahPcJbg8Wik9JZ1MqoocPe89J2gsO';

App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  getGif: function (searchingText) {  // Na wejście metody getGif przyjmujemy dwa parametry: wpisywany tekst (searchingText)
    
    return new Promise(
      function(resolve, reject) {
        const url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // Konstruujemy adres URL dla API Giphy
        const xhr = new XMLHttpRequest();  // Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je
        xhr.open('GET', url);
        xhr.onload = function () {
          if (this.status === 200) {
            var data = JSON.parse(xhr.responseText).data; // W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data
            var gif = {  // Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            };
            resolve(gif); //zwracamy gifa
          } else {
            reject(new Error(
              `XMLHttpRequest Error: coś poszło nie tak`));
          }
        };
        xhr.send();
      });

  },

  handleSearch: function (searchingText) {  // Pobierz na wejściu wpisywany tekst
    
    this.setState({
      loading: true  // Zasygnalizuj, że zaczął się proces ładowania
    });
    this.getGif(searchingText)
      .then(gif => this.setState({  // Na zakończenie pobierania:
        loading: false,  // przestań sygnalizować ładowanie
        gif: gif,  // ustaw nowego gifa z wyniku pobierania
        searchingText: searchingText  // ustaw nowy stan dla wyszukiwanego tekstu
      }))
      .catch(error => console.log(error));
  
  },

  render: function () {

    var styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '90%'
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
        <Search
          onSearch={this.handleSearch}
        />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );

  }
});