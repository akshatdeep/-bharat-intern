const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")


const app = express()

dotenv.config()


const port = process.env.PORT || 8000


const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.mwlahcp.mongodb.net/newUserDB`, {
    useNewUrlParser: true
})



const sigupUser = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})


const signups = mongoose.model("users", sigupUser)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html")
})


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        const userexist = await signups.findOne({ email: email })
        if (!userexist) {
            const userData = new signups({
                name,
                email,
                password
            })
            await userData.save()
            res.redirect("/succes")
            // console.log(userData.save())
        } else {
            console.error("USER ALREADY EXIST")
            res.redirect("/error")
        }

    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
})


app.get("/succes", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html")
})


app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html")
})



app.listen(port, () => {
    console.log(`server running on ${port}`)
})