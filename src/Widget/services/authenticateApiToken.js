import axios from "axios";
import Config from "../../config";

export function authenticateApiToken(token) {

    return axios.post(`${Config.check_valid_api_token}`, {t: token}).then(r => {
            return r;
        }
    ).catch(e => {
        return e.message;
    })
}
