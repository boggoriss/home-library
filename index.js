import express from 'express'
import bodyParser from "body-parser";
import pug from 'pug'
import { router } from './api-router.js'

const app = express()
const PORT = process.env.PORT ?? 3000;

app.engine('pug', pug.__express);
app.use(bodyParser.json()); // ?
app.use(bodyParser.urlencoded()); // ?

app.use('/public', express.static('public'));
app.use('/api/', router);

app.set("view engine", "pug");
app.set('views', './views');

app.get('/', (req, res, next) => {
    res.render('modalview');
})
app.listen(PORT, () => {console.log(`Server has been started at port=${PORT}`)} );

