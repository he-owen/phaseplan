import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PATH_TO_PAGE = {
  '/': 'Home',
  '/devices': 'Devices',
  '/billing': 'Billing',
  '/optimization': 'Optimization',
  '/tools': 'Tools',
  '/preferences': 'Preferences',
};

const PAGE_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_PAGE).map(([path, page]) => [page, path]),
);

const PageContext = React.createContext({
  currentPage: 'Home',
  setCurrentPage: () => {},
  optimizationResults: null,
  setOptimizationResults: () => {},
  weeklyScheduleResults: null,
  setWeeklyScheduleResults: () => {},
});

export function PageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [optimizationResults, setOptimizationResults] = React.useState(null);
  const [weeklyScheduleResults, setWeeklyScheduleResults] = React.useState(null);

  const currentPage = PATH_TO_PAGE[location.pathname] || 'Home';

  const setCurrentPage = React.useCallback(
    (page) => {
      const path = PAGE_TO_PATH[page] || '/';
      navigate(path);
    },
    [navigate],
  );

  const value = React.useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      optimizationResults,
      setOptimizationResults,
      weeklyScheduleResults,
      setWeeklyScheduleResults,
    }),
    [currentPage, setCurrentPage, optimizationResults, weeklyScheduleResults],
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  return React.useContext(PageContext);
}
