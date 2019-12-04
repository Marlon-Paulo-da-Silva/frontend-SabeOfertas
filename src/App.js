import React from "react";
import "./App.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import logo from "./assets/logobo.svg";

function App() {
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setCoordinates(latLng);
    await setAddress(value);
  };

  return (
    <div className="container">
      <div className="content">
        <img src={logo} alt="BuscaOferta" />
        <p>
          Escolha sua <strong>cidade</strong> para que possamos pesquisar
          ofertas
        </p>

        <form>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Digite o cidade da sua localização",
                    className: "location-search-input"
                  })}
                />
                <div>
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map(suggestion => {
                    const style = {
                      backgroundColor: suggestion.active ? "#59125941" : "#fff"
                    };

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          style,
                          className: "inputSuggestion"
                        })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <button className="btn" type="submit">
            Pesquisar
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
