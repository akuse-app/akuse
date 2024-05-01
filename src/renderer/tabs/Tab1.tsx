import { useEffect } from "react";
import { clientData } from "../../modules/clientData";
import FeaturedContent from "../components/FeaturedContent";

const Tab1 = () => {
  
  let logged = window.electron.store.get('logged')

  return (
    <div className="main-container">
      <main>
        <FeaturedContent />
      </main>
    </div>
  );
};

export default Tab1;
