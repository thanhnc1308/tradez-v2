import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Sidebar
const Dashboards = Loader(lazy(() => import('src/views/Dashboards')));
const StockScreener = Loader(lazy(() => import('src/views/StockScreener')));
const Backtest = Loader(lazy(() => import('src/views/Backtest')));
const Journal = Loader(lazy(() => import('src/views/Journal')));
const Messenger = Loader(lazy(() => import('src/views/Messenger')));
const UserProfile = Loader(lazy(() => import('src/views/Users/profile')));
const UserSettings = Loader(lazy(() => import('src/views/Users/settings')));

// Status
const Status404 = Loader(lazy(() => import('src/pages/Status404')));
const Status500 = Loader(lazy(() => import('src/pages/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/pages/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/pages/Maintenance')));


const routes: PartialRouteObject[] = [
  {
    path: '*',
    element: (
      <SidebarLayout />
    ),
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to="/dashboards"
            replace
          />
        )
      },
      {
        path: '/dashboards',
        element: <Dashboards />
      },
      {
        path: '/stock-screener',
        element: <StockScreener />
      },
      {
        path: '/backtest',
        element: <Backtest />
      },
      {
        path: '/journal',
        element: <Journal />
      },
      {
        path: '*',
        element: (
          <Navigate
            to="/pages/404"
            replace
          />
        )
      }
    ]
  },
  {
    path: 'pages',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to="/404"
            replace
          />
        )
      },
      {
        path: '404',
        element: <Status404 />
      },
      {
        path: '500',
        element: <Status500 />
      },
      {
        path: 'maintenance',
        element: <StatusMaintenance />
      },
      {
        path: 'coming-soon',
        element: <StatusComingSoon />
      },
      {
        path: '*',
        element: <Status404 />
      },
    ]
  },
  {
    path: 'messenger',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Messenger />
      },
    ]
  },
  //#region TODO
  {
    path: 'management',
    element: (
      <SidebarLayout />
    ),
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to="/management/profile"
            replace
          />
        )
      },
      {
        path: 'profile',
        children: [
          {
            path: '/',
            element: (
              <Navigate
                to="details"
                replace
              />
            )
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          },
        ]
      }
    ]
  }
  //#endregion TODO
];

export default routes;
