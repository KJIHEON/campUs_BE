"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const kakaojwt_1 = __importDefault(require("../../utils/kakaojwt"));
// import passportCogfig from '../../passport/index';
//패스포트 임포트 해줘야 가능하다.
// passportCogfig();
dotenv_1.default.config();
const router = (0, express_1.Router)();
// kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
/* router.get('/',passport.authenticate('kakao', {scope: ['profile_nickname', 'profile_image'],})); //scope 속성
 router.post('/', (req,res,next)=>{
  let {authorization} = req.headers;
  console.log(req.headers)
  console.log(authorization)
  res.send("ddd")
}) */
router.post('/', kakaojwt_1.default);
exports.default = router;
