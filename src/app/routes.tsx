import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
    ],
  },
  {
    path: "/catalog",
    Component: CatalogPage,
  },
]);
