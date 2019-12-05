import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import styles from "./styles.css";

export default function Home() {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    async function loadOffers() {
      const userAddress = localStorage.getItem("userAddress");

      const response = await api.get(`/offers/?city=${userAddress}`);

      console.log(response.data);
      setOffers(response.data);
    }

    loadOffers();
  }, []);
  return (
    <>
      <ul className="offer-list">
        {offers.map(offer => (
          <li key={offer._id}>
            {console.log(offer.thumbnail_url)}
            <header
              style={{ backgroundImage: `url(${offer.thumbnail_url})` }}
            />

            {/* <img
                src="http://localhost:3333/files/capsuladecafe-1575532018039.jpg"
                alt=""
              /> */}

            <h3>
              <strong>{offer.description}</strong>
            </h3>
            <h4>{offer.companyName}</h4>
            <span>{offer.price ? `R$ ${offer.price}` : `GRATIS`}</span>
          </li>
        ))}
      </ul>

      <Link to="/newoffer">
        <button className="btn">Cadastrar minhas Ofertas</button>
      </Link>
      <Link to="/">
        <button className="btn btn-voltar">Procurar em outra cidade</button>
      </Link>
    </>
  );
}
