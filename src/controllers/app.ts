import {NextFunction, Request, Response} from 'express';

class HomeController {
    static home(req:Request, res:Response, next: NextFunction): void{
        res.status(200).json({
            status: 'success',
            message: 'Welcome to the GluGuide API!'
        });
    };
}

export default HomeController;