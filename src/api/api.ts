import axios from "axios";

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
})

export const api = {
    getAllCharacters() {
           return instance.get("/character")
    },
    getPage(page: number) {
        return instance.get(`/character/?page=${page}`)
    },
    getDimensionOfUnpopular(url: string) {
        return instance.get(url)
    }
}