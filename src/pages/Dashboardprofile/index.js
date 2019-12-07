import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import "./styles.css";

export default function DashboardProfile() {
  const [offers, setOffers] = useState([]);

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
    async function myOffers() {
      const user_id = "5de13423f2342f0d10b3e3f0";
      // const user_id = localStorage.getItem("user_id");
      const response = await api.get("/dashboardprofile", {
        headers: { user_id }
      });

      setOffers(response.data);
    }

    myOffers();
  }, []);

  return (
    <>
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
            <span>{offer.price ? formataDinheiro(offer.price) : `GRATIS`}</span>
          </li>
        ))}
      </ul>

      <Link to="/newoffer">
        <button className="btn">Cadastrar mais Ofertas</button>
      </Link>
      <Link to="/home">
        <button className="btn btn-voltar">Ver todas as ofertas</button>
      </Link>
    </>
  );
}
