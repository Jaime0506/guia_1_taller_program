const express = require('express')
const fs = require('fs')

const path = require('path')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    
    fs.readFile('user.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error al tratar de leer el archivo", err)

            return res.status(500).send('Error interno del servidos')
        }

        const lines = data.split('\n')
        
        const userFound = lines.some(line => {
            const [storedUser, storedPassword] = line.split(':')
            return storedUser === username && storedPassword === password 
        })

        if (userFound) {
            res.redirect(`/authenticated.html?user=${username}`)
        } else {
            res.redirect('/not-authenticated.html')
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))