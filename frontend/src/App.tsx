import { RouterProvider } from "react-router-dom";
import { router } from "./contexts/Router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
