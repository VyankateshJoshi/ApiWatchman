import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LayoutWithSidebar from "../Layouts/LayoutWithSidebar";
import Monitors from "../pages/monitors/monitors";
import NewTracker from "../newTracker/newTracker";
const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
  {
    path: '/designGuide',
    element: (
      <LayoutWithSidebar>
        <App />
      </LayoutWithSidebar>
    ),
  },
  {
    path: '/monitors',
    element: (
      <LayoutWithSidebar>
        <Monitors />
      </LayoutWithSidebar>
    ),
  },
  {
    path: '/new',
    element: (
      <LayoutWithSidebar>
        <NewTracker/>
      </LayoutWithSidebar>
    ),
  },
]);

export default router