
// Apufunktioita ja arvoja testeille
const initialUsers = [
    {
        username: 'testiukko00',
        name: 'Testi Ukko',
        password: 'salasana'
    },
    {
        username: 'testiukko01',
        name: 'Testi Ukko2',
        password: 'password'
    },
]
const newUser = { username: 'testimies', name: 'Testi Mies', password: 'passu'}
const loginUser = {username: 'kirjautuja', name: 'Kirjautuja Kaveri', password: 'kirja'}


module.exports = {
    newUser, initialUsers, loginUser
}