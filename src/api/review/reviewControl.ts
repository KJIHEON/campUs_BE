import { Request, Response, NextFunction } from 'express';
import { number } from 'joi';
import { review } from '../../interface/review';
import reviewService from './reviewServ'; //받아온다

export default {
  //캠핑장 리뷰조회
  getReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { campId }: review = req.params;
      const data = await reviewService.getReview(Number(campId));
      res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  //리뷰작성
  createReview: async (
    req: Request<review>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(res.locals);
      const { userId } = res.locals.user;
      const { campId }: review = req.params;
      const { reviewImg, reviewComment } = req.body;
      await reviewService.createReview(
        userId,
        campId!,
        reviewImg,
        reviewComment
      );
      res.status(201).json({ ok: true, massage: '리뷰작성완료' });
    } catch (error) {
      next(error);
    }
  },
  //리뷰수정
  updateReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId }: review = req.params;
      const { reviewImg, reviewComment } = req.body;
      const { userId }: review = res.locals.user;
      const findreview = await reviewService.findReviewAuthor(reviewId!);

      if (userId !== findreview?.userId) {
        return res.status(400).json({ errorMessage: '권한이 없습니다.' });
      }
      await reviewService.updateReview({
        reviewId,
        reviewImg,
        reviewComment,
        userId,
      });
      res.status(200).json({ massage: '리뷰수정완료' });
    } catch (error) {
      next(error);
    }
  },

  //리뷰삭제
  deleteReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId }: review = req.params;
      const { userId } = res.locals.user;
      const findreview = await reviewService.findReviewAuthor(reviewId!);

      if (userId !== findreview?.userId) {
        return res.status(400).json({ errorMessage: '권한이 없습니다.' });
      }
      await reviewService.deleteReview(reviewId!, userId);
      res.status(200).json({ massage: '리뷰삭제완료' });
    } catch (error) {
      next(error);
    }
  },

  //내가쓴리뷰조회
  getMyReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = res.locals.user;
      const myreview = await reviewService.getMyReview(userId);

      res.status(200).json({ data: myreview });
    } catch (error) {
      next(error);
    }
  },

  //캠핑장이름검색
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keyword } = req.body;
      const result = await reviewService.search(keyword);

      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};
