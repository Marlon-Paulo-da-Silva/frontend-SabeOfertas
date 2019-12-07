import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
// import Maps from "../../components/maps";

import point from "../../assets/lugar-colocar.svg";

import "./styles.css";

export default function Home() {
  const findCoordinatesLat = localStorage.getItem("findCoordinatesLat");
  const findCoordinatesLng = localStorage.getItem("findCoordinatesLng");
  const numberLatSearch = parseFloat(findCoordinatesLat);
  const numberLngSearch = parseFloat(findCoordinatesLng);
  const [offers, setOffers] = useState([]);
  const [cloneOffers, setCloneOffers] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: numberLatSearch,
    longitude: numberLngSearch,
    width: "500px",
    height: "500px",
    zoom: 10
  });
  const [selectedOffer, setSelectedOffer] = useState(null);

  function formataDinheiro(n) {
    return (
      "R$ " +
      n
        .toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
    );
  }

  useEffect(() => {
    async function loadOffers() {
      const userAddress = localStorage.getItem("userAddress");

      console.log(findCoordinatesLat, findCoordinatesLng);

      const response = await api.get(`/offers/?city=${userAddress}`);

      setOffers(response.data);
      setCloneOffers(response.data);
    }

    loadOffers();
  }, []);
  return (
    <>
      <div className="content-home">
        <div className="sidebar">
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFybG9ucGF1bG8iLCJhIjoiY2szdWo1NzZvMGVibTNlbXJkcTM5eGlvMCJ9.JKN3xy0S62kf8L1MqJWAHQ"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={viewport => {
              setViewport(viewport);
            }}
          >
            {offers.map(offer => (
              <Marker
                key={offer._id}
                latitude={parseFloat(offer.lat)}
                longitude={parseFloat(offer.lng)}
              >
                <button
                  className="marker-btn"
                  onClick={e => {
                    e.preventDefault();
                    setSelectedOffer(offer);
                  }}
                >
                  <img src={point} alt="point" />
                </button>
              </Marker>
            ))}

            {selectedOffer ? (
              <Popup
                latitude={parseFloat(selectedOffer.lat)}
                longitude={parseFloat(selectedOffer.lng)}
                onClose={() => {
                  setSelectedOffer(null);
                }}
              >
                <div>
                  <img
                    className="popup-thumb"
                    src={selectedOffer.thumbnail_url}
                    alt="thumbnail product"
                  />
                  <h3>{selectedOffer.productName}</h3>
                  <p>{selectedOffer.description}</p>
                  <p>{selectedOffer.companyName}</p>
                  <span>{formataDinheiro(selectedOffer.price)}</span>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </div>
        <ul className="offer-list">
          {offers.map(offer => (
            <li key={offer._id}>
              <header
                style={{ backgroundImage: `url(${offer.thumbnail_url})` }}
              />

              <h3>
                <strong>{offer.description}</strong>
              </h3>
              <h4>{offer.companyName}</h4>
              <span>
                {offer.price ? formataDinheiro(offer.price) : `GRATIS`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/newoffer">
        <button className="btn">Cadastrar minhas Ofertas</button>
      </Link>
      <Link to="/">
        <button className="btn btn-voltar">Procurar em outra cidade</button>
      </Link>
      {/* <div>Ícones feitos por <a href="https://www.flaticon.com/br/autores/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/br/" title="Flaticon">www.flaticon.com</a></div> */}
    </>
  );
}
