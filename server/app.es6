import express, {
  Router
} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import {
  sum,
  userRouter
} from './users';

let app = express();
let router = Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res, next) => {
  res.render('index', {
    title: 'ES6-Node'
  });
});

app.use('/users', userRouter);

app.listen(3000, () => {
  console.log('server listening at port 3000...');
});
