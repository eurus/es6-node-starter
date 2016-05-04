import express, {Router} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import jade from 'jade';
import {sum} from './users';

let app = express();
let router = Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine','jade');
app.engine('jade', jade.__express);

app.use(express.static(path.join(__dirname,'..', 'public')));

router.get('/',(req,res,next) => {
  // res.end('hello world!');
  console.log(path.join(__dirname, 'public'));
  console.log(sum(1,2));
  res.render('index', {title: 'ES6-Node'});
});


app.use('/',router);

app.listen(3000,()=>{
  console.log('server listening at port 3000...');
})
