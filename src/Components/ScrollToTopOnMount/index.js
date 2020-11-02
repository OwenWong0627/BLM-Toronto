import { useEffect } from "react";

//This function, when mounted on other components, will have the page scroll to the top with those components
export default function ScrollToTopOnMount() {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return null;
}