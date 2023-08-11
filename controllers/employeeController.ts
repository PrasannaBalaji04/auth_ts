import Employee from '../models/employee';
import {Request,Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validateEmail, validatePassword} from '../services/validators';

async function signUp(req: Request, res: Response):Promise<void>{
    try{
        const { name, email, password, DoB, token, mobile }: {
            name: string;
            email: string;
            password: string;
            DoB: string,
            token: string;
            mobile: string;
          } = req.body;
          const date= Date.parse(DoB);
          const dateObject = new Date(date);
          if (!validateEmail(email)) {
                  console.log("email not valid");
                  res.status(400).json({ error: 'Invalid email address' });
            }
          
            const passwordErrors = validatePassword(password);
            
            if (Array.isArray(passwordErrors)) {
                // Now TypeScript knows value is an array
                if (passwordErrors.length > 0) {
                    console.log("password not valid");
                    res.status(400).json({ error: 'Invalid password', passwordErrors });
                    }
                } else {
                    console.log('Value is not an array');
                }
                
                // Check if the email is already registered
            const existingUser = await Employee.findOne({ email });
            if (existingUser) {
            res.status(409).json({ success: false, message: 'Email already registered' });
            }
            else{
              // Encrypt the password
              const hashedPassword = await bcrypt.hash(password, 10);
              // Create a new employee with the encrypted password
              const employee = await Employee.create({
              name,
              email,
              password : hashedPassword,
              DoB: dateObject,
              token,
              mobile
              });
  
              res.status(201).json({ success: true, message: 'User created successfully' });
            }
    }
    catch(error){

    if (error instanceof Error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ success: false, error: error.message });
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
}

// // Log in a user and generate a JWT token
async function login(req: Request ,res: Response) :Promise<void>{
    try {
      const { email, password } = req.body;
      // Find the employee by email
      const employee = await Employee.findOne({ email });
      if (!employee) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      else{
        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, employee.password.toString());
        if (!isPasswordValid) {
          res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
          throw new Error('Secret key not found in environment variables');
        }
        // Generate a JWT token
        else{
          const token = jwt.sign({ id: employee._id }, secretKey, { expiresIn: '1h' });
          const refreshToken = jwt.sign({id : employee._id}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '1D'});
          
          const updateOperation = {
            $set: {
              token: token,
            },
          };
          
          await Employee.updateOne({_id: employee._id}, updateOperation);
          res.cookie('jwt', refreshToken, { httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000 });
          res.json({ success: true, token });
        }
      }
    } catch(error){
      if (error instanceof Error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ success: false, error: error.message });
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
}

// Refresh token
async function refresh(req: Request, res: Response): Promise<void>{
  
  if (req.cookies?.jwt) {

    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;
    // console.log(refreshToken);

    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, 
      (error: jwt.VerifyErrors | null, decoded: jwt.JwtPayload| string | undefined) => {
        if (error) {
            // Wrong Refesh Token
            return res.status(406).json({ message: 'Unauthorized' });
        }
        if(typeof decoded=== "string"){
          const decodedPayload = jwt.decode(refreshToken) as { [key: string]: any } | null;
        }
        else {
            // Correct token we send a new access token
            const accessToken = jwt.sign({ id: decoded!.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' });
            return res.json({ accessToken });
        }
    })
    } else {
        res.status(406).json({ message: 'Unauthorized' });
    }
}
           
module.exports={
  signUp,
  login,
  refresh
}