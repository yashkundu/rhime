import jwt from 'jsonwebtoken'
import {sign} from 'cookie-signature'
import cookie from 'cookie'


const ACCESS_TOKEN_SECRET='secretKey'
const SIGNED_COOKIE_SECRET='secretKey'


const createJWT = (payload: Object, secretKey: string, options: jwt.SignOptions) => {
    const token = jwt.sign(payload, secretKey, options)
    return token
}

const createAccessToken = (user: {userId: string, userName: string}) => {
    const payload = {
        userId: user.userId,
        userName: user.userName
    }
    return createJWT(payload, ACCESS_TOKEN_SECRET!, {
        expiresIn: '1d'
    })
}

//@ts-ignore
function cookieGetter(name, value, options) {
    var opts = options;
    var secret = SIGNED_COOKIE_SECRET;
    var signed = opts.signed;
  
    if (signed && !secret) {
      throw new Error('cookieParser("secret") required for signed cookies');
    }
  
    var val = typeof value === 'object'
      ? 'j:' + JSON.stringify(value)
      : String(value);
  
    if (signed) {
      val = 's:' + sign(val, secret);
    }
  
    if (opts.maxAge != null) {
      var maxAge = opts.maxAge - 0
  
      if (!isNaN(maxAge)) {
        opts.expires = new Date(Date.now() + maxAge)
        opts.maxAge = Math.floor(maxAge / 1000)
      }
    }
  
    if (opts.path == null) {
      opts.path = '/';
    }
    return cookie.serialize(name, String(val), opts)
}


export const getCookie = (user: {userId: string, userName: string}) => {
    const accessToken = createAccessToken(user)
    const cookie = cookieGetter('accessToken', accessToken, {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000*60*60*24
    })
    return cookie.split('; ')[0]
}





