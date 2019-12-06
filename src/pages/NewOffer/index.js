import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import "./styles.css";
import camera from "../../assets/camera.svg";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export default function NewOffer({ history }) {
  const [thumbnail, setThumbnail] = useState(null);

  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
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
    setCity(address);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (!city) return alert("Por favor digite o endereço");

    const data = new FormData();
    const user_id = localStorage.getItem("user");

    data.append("thumbnail", thumbnail);
    data.append("city", city);
    data.append("description", description);
    data.append("productName", productName);
    data.append("price", price);
    data.append("companyName", companyName);
    data.append("categories", categories);
    data.append("lat", coordinates.lat);
    data.append("lng", coordinates.lng);

    await api.post("/offers", data, {
      headers: { user_id }
    });

    console.log(city);
    console.log(thumbnail);
    console.log(description);
    console.log(productName);
    console.log(price);
    console.log(companyName);
    console.log(categories);
    console.log(coordinates.lat);
    console.log(coordinates.lng);

    history.push("/dashboardprofile");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label
          id="thumbnail"
          style={{ backgroundImage: `url(${preview})` }}
          className={thumbnail ? "has-thumbnail" : ""}
        >
          <input
            required
            type="file"
            onChange={event => setThumbnail(event.target.files[0])}
          />
          <img src={camera} alt="Select img" />
        </label>
        <label htmlFor="productName">Qual o Nome do Produto? *</label>
        <input
          className="input-form"
          id="productName"
          placeholder="Nome do Produto"
          value={productName}
          onChange={event => setProductName(event.target.value)}
          required
        />
        <label htmlFor="address">Qual a Localização de sua Empresa? *</label>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
          required
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
          required
        />

        <label htmlFor="description">Descrição da sua Promoção: *</label>
        <input
          className="input-form"
          id="description"
          placeholder="Diga mais sobre a sua promoção"
          value={description}
          onChange={event => setDescription(event.target.value)}
          required
        />
        <label htmlFor="price">Qual o Preço da Promoção? *</label>
        <input
          className="input-form"
          id="price"
          placeholder="Preço da Promoção"
          value={price}
          onChange={event => setPrice(event.target.value)}
          required
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
          required
        />
        <button type="submit" className="btn">
          Cadastrar
        </button>
      </form>
      <Link to="/dashboardprofile">
        <button className="btn btn-voltar">Voltar Para Minhas Ofertas</button>
      </Link>
    </>
  );
}
