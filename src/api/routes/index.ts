import { Router } from 'express';
import userRouter from './user';
import reviewRouter from './review';
import campRouter from './camp';
import Weather from './weather';
import kakao from './kakao';
import passportCogfig from '../../passport/index';

//패스포트 임포트 해줘야 가능하다.
passportCogfig() 
const router = Router();

router.use('/camps', reviewRouter);
router.use('/users', userRouter);
router.use('/camps', campRouter);
router.use('/weathers', Weather);
router.use('/kakao',kakao)

export default router;
