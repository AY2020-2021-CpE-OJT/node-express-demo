const Joie = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id : 1, name: 'course1'},
    {id : 2, name: 'course2'},
    {id : 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    // if (!req.body.name || req.body.name.length < 3) {
    //      res.status(400).send('Name is Required and at least 3 Char');
    // }
    const result = validateCourse(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].schema);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id', (req, res) => {
    // Check if course exists
    // Return 404 if not
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('ID not found');

    // Validate
    // Return 400 if not
    const result = validateCourse(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    //Update Course
    // Return the Update course
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course) {
    const schema = Joie.object({
        name: Joie.string().min(3).required()
    });

    return schema.validate(course);
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('ID not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});


app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('ID not found');
    res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));