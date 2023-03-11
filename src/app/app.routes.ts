import { Route } from "@angular/router";

export const routes: Route[] = [
  {
    path: "home",
    loadComponent: () => import("@quicklist-signals/home"),
  },
  {
    path: "checklist/:id",
    loadComponent: () => import("@quicklist-signals/checklist"),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];
