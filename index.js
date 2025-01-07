import express from 'express'
import persons from './persons.js'
import morgan from 'morgan'

const app = express()

app.use(express.json())
morgan.token("body", (req, res) => JSON.stringify(req.body) === "{}" ? null : ` - ${JSON.stringify(req.body)}`)
app.use(morgan(":method :url :status :res[content-length] :response-time ms :body"))

app.get('/info', (req, res) => {
  return res.send(`Phonebook has info for ${persons.length} people. <br/> ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  if (persons){
    return res.status(200).json(persons)
  }
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id) 
  const person = persons.find(person => person.id === id)
  if (!person) {
    return res.status(404).send({ message: 'person not found' })
  }
  return res.status(200).json(person)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number){
    return res.status(400).send({ message: 'both name and number need to be present' })
  }
  
  if (persons.find(person => person.name === name)){
    return res.status(400).send({ message: 'name must be unique' })
  }

  const person = {
    name: name, 
    number: number,
    id: Math.floor(Math.random() * 1000)
  }
  persons.push(person)
  return res.status(201).json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})