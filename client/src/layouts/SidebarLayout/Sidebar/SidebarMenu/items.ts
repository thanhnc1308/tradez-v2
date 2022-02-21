import { ReactNode } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HistoryIcon from '@mui/icons-material/History';
import CreateIcon from '@mui/icons-material/Create';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Dashboards',
        link: '/dashboards',
        icon: DashboardIcon
      },
      {
        name: 'Stock Screener',
        link: '/stock-screener',
        icon: FilterAltIcon
      },
      {
        name: 'Backtest',
        icon: HistoryIcon,
        link: '/backtest'
      },
      {
        name: 'Journal',
        icon: CreateIcon,
        link: '/journal'
      },
    ]
  }
];

export default menuItems;
