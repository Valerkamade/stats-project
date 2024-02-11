import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { lestaActions } from '../../slice/lestaSlice';
import { LestaTankStats } from '../../types/tanks';

interface ThunkProps {
  id: number | number[];
  accessToken?: string;
}

export const fetchLestaUserTanksDataById = createAsyncThunk<
  LestaTankStats[],
  ThunkProps,
  ThunkConfig<string>
>('lesta/fetchingUserTanksData[]', async (ThunkProps, thunkAPI) => {
  // деструктурируем нужные данные из thunkAPI
  const { rejectWithValue, dispatch, extra } = thunkAPI;
  const serverError = 'Проблема соединения. Попробуйте позже.';
  // отправка запроса
  try {
    // отправляем пост запрос через аксиос с собранными данными
    const response = await axios.post<LestaTankStats[]>(
      'http://localhost:3030/tanks/stats',
      {
        account_id: ThunkProps.id,
      },
    );

    // прокидываем ошибку, если данных нет
    if (!response.data) return rejectWithValue(serverError);

    // записываем в стейт полученные данные
    dispatch(lestaActions.setUserTanks(response.data));

    // возвращаем полученные данные
    return response.data;
  } catch (e) {
    // возвращаем ошибку с бэка
    return rejectWithValue(e?.response?.data?.message || serverError);
  }
});
