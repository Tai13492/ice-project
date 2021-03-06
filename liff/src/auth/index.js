import React from "react";
import { connect } from "react-redux";
import {
  setAuthentication,
  deleteTokenAndExpiration,
  setTokenAndExpiration
} from "../auth/ducks";
import Axios from "axios";
import { END_POINT } from "../index";

class Auth extends React.Component {
  async componentDidMount() {
    const { setAuthentication, setTokenAndExpiration, history } = this.props;
    initAxiosErrorHandling(deleteTokenAndExpiration, history);
    const idToken = localStorage.getItem("idToken");
    const expireIn = localStorage.getItem("expireIn");
    if (idToken) {
      try {
        const res = await Axios.post("/auth/myToken/line", {
          lineToken: idToken
        });
        if (res) {
          localStorage.setItem("token", res.data.token);
          setAuthentication(true);
          setTokenAndExpiration(idToken, expireIn);
          if (res.data.token) {
            Axios.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.token;
          }
        }
      } catch (error) {
        console.log("AN ERROR HAS OCCURED");
      }
    } else {
      window.location.href = END_POINT + "/auth/lineLoginPage";
    }
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2979ff",
          width: "100vw",
          height: "100vh"
        }}
      >
        <div className="lds-roller">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticate: state.authentication.isAuthenticate,
  idToken: state.authentication.idToken
});

const mapDispatchToProps = {
  setAuthentication,
  setTokenAndExpiration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

const initAxiosErrorHandling = (callback, history) => {
  Axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 400) {
        console.log("ERROR 400");
        history.push("/auth/registration");
      } else if (error.response.status === 401) {
        console.log("ERROR 401");
        callback();
        window.location.href = END_POINT + "/auth/lineLoginPage";
      }
      return Promise.reject(error);
    }
  );
};
