import React, { useEffect } from "react";
import api from "../../services/api";

export default function DashboardProfile() {
  useEffect(() => {
    async function myOffers() {
      const user_id = "5de13423f2342f0d10b3e3f0";
      // const user_id = localStorage.getItem("user_id");
      const response = await api.get("/dashboardprofile", {
        headers: { user_id }
      });

      console.log(response.data);
    }

    myOffers();
  }, []);
  return <div></div>;
}
