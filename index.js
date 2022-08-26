require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/persons');

const cors = require('cors');
app.use(cors());

var morgan = require('morgan');

app.use(express.json());
app.use(express.static('build'));

app.get('/', (request, response) => {
  response.send('<h1>Phonebook app!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  const currentTime = new Date();
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${currentTime}</p>`
    );
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then((result) => {
    response.status(204).end();
  });
});

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({
        error: 'name or number missing',
      })
      .end();
  }

  // if (persons.some((person) => person.name === body.name)) {
  //   return response
  //     .status(400)
  //     .json({
  //       error: 'name already exists',
  //     })
  //     .end();
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
