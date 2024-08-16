import { createSlice } from "@reduxjs/toolkit";

export const TOKEN_TIME_OUT = 1000 * 1000; // 30분

export const tokenSlice = createSlice({
  name: "authToken",
  initialState: {
    authenticated: false, // 현재 로그인 여부 확인
    accessToken: null, // access 토큰 저장
    expireTime: null, // access 토큰 만료 시간
    nickname: null,
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      // access 토큰 정보 저장
      state.authenticated = true;
      state.accessToken = action.payload;
      state.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
      state.nickname = action.payload.nickname;
    },
    DELETE_TOKEN: (state) => {
      // 값 모두 초기화 => access 토큰 정보 삭제
      state.authenticated = false;
      state.accessToken = null;
      state.expireTime = null;
      state.nickname = null;
    },
  },
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;
