import { ApiClient } from "./ApiClient";

export interface IAuthStat {

}

export interface IAuthRequest {

}

export interface IAuthResponse {

}

export const GatewayApi = {
    authStat: () => 
        ApiClient.get<IAuthStat>('/gateway/auth-stat'),
    login: (authRequest: IAuthRequest) => 
        ApiClient.post<IAuthResponse>('/gateway/login', authRequest)
}