import axios from 'axios'
import jwtDecode from 'jwt-decode'

import loginService from '../services/login.service'

// set defaults to axios
axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')

export default {
    axios,

    request: (options) => {
        // check options
        if (!options && typeof options === !'object') {
            throw Error('request() method required "options" param as "Object"')
        }
        // decode access token
        let decodedAccessToken = jwtDecode(localStorage.getItem('accessToken'))

        // if access token has expired get new and send request again
        if (decodedAccessToken.exp <= Math.round(new Date().getTime() / 1000)) {
            return loginService.refreshTokens({
                email: 'user@user.com',
                oldRefreshToken: localStorage.getItem('refreshToken')
            })
            .then(res => {
                // update tokens in localStorage
                localStorage.setItem('refreshToken', res.data.refreshToken)
                localStorage.setItem('accessToken', res.data.accessToken)
                // update access token in axios defaults
                axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')
            })
            .then(() => {
                // repeat request
                return options.handler()
            }).catch(error => {
                if (error.response.data.badRefreshToken) {
                    console.log('badRefreshToken: true')
                }
                if (error.response.data.refreshTokenExpiredError) {
                    console.log('refreshTokenExpiredError: true, go to login')
                    // hide profile button and show login button TODO
                }
            })
        } else { // make request
            return options.handler()
        }
    }
}
