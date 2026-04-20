/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserData {
    userName: string
    email: string
    password: string
    token?: string
}

export function callSignUp(newUserData: UserData) {
    return new Promise(async (resolved: (e: any) => void, reject) => {
        try {
            const existingUsersJson = await AsyncStorage.getItem('users_db');
            const usersList: UserData[] = existingUsersJson
                ? JSON.parse(existingUsersJson)
                : [];

            const userExists = usersList.find((u: any) => u.email === newUserData.email);
            if (userExists) {
                resolved({ isSuccess: false, error: 'User already exists!' })
                return;
            }

            const updatedUsers = [...usersList, newUserData];
            await AsyncStorage.setItem('users_db', JSON.stringify(updatedUsers));

            resolved({ isSuccess: true })
        } catch (e) {
            reject(e)
            console.error(e);
        }
    })
}

export function callSignIn(loginID: string, password: string) {
    return new Promise(async (resolved: (e: any) => void, reject) => {
        try {
            const existingUsersJson = await AsyncStorage.getItem('users_db');
            const usersList: UserData[] = existingUsersJson
                ? JSON.parse(existingUsersJson)
                : [];

            const user = usersList.find(u => u.email === loginID && u.password === password)

            if (user) {
                const token = `mock_jwt_token_${Math.random()}`

                await AsyncStorage.setItem('users_db', JSON.stringify(usersList.map(u => u.email === user.email
                    ? { ...user, token }
                    : u
                )));

                resolved({ isSuccess: true, token })
            } else {
                resolved({ isSuccess: false, error: 'Invalid login id / password.' })
            }
        } catch (e) {
            reject(e)
            console.error(e);
        }
    })
}

export function getProfile() {
    return new Promise(async (resolved: (e: any) => void, reject) => {
        try {
            const token = await AsyncStorage.getItem('user_token');
            if (token) {
                const existingUsersJson = await AsyncStorage.getItem('users_db');
                const usersList: UserData[] = existingUsersJson
                    ? JSON.parse(existingUsersJson)
                    : [];

                const user = usersList.find(u => u.token === token)

                if (user) {
                    resolved({ user })
                    return
                }
            }

            resolved({ user: { userName: 'Visitor' } as UserData })
        } catch (e) {
            reject(e)
            console.error(e);
        }
    })
}