import { useEffect } from "react";
import ImgLoader from "/src/assets/img/loader.png";

const FullDivLoading = (props) => {
  useEffect(() => {
    if (props.show == true) {
      document
        .getElementById("jsLoader").classList.remove("d-none");
    } else {
      document
        .getElementById("jsLoader").classList.add("d-none");
    }
  }, [props.show]);

  return (
    <div id="jsLoader" className="js-loader d-none">
      <img id="site-loader" src={ImgLoader} width={64} />
    </div>
  );
};

export default FullDivLoading;
