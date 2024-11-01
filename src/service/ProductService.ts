import axios from 'axios';

const app_id = process.env.VUE_APP_APP_ID
const api_key = process.env.VUE_APP_REST_API_KEY

export default class ProductService {

    static async getProducts(): Promise<any> {
        return await fetch('data/nice_priority.json').then(res => res.json()).then(d => d.data);
    }

    static async getAPI(): Promise<any> {
        const d = await axios.get('https://parseapi.back4app.com/classes/servants',
            {
                params: {
                    'limit': '9999'
                },
                headers: {
                    'X-Parse-Application-Id': app_id,
                    'X-Parse-REST-API-Key': api_key,
                    'Content-Type': 'application/json'
                }
            });
        return d;
    }

    static async createUser(user: any) {
        return await axios.post('https://parseapi.back4app.com/classes/servants', user,
            {
                headers: {
                    'X-Parse-Application-Id': app_id,
                    'X-Parse-REST-API-Key': api_key,
                    'Content-Type': 'application/json'
                }
            })
    }

    static async updateUser(id: string, user: any) {
        return await axios.put('https://parseapi.back4app.com/classes/servants/' + id, user,
            {
                headers: {
                    'X-Parse-Application-Id': app_id,
                    'X-Parse-REST-API-Key': api_key,
                    'Content-Type': 'application/json'
                }
            })
    }

}
