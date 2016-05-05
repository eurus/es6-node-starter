export function sum(a,b){
  return a+b;
}

import {Router} from 'express';

let userRouter = Router();

userRouter.get('/', (req, res, next) => {
  console.log('users');
  res.render('index', {title: 'User Page'});
});

export { userRouter };
