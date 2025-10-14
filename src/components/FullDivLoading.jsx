import { useEffect } from "react";
import ImgLogo from "/src/assets/img/logo.png";

const FullDivLoading = (props) => {
  useEffect(() => {
    if (props.show == true) {
      document
        .getElementById("full-div-loading").classList.remove("d-none");
    } else {
      document
        .getElementById("full-div-loading").classList.add("d-none");
    }
  }, [props.show]);

  return (
    <div id="full-div-loading" className="d-none">
      <div className="d-flex justify-content-center align-items-center h-100">
        <img src={ImgLogo} alt="logo" />
      </div>
    </div>
  );
};

export default FullDivLoading;
