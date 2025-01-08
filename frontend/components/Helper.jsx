import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

const Helper = {
    api_url: 'http://185.192.247.157:4414',
    async createEntity (name, fields) {
        let res = await this.post(`entities/add`, {
            name,
            fields
        })
        console.log(res.entity)
        return res
    },
    async listEntity (name) {
        let res = await this.get(`entities`, {
            name: name
        })
        return res
    },
    endpoint (target, params) {
        return `${this.api_url}/${target}`
    },
    async post (target, data) {
        try {
            let response = await fetch(this.endpoint(target), {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            response = response.json()
            return response
        } catch (e) {
            console.log(e)
        }
    },
    async updateEntity (id, fields) {
        let res = await this.$root.post(`entities/update`, {
            id,
            fields
        })
        console.log(res)
        return res
    },
    async getEntity (id) {
        let res = await this.get(`entities/get`, {
            id
        })
        return res
    },
    async deleteEntity (id) {
        let res = await this.get(`entities/delete`, {
            id
        })
        return res
    },
    async get (target, data) {
        let query = new URLSearchParams()
        for (const key in data) {
            query.append(key, data[key])
        }
        let response = await fetch(`${this.endpoint(target)}?${query.toString()}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        response = response.json()
        return response
    },
    async storeUser (payload) {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(payload));
        } catch (e) {
            console.log(e)
            // saving error
        }
    },
    async readUser () {
        try {
            let raw = await AsyncStorage.getItem('user');
            console.log('raw user', JSON.parse(raw))
            return JSON.parse(raw)
        } catch (e) {
            console.log(e)
            return null
            // saving error
        }
    },
}

export default Helper;
