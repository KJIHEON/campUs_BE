//서비스로 불러와서 바로 사용가능 서비스도 인스턴스로 내보내기
import {Request,Response, NextFunction } from 'express';
import { coordinate, Users } from '../../interface/user';
import {InvalidParamsError} from '../../utils/exceptions'
import userServ from './userServ';
import Token from '../../utils/jwt';
import User from '../../database/models/user';
import { resizing } from '../../utils/multer';


//바로 사용가능 하다 인스턴스 시킬수 없음
//모듈 이름 옆에 async 사용해야함

export default {
  //회원가입
  signup: async (req: Request , res: Response, next: NextFunction) => {
    try {
      const { email, password }: Users = req.body
      if(!email && !password) throw new InvalidParamsError("이메일과 패스워드는 필수값입니다.")
      await userServ.signup({ email, password });
      res.status(201).send({ message: '회원가입 성공' });
    } catch (err) {
      next(err);
    }
  },
//로그인 하기
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, password}:Users = req.body
      const Tokens = await Token.createTokens({email, password });
      res.cookie('accessToken', Tokens.AccessToken); // Access Token을 Cookie에 전달한다.
      res.cookie('refreshToken', Tokens.RefreshToken);
      res.status(200).json({message:"로그인을 성공하였습니다!!",Tokens});
    } catch (err) {
      next(err);
    }
  },
  //비밀번호 변경
  changePW: async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const { email, changePassword }:Users = req.body
      if(!email || !changePassword) throw new InvalidParamsError("입력 값이 없습니다.")
      await userServ.changePW({email, changePassword})
      res.status(201).send({message :"비밀번호 변경 완료!"})
    }catch(err){
      next(err)
    }
  },
  //유저정보 수정
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { location, size } = req.file as Express.MulterS3.File //멀터의 타입을 사용함
      const { userId }: Users = res.locals.user;
      const { nickname }: Users = req.body;
      // if(size >= 1000000){
      //    resizing(location)
      // }
      const profileImg = location
      console.log(req.file as Express.MulterS3.File ,"<=파일정보")
      await userServ.updateUser({nickname, profileImg, userId });
      res.status(201).send({ message: '수정 완료' });
    } catch (err) {
      next(err);
    }
  },
  //마이페이지 조회
  getmyPage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Users = res.locals.user;
      const myPage = await userServ.getmyPage({userId});
      res.status(200).json(...myPage);
    } catch (err) {
      next(err);
    }
  },
  //내가 찜한 목록 조회
  getMyPick: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Users = res.locals.user;
      const myPick = await userServ.getMyPick({userId});
      res.status(200).json(...myPick);
    } catch (err) {
      next(err);
    }
  },
  //이메일 중복 체크
  signupcheck: async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const { email }:Users = req.body
      const findEmail = await User.findOne({where:{email}})
      if(findEmail)  return res.status(400).send({"message":"이미 존재하는 이메일 입니다."})
      res.status(200).send({"message":"사용가능한 이메일 입니다."})
    }catch(err){
      next(err)
    }
  },
   //나와 가까운 캠핑장
   nearCamp: async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const { campX , campY }:coordinate = req.query
      if((String(campX)!.indexOf('.') == -1) || (String(campY)!.indexOf('.') == -1)) throw new InvalidParamsError("좌표가 없습니다.")
      const nearCamp = await userServ.nearCamp({campX,campY});
      res.status(200).json({nearCamp})
    }catch(err){
      next(err)
    }
  },
};
