import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// Authentication middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  // console.log(req.headers);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET; // Access the environment variable
  // const payload = { userId: 123 };

  if (!secretKey) {
    throw new Error('Secret key not found in environment variables');
  }

  
  jwt.verify(token, secretKey, (error: jwt.VerifyErrors | null, decoded: jwt.JwtPayload| string | undefined) => {
    if (error) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    if(typeof decoded=== "string"){
      const decodedPayload = jwt.decode(token) as { [key: string]: any } | null;
    }
    else{
      req.body.userId = decoded!.id;
      next();
    }
  });
}

module.exports = {
  authenticateToken
};