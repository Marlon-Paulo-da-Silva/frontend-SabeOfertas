import React, { useState, useMemo } from "react";
import api from "../../services/api";

import styles from "./styles.css";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import camera from "../../assets/camera.svg";

export default function NewOffer() {
  const [thumbnail, setThumbnail] = useState(null);

  const [address, setAddress] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [categories, setCategories] = React.useState("");

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setCoordinates(latLng);
    setAddress(value);
  };

  function handleSubmit() {}

  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? "has-thumbnail" : ""}
      >
        <input
          type="file"
          onChange={event => setThumbnail(event.target.files[0])}
        />
        <img src={camera} alt="Select img" />
      </label>
      <label htmlFor="productName">Qual o Nome do Produto? *</label>
      <input
        className="input-form"
        id="productName"
        placeholder="Qual empresa?"
        value={productName}
        onChange={event => setProductName(event.target.value)}
      />
      <label htmlFor="address">Qual a Localização de sua Empresa? *</label>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Digite a sua localização",
                className: "location-search-input input-form",
                id: "address"
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
      <label htmlFor="company">Qual o nome da Empresa? *</label>
      <input
        className="input-form"
        id="company"
        placeholder="Qual empresa?"
        value={companyName}
        onChange={event => setCompanyName(event.target.value)}
      />

      <label htmlFor="description">
        O que Gostaria de Colocar na Promoção?:: *
      </label>
      <input
        className="input-form"
        id="description"
        placeholder="Diga mais sobre a promoção"
        value={description}
        onChange={event => setDescription(event.target.value)}
      />
      <label htmlFor="price">Qual o Preço da Promoção? *</label>
      <input
        className="input-form"
        id="price"
        placeholder="Preço da Promoção"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />
      <label htmlFor="categories">
        Digite as Categorias <span>(separadas por virgulas) *</span>
      </label>
      <input
        className="input-form"
        id="categories"
        placeholder="Categorias"
        value={categories}
        onChange={event => setCategories(event.target.value)}
      />
      <button type="submit" className="btn">
        Cadastrar
      </button>
    </form>
  );
}
