import {
  memo, useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IStatList, statList } from 'entities/Tank/config/TankData';
import { classNames } from 'shared/lib/classNames/classNames';
import { sortItem } from 'features/Filter/types/sort';
import { SearchForm } from 'features/Search';
import { useSelector } from 'react-redux';
import { getCheckboxesFilterState } from 'features/Filter/model/selectors';
import { filterActions } from 'features/Filter/model/slice/filterSlice';
import { useFilterTanks } from 'features/Filter/hooks/useFilterTanks';
import { TUserTanks } from 'entities/Lesta/model/types/tanks';
import { ParamData, getLestaUserTanks } from 'entities/Lesta';
import { useAppDispatch } from 'shared/hooks/useAppDispatch/useAppDispatch';
import { Button } from '../../../../shared/ui/Button/Button';
import { FilterItem } from './FilterItem';
import { filterData } from '../../config/filterData';
import { Sort } from '../Sort/Sort';
import cls from './Filter.module.scss';

function FilterWithCurtain() {
  const { t } = useTranslation('tank');
  const [isOpenFilter, setOpenFilter] = useState(false);
  const [sortState, setSortState] = useState<Record<string, sortItem>>({});
  const dispatch = useAppDispatch();
  const checkboxes = useSelector(getCheckboxesFilterState);
  const { filter } = useFilterTanks();
  const tanks = useSelector(getLestaUserTanks);
  const onChangeFilter = useCallback(
    (e) => {
      const { checked, name, id } = e.target;
      const [param] = id.split('-');
      dispatch(filterActions.setCheckbox({ name, checked, param }));
    },
    [dispatch],
  );

  const setSortStateInit = () => {
    statList.map((item) => setSortState((state: Record<string, sortItem>) => {
      if (item.nameItem === 'lastBattle') {
        return {
          ...state,
          [item.nameItem]: { isActive: true, isUp: false, isDown: true },
        };
      }
      return {
        ...state,
        [item.nameItem]: { isActive: false, isUp: false, isDown: false },
      };
    }));
  };

  useEffect(() => {
    setSortStateInit();
  }, []);

  const closeFilter = () => {
    setOpenFilter(false);
  };

  const applyFilter = useCallback(() => {
    setSortStateInit();
    closeFilter();
    dispatch(filterActions.setFilterData(filter));
  }, [dispatch, filter]);

  const clearFilter = useCallback(() => {
    dispatch(filterActions.clearFilter());
    dispatch(filterActions.setFilterData(tanks));
  }, [dispatch, tanks]);

  const openFilter = () => {
    setOpenFilter(true);
  };

  const clickSort = (nameItem: string, paramItem: keyof ParamData) => {
    let listSort: TUserTanks[] = [];

    statList.map((item) => setSortState((state: Record<string, sortItem>) => {
      if (nameItem === item.nameItem) {
        if (state[nameItem].isDown) {
          return {
            ...state,
            [item.nameItem]: { isActive: true, isUp: true, isDown: false },
          };
        }
        return {
          ...state,
          [item.nameItem]: { isActive: true, isUp: false, isDown: true },
        };
      }
      return {
        ...state,
        [item.nameItem]: { isActive: false, isUp: false, isDown: false },
      };
    }));

    if (sortState[`${nameItem}`].isDown) {
      const getStatisticValue = (h: TUserTanks):string | number => h.statistics[paramItem];

      listSort = [...filter].sort(
        (a, b) => Number(getStatisticValue(a))
        - Number(getStatisticValue(b)),
      );
    }

    if (sortState[nameItem].isUp || !sortState[nameItem].isActive) {
      const getStatisticValue = (h: TUserTanks):string | number => h.statistics[paramItem];

      listSort = [...filter].sort(
        (a, b) => Number(getStatisticValue(b))
        - Number(getStatisticValue(a)),
      );
    }

    dispatch(filterActions.setFilterData(listSort));
  };

  return (
    <div className={cls.tanks}>
      <SearchForm />
      <ul className={cls.sortList}>
        {statList.map((item: IStatList) => (
          <Sort
            data={item}
            key={item.nameItem}
            clickSort={clickSort}
            state={sortState}
          />
        ))}
      </ul>
      <Button onClick={openFilter}>{t('Настроить фильтр')}</Button>
      <div className={classNames(cls.wrapper, { [cls.open]: isOpenFilter })}>
        <form className={cls.filterForm}>
          {filterData.map((data) => (
            <fieldset className={cls.group} key={data.name} id={data.param}>
              <legend className={cls.legend}>{t(`${data.text}`)}</legend>
              <ul className={cls.filterList}>
                {data.values.map((value) => (
                  <FilterItem
                    value={value}
                    param={data.param}
                    name={data.name}
                    key={`${data.param}-${value}`}
                    onChange={onChangeFilter}
                    checked={checkboxes[`${data.param}`][`${value}`]}
                  />
                ))}
              </ul>
            </fieldset>
          ))}
          <ul className={cls.buttonList}>
            <li className={cls.buttonItem}>
              <Button onClick={clearFilter} theme="clear">
                {t('Сбросить')}
              </Button>
            </li>
            <li className={cls.buttonItem}>
              <Button onClick={applyFilter}>{t('Фильтр')}</Button>
            </li>
            <li className={cls.buttonItem}>
              <Button theme="clear" variant="close" onClick={closeFilter} />
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export const Filter = memo(FilterWithCurtain);
