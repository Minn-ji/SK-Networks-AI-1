import { ActionContext } from "vuex"
import { AuthenticationState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import {REQUEST_IS_AUTHENTICATED_TO_DJANGO} from "./mutation-types"
// import {CartItem, CartState} from "@/cart/store/states";

export type AuthenticationActions = {
    requestKakaoOauthRedirectionToDjango(): Promise<void>
    requestAccessTokenToDjangoRedirection(
        context: ActionContext<AuthenticationState, any>, 
        payload: { code: string }): Promise<void>
    requestUserInfoToDjango(
        context: ActionContext<AuthenticationState, any>): Promise<any>
    requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>,
        { email, accessToken }: { email: string, accessToken: string }): Promise<any>;
    requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>, 
        userToken: string):Promise<void>
}

const actions: AuthenticationActions = {
    async requestKakaoOauthRedirectionToDjango(): Promise<void> {
        return axiosInst.djangoAxiosInst.get('/oauth/kakao').then((res) => {
            window.location.href = res.data.url
        })
    },
    async requestAccessTokenToDjangoRedirection(
                context: ActionContext<AuthenticationState, any>, 
                payload: { code: string }): Promise<void> {

        try {
            console.log('requestAccessTokenToDjangoRedirection()')
            const { code } = payload

            const response = await axiosInst.djangoAxiosInst.post(
                '/oauth/kakao/access-token', { code })
            localStorage.setItem("accessToken", response.data.accessToken.access_token)
        } catch (error) {
            console.log('Access Token 요청 중 문제 발생:', error)
            throw error
        }
    },
    async requestUserInfoToDjango(
            context: ActionContext<AuthenticationState, any>): Promise<any> {

        try {
            const accessToken = localStorage.getItem("accessToken");
            const userInfoResponse: AxiosResponse<any> = 
                await axiosInst.djangoAxiosInst.post(
                    '/oauth/kakao/user-info', 
                    { access_token: accessToken });

            const userInfo = userInfoResponse.data.user_info
            return userInfo

        } catch (error) {
            alert('사용자 정보 가져오기 실패!')
            // python, JavaScript, Golang, TypeScript 등등
            // 최신 스펙을 가진 언어의 경우
            // 위와 같이 세미콜론을 붙일 필요가 없습니다! (Rust 제외)
            // 아래의 throw error 또한 마찬가지입니다.
            // 보통 멀티 랭귀지 프로젝트에서는 Poly Glot (폴리 글랏)이란 것을 하게 됨
            // 그래서 개발자들이 습관상 세미콜론을 붙이는 사람도 있고
            // 한동안 세미콜론을 붙이지 않던 사람들도 있어서
            // 그런 혼선을 방지하게 서포트하는 역할도 합니다.
            // 주로 MSA(Micro Service Architecture) 프로젝트를 하면 이런 상황이 비일비재함
            throw error;
        }
    },
    async requestAddRedisAccessTokenToDjango(
        { commit, state }: ActionContext<AuthenticationState, any>,
        { email, accessToken }: { email: string, accessToken: string }
    ): Promise<any> {
        try {
            console.log("requestAddRedisAccessTokenToDjango -> email:", email)
            console.log("requestAddRedisAccessTokenToDjango -> accessToken:", accessToken)
            const response: AxiosResponse<any> = await axiosInst.djangoAxiosInst.post(
                '/oauth/redis-access-token/', {
                    email: email,
                    accessToken: accessToken
                });

            console.log('userToken:', response.data.userToken)
            localStorage.removeItem('accessToken')
            localStorage.setItem("userToken", response.data.userToken)
            commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, true);
            return response.data;  // Adjust according to what your API returns
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
    async requestLogoutToDjango( context: ActionContext<AuthenticationState, any>, userToken: string):Promise<void> {
        try { 
            const userToken = localStorage.getItem('userToken')

            const res = await axiosInst.djangoAxiosInst.post('/oauth/logout', { userToken:  userToken})
            console.log('res: ', res.data.isSuccess)
            if (res.data.isSuccess === true) {
                context.commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, false)
            }
        } catch (error) {
            console.error('requestLogoutToDjango() 중 에러 발생', error)
            throw error
        }
        localStorage.removeItem('userToken')
    }
};

export default actions;