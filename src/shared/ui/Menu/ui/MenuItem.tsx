import { memo, ReactElement, useCallback } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from 'entities/User';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { MenuTheme } from '../config/profileMenuData';
import cls from './MenuItem.module.scss';

interface MenuItemProps {
  name: string;
  path: string;
  icon: ReactElement;
  theme: MenuTheme;
  cb?: () => void;
}

export const MenuItem = memo((props: MenuItemProps) => {
  const {
    name, path, icon, theme, cb,
  } = props;

  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch(userActions.logout());
  }, [dispatch]);

  const handleClick = () => {
    if (path === RoutePath.main) {
      onLogout();
    }
    if (cb) {
      cb();
    }
  };

  return (
    <li className={classNames(cls.item, {}, [cls[theme]])}>
      <NavLink
        className={({ isActive }) => classNames(cls.link, { [cls.linkActive]: isActive }, [cls[theme]])}
        to={path}
        onClick={handleClick}
      >
        <span className={cls.linkName}>{name}</span>
        {icon}
        {theme === 'profileSidebar' && (
          <div className={classNames(cls.line, {}, [cls[theme]])} />
        )}
      </NavLink>
    </li>
  );
});