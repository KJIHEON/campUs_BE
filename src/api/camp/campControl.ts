import { Request, Response, NextFunction } from 'express';
import campServ from './campServ';
import { getCamp, trip } from '../../interface/camp'

export default {
  // 주제별 캠핑장 조회
  getTopicCamp: async (req: Request<getCamp,{},{},getCamp>, res: Response, next: NextFunction) => {
    try {
      const {numOfRows, pageNo} = req.query;
      const {topicId} = req.params;
      res.status(200).json(await campServ.getTopicCamp({topicId, numOfRows, pageNo}));
    } catch (err) {
      next(err);
    }
  },

  // 지역별 캠핑장 조회
  getByRegionCamp: async (req: Request<getCamp,{},{},getCamp>, res: Response, next: NextFunction) => {
    try {
      const { doNm, numOfRows, pageNo } = req.query;
      res.status(200).json(await campServ.getByRegionCamp({doNm, numOfRows, pageNo}));
    } catch (err) {
      next(err);
    }
  },

  // 캠핑장 상세 정보 조회
  getDetailCamp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({detailCamp : await campServ.getDetailCamp(req)})
    } catch (err) {
      next(err);
    }
  },
  
  // most 캠핑장 조회
  getMostCamp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mostList = await campServ.getMostCamp()
      res.status(200).json({ MostList : mostList })
    } catch (err) {
      next(err);
    }
  },

  // 내 여행 일정 등록
  myTripSave: async(req:Request, res:Response, next:NextFunction)=>{
    try{
      const { userId } = await res.locals.user;
      const { campId } = req.params; // await 불필요
      const { date } = await req.body;
      const ids: trip ={
        userId,
        campId:Number(campId),
        date
      };
      await campServ.myTripSave(ids);
      res.status(201).json({message : "여행일정 등록"});
    }catch(err){
      next(err);
    }
  },

  // 내 여행 일정 삭제
  myTripRemove: async(req:Request, res:Response, next:NextFunction)=>{
    try{
      const { userId } = res.locals.user;
      const { tripId } = req.params;
      const ids: trip ={
        userId,
        tripId:Number(tripId)
      };
      await campServ.myTripRemove(ids);
      res.status(200).json({message : "여행일정 삭제"});
    }catch(err){
      next(err);
    }
  },

  // 캠핑장 찜하기
  campPick: async(req:Request, res:Response, next:NextFunction)=>{
    try{
      const { userId } = res.locals.user;
      const { campId } = req.params;
      res.status(200).json(await campServ.campPick(userId, Number(campId)));
    }catch(err){
      next(err);
    }
  }
};