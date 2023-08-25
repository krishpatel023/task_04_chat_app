export const backendURL = "http://localhost:8000"

//CONFIG FOR AXIOS
export const config = {
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
    credentials: "include"
}

export function createRandom(lengthOf){
    var randomString = ''
    var Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789'
    for (var i =0 ; i < lengthOf ; i++){
        randomString += Characters.charAt(Math.floor(Math.random() * Characters.length))
    }
    return randomString
}