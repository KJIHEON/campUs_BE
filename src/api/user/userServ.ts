import userRepo from './userRepo';
import { coordinate, Users } from '../../interface/user';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {ValidationErrors} from '../../utils/exceptions';
import {deleteFile} from '../../utils/multer'
dotenv.config();

//바로 사용가능 하다 인스턴스 시킬수 없음
//모듈 이름 옆에 async 사용해야함
export default {
  //회원가입
  signup: async ({ email, password }: Users) => {
    const findUser = await userRepo.findUser({email});
    if (email === findUser?.email) {
      throw new ValidationErrors('중복된 이메일 입니다.');
    }
    const signUser = {
      email: email,
      nickname: email!.split('@')[0],
      password: await bcrypt.hash(password!, parseInt(process.env.SALT_ROUND!)),
    };
    await userRepo.signup(signUser);
  },
   //비밀번호 변경
   changePW: async ({ email ,changePassword}: Users) => {
    console.log(email,changePassword)
    const findUser = await userRepo.findUser({email});
    if (email !== findUser?.email) {
       throw new ValidationErrors('존재하지 않는 이메일 입니다.');
     }
     const newPassword = await bcrypt.hash(changePassword!,parseInt(process.env.SALT_ROUND!))
     console.log(newPassword)
     await userRepo.changePW({email,newPassword})
  },
  //유저 정보 수정
  updateUser: async ({ nickname, profileImg, userId }: Users) => {
    try{
    const findUser = await userRepo.findByPk({userId});
    if (findUser?.userId !== userId) {
      throw new ValidationErrors('유저가 일치 하지 않습니다');
    }
    const fileName = findUser?.profileImg.slice(53)
    const fileDir = findUser?.profileImg.slice(48,52)
    const url = findUser?.profileImg.slice(0,47)
    if(process.env.S3_URL! === url){
      //S3사진 삭제 로직 
      deleteFile(fileDir!,fileName!)
    }
    await userRepo.updateUser({nickname, profileImg, userId});
  }catch(err){
    return err
  }
  },
  //마이페이지 요청
  getmyPage: async ({userId}:Users) => {
    const findUser = await userRepo.findByPk({userId});
    if (findUser?.userId !== userId) {
      throw new ValidationErrors('유저가 일치 하지 않습니다');
    }
    return await userRepo.getmyPage({userId});
  },
  //찜 목록 요청
  getMyPick: async ({userId}:Users) => {
    const findUser = await userRepo.findByPk({userId});
    if (findUser?.userId !== userId) {
      throw new ValidationErrors('유저가 일치 하지 않습니다');
    }
    return await userRepo.getMyPick({userId});
  },
  //나와 가까운 캠핑장 조회
  nearCamp: async ({campX,campY}:coordinate) => {
    return await userRepo.nearCamp({campX,campY});
  },
};
