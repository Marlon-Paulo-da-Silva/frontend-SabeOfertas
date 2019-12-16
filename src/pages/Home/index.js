import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import ReactDependentScript from "react-dependent-script";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CloseIcon from "@material-ui/icons/Close";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemIcon from "@material-ui/core/ListItemIcon";

// import Drawer from "../../components/Drawer";
// import Maps from "../../components/maps";

import point from "../../assets/flag-purple.png";

import "./styles.css";

const drawerWidth = "50vw";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "#591259"
  },

  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2),
    fontSize: "1.25em"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));
export default function Home({ history }) {
  const findCoordinatesLat = localStorage.getItem("findCoordinatesLat");
  const findCoordinatesLng = localStorage.getItem("findCoordinatesLng");
  const numberLatSearch = parseFloat(findCoordinatesLat);
  const numberLngSearch = parseFloat(findCoordinatesLng);
  const [offers, setOffers] = useState([]);
  const [cloneOffers, setCloneOffers] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: numberLatSearch,
    longitude: numberLngSearch,
    width: "100%",
    height: "100%",
    zoom: 14
  });
  const [selectedOffer, setSelectedOffer] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  function formataDinheiro(n) {
    return (
      "R$ " +
      n
        .toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
    );
  }
  const userAddress = localStorage.getItem("userAddress");

  useEffect(() => {
    async function loadOffers() {
      const userAddress = localStorage.getItem("userAddress");

      console.log(findCoordinatesLat, findCoordinatesLng);

      const response = await api.get(`/offers/?city=${userAddress}`);

      setOffers(response.data);
      console.log(response.data);
      if (response.data.length == 0) {
        alert(
          "Não temos promoções nessa cidade, por favor tente Presidente Prudente - SP"
        );
        history.push("/");
      }
      setCloneOffers(response.data);

      const listener = e => {
        if (e.key === "Escape") {
          setSelectedOffer(null);
        }
      };
      window.addEventListener("keydown", listener);

      return () => {
        window.removeEventListener("keydown", listener);
      };
    }

    loadOffers();
  }, []);
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon /> Mostre-me Todas Na Cidade
            </IconButton>

            <Typography variant="h6" noWrap></Typography>
          </Toolbar>
          <Divider />

          <Toolbar className="toolbar-button">
            <div className="btn-home">
              <Link to="/newoffer">
                <button className="btn-cadastro">Cadastrar</button>
              </Link>
              <Link to="/">
                <button className="btn btn-voltar">Mudar cidade</button>
              </Link>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <h3>FECHAR</h3>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <CloseIcon fontSize="large" />
              ) : (
                <CloseIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <h2 className="userAdress">{userAddress}</h2>
          <Divider />

          <List>
            <ul className="offer-list">
              {offers.map(offer => (
                <li key={offer._id}>
                  <ListItemIcon>
                    <img className="img-list" src={offer.thumbnail_url} />
                  </ListItemIcon>

                  <h3>
                    <strong>{offer.description}</strong>
                  </h3>
                  <h4>{offer.companyName}</h4>
                  <span>
                    {offer.price ? formataDinheiro(offer.price) : `GRATIS`}
                  </span>
                  <Divider />
                </li>
              ))}
            </ul>
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
        </main>
      </div>
      <div className="content-home">
        <div className="mapbox-background">
          <ReactDependentScript
            scripts={[
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyA8SNWyNNA1QDjQrKweLFcBVIFfPCFez4M&libraries=places"
            ]}
          >
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
                      width={240}
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
          </ReactDependentScript>
        </div>
      </div>

      {/* <div>Ícones feitos por <a href="https://www.flaticon.com/br/autores/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/br/" title="Flaticon">www.flaticon.com</a></div> */}
    </>
  );
}
