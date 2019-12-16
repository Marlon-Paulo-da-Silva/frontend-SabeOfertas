import React, { useState } from "react";

// import api from "../../services/api";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import logo from "../../assets/logosabeoferta.svg";

export default function Search({ history }) {
  const [address, setAddress] = React.useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setCoordinates(latLng);
    setAddress(value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log(coordinates);

    localStorage.setItem("userAddress", address);
    localStorage.setItem("findCoordinatesLat", coordinates.lat);
    localStorage.setItem("findCoordinatesLng", coordinates.lng);
    // console.log(address);
    // localStorage.setItem("user_id", user);

    history.push("/home");
  }

  return (
    <>
      <img src={logo} alt="BuscaOferta" />
      <p>
        Escolha sua <strong>cidade</strong> para que possamos pesquisar ofertas
      </p>

      <form onSubmit={handleSubmit}>
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
                  placeholder: "Digite a cidade da sua localização",
                  className: "location-search-input"
                })}
              />
              <div>
                {loading ? <div>Procurando Localização...</div> : null}
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
    </>
  );
}
